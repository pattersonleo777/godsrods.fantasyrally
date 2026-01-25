# GodsRods Full-Stack Webapp Setup Instructions

## 🚀 Overview
Complete setup for GodsRods racing game with cloud deployment and admin monitoring.

## 📋 Prerequisites
- Node.js installed on your machine
- Supabase account (free)
- Netlify account (free)
- GitHub account (free)

---

## 🗄️ Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project: `godsrods-racing`

### 1.2 Set Up Database Tables
1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Run this SQL:

```sql
-- Create profiles table for users
CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    team TEXT DEFAULT 'Independent',
    balance BIGINT DEFAULT 10000,
    garage JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    price BIGINT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create races table
CREATE TABLE IF NOT EXISTS races (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    pot BIGINT DEFAULT 0,
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Get Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIs...`)

---

## 🌐 Step 2: Netlify Deployment

### 2.1 Prepare Project for Netlify
1. Create `netlify/functions` folder in your project
2. Move API functions to separate files:

```bash
mkdir netlify/functions
```

### 2.2 Create Netlify Functions
Create these files in `netlify/functions/`:

**`netlify/functions/auth-register.js`:**
```javascript
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
```

**`netlify/functions/auth-login.js`:**
```javascript
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
```

**`netlify/functions/shop-buy.js`:**
```javascript
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
```

### 2.3 Update Frontend API URLs
In `homepage.godsrods.html`, change:
```javascript
const API = 'http://localhost:8080/api';
```
To:
```javascript
const API = '/.netlify/functions';
```

### 2.4 Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select `godsrods.fantasyrally` repository
5. **Build settings:**
   - Build command: `npm install`
   - Publish directory: `.` (root)
6. **Environment variables:**
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_KEY`: Your Supabase anon key
   - `JWT_SECRET`: `gods_rods_secret_key_2026`
7. Click "Deploy site"

---

## 🖥️ Step 3: Admin GUI Setup

### 3.1 Install Admin GUI
```bash
cd admin-gui
npm install
```

### 3.2 Run Admin Dashboard
```bash
npm start
```

This will open a desktop application showing:
- ✅ Supabase database status
- ✅ Netlify deployment status  
- ✅ GitHub repository status
- ✅ Live user data
- ✅ System logs
- ✅ Auto-refresh every 30 seconds

---

## 📱 Step 4: Asset Structure Setup

### 4.1 Create Asset Folders
```bash
mkdir assets
mkdir assets/images
mkdir assets/models
mkdir assets/sounds
```

### 4.2 Supabase Storage Setup
1. Go to Supabase dashboard → **Storage**
2. Create buckets:
   - `car-images` (public)
   - `user-uploads` (private)
   - `3d-models` (public)

---

## 🧪 Step 5: Testing

### 5.1 Test Registration
1. Open your Netlify site
2. Click "JOIN CIRCUIT"
3. Fill out registration form
4. Check if user appears in admin GUI

### 5.2 Test Login
1. Use registered credentials
2. Verify balance shows $10,000
3. Check garage is empty

### 5.3 Test Shop
1. Buy a car
2. Verify balance decreases
3. Check car appears in garage

### 5.4 Test Admin GUI
1. All services should show "Online"
2. User data should populate
3. Logs should show activity

---

## 📲 Step 6: Mobile App Preparation

### 6.1 API Ready for Mobile
Your Netlify functions are now mobile-ready:
- Base URL: `https://yoursite.netlify.app/.netlify/functions`
- Same endpoints work for mobile apps
- JWT authentication included

### 6.2 Mobile Development Options
- **React Native**: Use same React components
- **Flutter**: Call same API endpoints
- **Ionic**: Use web view with existing HTML

---

## 🔧 Troubleshooting

### Common Issues:

**404 Errors on Registration:**
- Check Supabase tables exist (run SQL from Step 1.2)
- Verify environment variables in Netlify

**CORS Errors:**
- Netlify automatically handles CORS
- Local development may need CORS headers

**Admin GUI Not Connecting:**
- Check Supabase credentials in main.js
- Verify internet connection

**Deploy Failures:**
- Check package.json has correct dependencies
- Verify netlify/functions folder structure

---

## 📊 Monitoring

### Admin GUI Features:
- **Real-time status** of all services
- **User management** and data viewing
- **System logs** for debugging
- **Auto-refresh** every 30 seconds
- **Manual refresh** capability

### Netlify Features:
- **Deploy previews** for testing
- **Function logs** in dashboard
- **Analytics** for site traffic
- **Form handling** built-in

### Supabase Features:
- **Database dashboard** for direct queries
- **Storage management** for files
- **Real-time subscriptions**
- **Backup and restore**

---

## 🎯 Next Steps

1. **Test everything** using the steps above
2. **Deploy to production** on Netlify
3. **Set up custom domain** (optional)
4. **Start mobile app development**
5. **Add more features** (racing, leaderboards, etc.)

---

## 🆘 Support

If you encounter issues:
1. Check the admin GUI logs
2. Verify all environment variables
3. Ensure Supabase tables exist
4. Test API endpoints individually

**Your full-stack webapp is now ready for mobile app development!** 🚀
