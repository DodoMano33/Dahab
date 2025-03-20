
-- Function to clear schema cache
CREATE OR REPLACE FUNCTION public.clear_schema_cache()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a dummy function that doesn't actually need to do anything
  -- The act of calling it will force a schema refresh in the client
  RETURN TRUE;
END;
$$;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION public.clear_schema_cache() TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_schema_cache() TO anon;
GRANT EXECUTE ON FUNCTION public.clear_schema_cache() TO service_role;
