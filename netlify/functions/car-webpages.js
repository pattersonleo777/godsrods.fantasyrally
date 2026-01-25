const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    const method = event.httpMethod;
    const path = event.path.split('/').pop();

    try {
        // GET a specific car page
        if (method === 'GET' && path !== 'car-webpages') {
            const { data, error } = await supabase
                .from('car_webpages')
                .select('*, profiles(username)')
                .eq('id', path)
                .single();

            if (error) return { statusCode: 404, headers, body: JSON.stringify({ error: "Car not found" }) };
            
            // Increment view count
            await supabase.rpc('increment_views', { row_id: path });

            return { statusCode: 200, headers, body: JSON.stringify(data) };
        }

        // POST - Create a new car webpage
        if (method === 'POST') {
            const body = JSON.parse(event.body);
            const { data, error } = await supabase
                .from('car_webpages')
                .insert([body])
                .select()
                .single();

            if (error) throw error;
            return { statusCode: 200, headers, body: JSON.stringify(data) };
        }

    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
