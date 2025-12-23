-- Enable RLS on courts table
ALTER TABLE "public"."courts" ENABLE ROW LEVEL SECURITY;
-- 1. READ: Allow everyone to see courts
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'courts'
        AND policyname = 'Enable read access for all users'
) THEN CREATE POLICY "Enable read access for all users" ON "public"."courts" AS PERMISSIVE FOR
SELECT TO public USING (true);
END IF;
END $$;
-- 2. INSERT: Allow authenticated users to create courts (as long as they set themselves as owner)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'courts'
        AND policyname = 'Enable insert for authenticated users'
) THEN CREATE POLICY "Enable insert for authenticated users" ON "public"."courts" AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));
END IF;
END $$;
-- 3. UPDATE: Allow owners to update their courts
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'courts'
        AND policyname = 'Enable update for owners'
) THEN CREATE POLICY "Enable update for owners" ON "public"."courts" AS PERMISSIVE FOR
UPDATE TO authenticated USING ((auth.uid() = owner_id)) WITH CHECK ((auth.uid() = owner_id));
END IF;
END $$;