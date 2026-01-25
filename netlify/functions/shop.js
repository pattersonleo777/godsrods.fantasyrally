const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  const { httpMethod } = event;

  if (httpMethod === 'POST') {
    // BUY CAR
    try {
      const { email, item } = JSON.parse(event.body);
      
      const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'User not found' })
        };
      }
      
      if (user.balance < item.price) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Insufficient funds' })
        };
      }

      const newBalance = user.balance - item.price;
      const newGarage = [...user.garage, { ...item, purchaseDate: new Date(), condition: 100 }];

      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance, garage: newGarage })
        .eq('email', email);
      
      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Update failed' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({ balance: newBalance, garage: newGarage })
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Server Error' })
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' })
  };
};
