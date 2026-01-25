#!/bin/bash

echo "🚀 GodsRods Netlify Setup Script"
echo "================================"

# Create netlify functions directory
echo "📁 Creating Netlify functions directory..."
mkdir -p netlify/functions

# Create auth-register function
echo "📝 Creating auth-register function..."
cat > netlify/functions/auth-register.js << 'EOF'
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
EOF

# Create auth-login function
echo "📝 Creating auth-login function..."
cat > netlify/functions/auth-login.js << 'EOF'
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

    if (!user || error || !(await bcrypt.compare(password, user.password))) {
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
EOF

# Create shop-buy function
echo "📝 Creating shop-buy function..."
cat > netlify/functions/shop-buy.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
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
};
EOF

# Create asset directories
echo "📁 Creating asset directories..."
mkdir -p assets/images
mkdir -p assets/models
mkdir -p assets/sounds

# Update frontend API URL
echo "🔄 Updating frontend API URL..."
if [ -f "homepage.godsrods.html" ]; then
    sed -i "s|const API = 'http://localhost:8080/api';|const API = '/.netlify/functions';|g" homepage.godsrods.html
    echo "✅ Updated homepage.godsrods.html"
fi

if [ -f "index.html" ]; then
    sed -i "s|const API = 'http://localhost:8080/api';|const API = '/.netlify/functions';|g" index.html
    echo "✅ Updated index.html"
fi

echo ""
echo "🎉 Netlify setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Deploy to Netlify"
echo "3. Set environment variables in Netlify dashboard"
echo "4. Test the deployment"
echo ""
echo "📁 Created files:"
echo "   - netlify/functions/auth-register.js"
echo "   - netlify/functions/auth-login.js"
echo "   - netlify/functions/shop-buy.js"
echo "   - assets/images/"
echo "   - assets/models/"
echo "   - assets/sounds/"
echo ""
echo "🔧 Don't forget to:"
echo "   - Run the SQL setup in Supabase"
echo "   - Set environment variables in Netlify"
echo "   - Install and run the admin GUI"
