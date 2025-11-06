-- Migration to support Clerk authentication
-- This removes the foreign key constraint from user_api_keys to allow Clerk user IDs

-- Drop the foreign key constraint on user_api_keys
ALTER TABLE user_api_keys
DROP CONSTRAINT IF EXISTS user_api_keys_user_id_fkey;

-- The user_id column will now accept any string (Clerk user IDs)
-- No need to reference the users table anymore

-- Optional: You can keep the old NextAuth tables for reference
-- or drop them if you don't need them anymore:
-- DROP TABLE IF EXISTS verification_tokens;
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS accounts;
-- DROP TABLE IF EXISTS users;
