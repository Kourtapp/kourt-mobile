-- RLS Policies for court-images bucket
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Anyone can view court images" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload court images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update court images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete court images" ON storage.objects;

    DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

    DROP POLICY IF EXISTS "Anyone can view message attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload message attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete message attachments" ON storage.objects;
END $$;

-- court-images policies
CREATE POLICY "Anyone can view court images"
ON storage.objects FOR SELECT
USING (bucket_id = 'court-images');

CREATE POLICY "Authenticated users can upload court images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'court-images');

CREATE POLICY "Users can update court images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'court-images');

CREATE POLICY "Users can delete court images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'court-images');

-- avatars policies
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- message-attachments policies
CREATE POLICY "Anyone can view message attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'message-attachments');

CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message-attachments');

CREATE POLICY "Users can delete message attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'message-attachments');
