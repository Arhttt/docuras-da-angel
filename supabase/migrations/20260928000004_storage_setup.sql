-- ==============================================================================
-- DOCES DA ANGEL - MIGRATION 004: STORAGE SETUP
-- Data: 28 de setembro de 2026
-- ==============================================================================

-- Criar bucket público para imagens do catálogo
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'catalog-images',
    'catalog-images',
    TRUE,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Políticas de Storage para o bucket catalog-images
CREATE POLICY "Public Read Access for Catalog Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'catalog-images');

CREATE POLICY "Admin Insert Access for Catalog Images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'catalog-images'
        AND app_private.get_user_role(auth.uid()) = 'admin'
    );

CREATE POLICY "Admin Update Access for Catalog Images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'catalog-images'
        AND app_private.get_user_role(auth.uid()) = 'admin'
    );

CREATE POLICY "Admin Delete Access for Catalog Images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'catalog-images'
        AND app_private.get_user_role(auth.uid()) = 'admin'
    );
