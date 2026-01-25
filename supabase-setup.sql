-- Create profiles table for Supabase
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

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create cars table for future use
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    price BIGINT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create races table for future use
CREATE TABLE IF NOT EXISTS races (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    pot BIGINT DEFAULT 0,
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
