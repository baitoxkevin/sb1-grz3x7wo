-- Create super admin user with proper metadata
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'kevin@baito.events',
  crypt('BaitoTest111~~', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'is_super_admin', true,
    'email_verified', true
  ),
  jsonb_build_object(
    'provider', 'email',
    'providers', array['email']::text[]
  ),
  now(),
  now(),
  'authenticated',
  encode(gen_random_bytes(32), 'base64'),
  encode(gen_random_bytes(32), 'base64'),
  encode(gen_random_bytes(32), 'base64'),
  encode(gen_random_bytes(32), 'base64'),
  true
);

-- Ensure RLS policies are in place for super admin access
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can do anything" ON auth.users
  USING (auth.jwt() ->> 'email' = 'kevin@baito.events')
  WITH CHECK (auth.jwt() ->> 'email' = 'kevin@baito.events');

-- Add super admin role to auth schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'super_admin'
  ) THEN
    CREATE ROLE super_admin;
  END IF;
END
$$;

GRANT super_admin TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO super_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO super_admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO super_admin;
