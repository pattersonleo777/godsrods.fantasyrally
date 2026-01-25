const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  try {
    const { username, email, password, team } = JSON.parse(event.body);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User exists' })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('profiles')
      .insert([{
        username,
        email,
        password: hashedPassword,
        team: team || 'Independent',
        balance: 10000,
        garage: []
      }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        token, 
        user: { username, email, balance: 10000, team: newUser.team, garage: [] } 
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server Error' })
    };
  }
};
