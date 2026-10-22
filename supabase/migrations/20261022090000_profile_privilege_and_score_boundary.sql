-- Security boundary: applied and read back on 2026-10-22.
-- No customer rows, jobs, payments or secret retrieval invoked.
BEGIN;
CREATE OR REPLACE FUNCTION public.guard_profile_privileges_20261022()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $guard$
DECLARE field_name text; safe_default jsonb; next_value jsonb;
BEGIN
  -- is_admin, role and plan are server-controlled; display/profile edits remain allowed.
  IF auth.role() IN ('anon','authenticated') THEN
    FOR field_name,safe_default IN SELECT key,value FROM pg_catalog.jsonb_each(TG_ARGV[0]::jsonb) LOOP
      next_value := pg_catalog.to_jsonb(NEW)->field_name;
      IF TG_OP='UPDATE' THEN
        IF next_value IS DISTINCT FROM (pg_catalog.to_jsonb(OLD)->field_name) THEN
          RAISE EXCEPTION 'Server-controlled profile field' USING ERRCODE='42501';
        END IF;
      ELSIF next_value IS DISTINCT FROM safe_default THEN
        RAISE EXCEPTION 'Server-controlled profile field' USING ERRCODE='42501';
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$guard$;
CREATE TEMP TABLE security_guard_fixture_20261022 (id integer,display_name text,role text DEFAULT 'user',plan text DEFAULT 'starter',is_admin boolean DEFAULT false) ON COMMIT DROP;
CREATE TRIGGER guard_fixture BEFORE INSERT OR UPDATE ON security_guard_fixture_20261022 FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges_20261022('{"role":"user","plan":"starter","is_admin":false}');
SELECT pg_catalog.set_config('request.jwt.claim.role','authenticated',true);
SELECT pg_catalog.set_config('request.jwt.claims','{"role":"authenticated"}',true);
INSERT INTO security_guard_fixture_20261022(id,display_name) VALUES(1,'fixture');
UPDATE security_guard_fixture_20261022 SET display_name='edited' WHERE id=1;
DO $test$ BEGIN
 IF auth.role() IS DISTINCT FROM 'authenticated' THEN RAISE EXCEPTION 'Fixture auth role missing'; END IF;
 BEGIN UPDATE security_guard_fixture_20261022 SET role='admin'; RAISE EXCEPTION 'Role guard failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN UPDATE security_guard_fixture_20261022 SET plan='enterprise'; RAISE EXCEPTION 'Plan guard failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN UPDATE security_guard_fixture_20261022 SET is_admin=true; RAISE EXCEPTION 'Admin guard failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN INSERT INTO security_guard_fixture_20261022(id,role) VALUES(2,'admin'); RAISE EXCEPTION 'Insert guard failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 IF NOT EXISTS(SELECT 1 FROM security_guard_fixture_20261022 WHERE display_name='edited' AND role='user' AND plan='starter' AND is_admin=false) THEN RAISE EXCEPTION 'Fixture state changed unexpectedly'; END IF;
END $test$;
SELECT pg_catalog.set_config('request.jwt.claim.role','service_role',true);
SELECT pg_catalog.set_config('request.jwt.claims','{"role":"service_role"}',true);
UPDATE security_guard_fixture_20261022 SET role='admin',plan='enterprise',is_admin=true WHERE id=1;
DO $test$ BEGIN IF NOT EXISTS(SELECT 1 FROM security_guard_fixture_20261022 WHERE role='admin' AND plan='enterprise' AND is_admin=true) THEN RAISE EXCEPTION 'Server updates unexpectedly blocked'; END IF; END $test$;
CREATE OR REPLACE TRIGGER security_profile_privilege_guard_20261022 BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges_20261022('{"is_admin":false}');
COMMIT;

BEGIN; SET LOCAL lock_timeout='3s';
ALTER POLICY "ai_scores_admin_write" ON public."ai_scores" TO service_role;
COMMIT;
