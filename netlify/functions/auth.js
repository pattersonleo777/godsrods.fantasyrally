const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };

    try {
        const path = event.path.split('/').pop();
        const body = JSON.parse(event.body);

        if (path === 'register') {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const { data, error } = await supabase
                .from('profiles')
                .insert([{ 
                    username: body.username, 
                    email: body.email, 
                    password: hashedPassword,
                    team: body.team || 'Independent',
                    balance: 10000,
                    garage: [] 
                }])
                .select()
                .single();

            if (error) throw error;
            return { statusCode: 200, headers, body: JSON.stringify({ user: data }) };
        }

        if (path === 'login') {
            const { data: user, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', body.email)
                .single();

            if (!user || error || !(await bcrypt.compare(body.password, user.password))) {
                return { statusCode: 401, headers, body: JSON.stringify({ message: "Invalid Credentials" }) };
            }

            return { statusCode: 200, headers, body: JSON.stringify({ user }) };
        }
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ message: err.message }) };
    }
};
