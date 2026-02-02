-- =============================================
-- SUPABASE DATABASE SCHEMA FOR PETITION SYSTEM
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create the petition_signatures table
CREATE TABLE IF NOT EXISTS petition_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    zip_code VARCHAR(10),
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_hash VARCHAR(64), -- For additional duplicate prevention
    verified BOOLEAN DEFAULT false
);

-- Create index on email for fast duplicate checking
CREATE INDEX IF NOT EXISTS idx_petition_email ON petition_signatures(email);

-- Create index on signed_at for counting
CREATE INDEX IF NOT EXISTS idx_petition_signed_at ON petition_signatures(signed_at);

-- Create a view for the public counter (no personal data exposed)
CREATE OR REPLACE VIEW petition_count AS
SELECT COUNT(*) as total_signatures FROM petition_signatures;

-- Enable Row Level Security
ALTER TABLE petition_signatures ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (sign the petition)
CREATE POLICY "Anyone can sign petition" ON petition_signatures
    FOR INSERT WITH CHECK (true);

-- Policy: Only count is publicly readable (through the view)
CREATE POLICY "Public can read count" ON petition_signatures
    FOR SELECT USING (false); -- Direct table access denied

-- Grant access to the view
GRANT SELECT ON petition_count TO anon;
GRANT INSERT ON petition_signatures TO anon;

-- Function to get signature count (for real-time)
CREATE OR REPLACE FUNCTION get_signature_count()
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER FROM petition_signatures;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION get_signature_count() TO anon;

-- =============================================
-- OPTIONAL: Seed with initial signatures for demo
-- =============================================
-- INSERT INTO petition_signatures (first_name, last_name, email) VALUES
-- ('Demo', 'User', 'demo@example.com');
