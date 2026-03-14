-- Run this in your Supabase SQL Editor

-- 1. Add the push_subscription JSONB column to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS push_subscription JSONB;

-- Note: Because we use the SUPABASE_SERVICE_ROLE_KEY in our /api/push route,
-- we do not need to alter any Row Level Security (RLS) policies to make this work.
-- The service role key bypasses RLS, allowing the backend to save and read the tokens safely.
