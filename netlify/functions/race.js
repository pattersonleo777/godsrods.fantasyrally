const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  const { httpMethod } = event;

  if (httpMethod === 'POST') {
    // START RACE
    try {
      const { email, carIndex } = JSON.parse(event.body);
      
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
      
      const win = Math.random() > 0.5;
      const earnings = win ? 1500 : 200;
      
      const newBalance = user.balance + earnings;
      const newGarage = [...user.garage];
      if (newGarage[carIndex]) {
        newGarage[carIndex].condition -= Math.floor(Math.random() * 10);
      }

      await supabase
        .from('profiles')
        .update({ balance: newBalance, garage: newGarage })
        .eq('email', email);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ win, earnings, balance: newBalance, garage: newGarage })
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
