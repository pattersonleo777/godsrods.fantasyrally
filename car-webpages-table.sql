-- Table for unique car pages
CREATE TABLE IF NOT EXISTS car_webpages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id BIGINT REFERENCES profiles(id),
    car_name TEXT NOT NULL,
    model_path TEXT, -- Path to 3D model in Supabase Storage
    image_url TEXT,  -- Main display image
    stats JSONB DEFAULT '{"speed": 0, "handling": 0, "power": 0}',
    custom_colors JSONB DEFAULT '{"primary": "#ffffff", "secondary": "#000000"}',
    views BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE car_webpages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view car pages
CREATE POLICY "Allow public viewing of cars" 
ON car_webpages FOR SELECT 
USING (true);

-- Allow owners to create/edit their car pages
CREATE POLICY "Allow owners to manage cars" 
ON car_webpages FOR ALL 
USING (auth.uid()::text = owner_id::text);

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_views(row_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE car_webpages 
    SET views = views + 1 
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
