INSERT INTO auth.roles (role) VALUES ('public') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('private') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('sys:admin') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('org:owner') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('org:admin') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('org:billing') ON CONFLICT (role) DO NOTHING;
INSERT INTO auth.roles (role) VALUES ('org:member') ON CONFLICT (role) DO NOTHING;
