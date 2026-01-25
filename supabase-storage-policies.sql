-- Supabase Storage Policies for GodsRods
-- Run this in your Supabase SQL Editor

-- Create a unified bucket for game assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view assets (3D models and images)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'assets' );

-- Allow authenticated users to upload their own car images
CREATE POLICY "User Uploads" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'assets' AND 
    auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "User Updates" ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'assets' AND 
    auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "User Deletes" ON storage.objects FOR DELETE 
USING (
    bucket_id = 'assets' AND 
    auth.role() = 'authenticated'
);
