CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS auth_users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT '{}'
);

INSERT INTO auth_users (user_id, username, password, roles)
VALUES (
  'u-admin',
  'admin',
  crypt('123456', gen_salt('bf')),
  ARRAY['admin']::TEXT[]
)
ON CONFLICT (username) DO NOTHING;
