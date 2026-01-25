const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || error || !(!await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        token, 
        user: { 
          username: user.username, 
          email: user.email, 
          balance: user.balance, 
          team: user.team, 
          garage: user.garage 
        } 
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server Error' })
    };
  }
};
