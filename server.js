const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'gods_rods_secret_key_2026';

// --- Supabase Setup ---
// Replace these with your actual credentials from the Supabase Dashboard
const supabaseUrl = process.env.SUPABASE_URL || 'https://db.pxhszfnibyjaotfiflll.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHN6Zm5pYnlqYW90ZmlsbGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc4NjQzNSwiZXhwIjoyMDUzMzYyNDM1fQ.8k1nJxKtq4jGhZgKqT2N8W7vY0zL9Xm1oP2rS3tQ6wE';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, team } = req.body;

        // Check if user exists in Supabase "profiles" table
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) return res.status(400).json({ message: 'User exists' });

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

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { username, email, balance: 10000, team: newUser.team, garage: [] } });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Server Error' }); 
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || error || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { username: user.username, email: user.email, balance: user.balance, team: user.team, garage: user.garage } });
    } catch (e) { res.status(500).json({ message: 'Server Error' }); }
});

// --- Shop Route ---
app.post('/api/shop/buy', async (req, res) => {
    const { email, item } = req.body;
    
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < item.price) return res.status(400).json({ message: 'Insufficient funds' });

    const newBalance = user.balance - item.price;
    const newGarage = [...user.garage, { ...item, purchaseDate: new Date(), condition: 100 }];

    const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance, garage: newGarage })
        .eq('email', email);
    
    if (error) return res.status(500).json({ message: 'Update failed' });
    res.json({ balance: newBalance, garage: newGarage });
});

// --- Racing Route ---
app.post('/api/race/start', async (req, res) => {
    const { email, carIndex } = req.body;
    
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const win = Math.random() > 0.5;
    const earnings = win ? 1500 : 200;
    
    const newBalance = user.balance + earnings;
    const newGarage = [...user.garage];
    if (newGarage[carIndex]) {
        newGarage[carIndex].condition -= Math.floor(Math.random() * 10);
    }

    await supabase.from('profiles').update({ balance: newBalance, garage: newGarage }).eq('email', email);
    res.json({ win, earnings, balance: newBalance, garage: newGarage });
});

app.listen(PORT, () => {
    console.log(`🚀 GodsRods (Supabase Mode) Live on http://localhost:${PORT}`);
});
