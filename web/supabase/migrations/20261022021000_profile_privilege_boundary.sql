-- Applied live on 2026-10-22; isolated database fixture tests passed.
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
DROP TRIGGER IF EXISTS security_profile_privilege_guard_20261022 ON public.profiles;
CREATE TRIGGER security_profile_privilege_guard_20261022 BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges_20261022('{"is_admin":false}');
COMMIT;
