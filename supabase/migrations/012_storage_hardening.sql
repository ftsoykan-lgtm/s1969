-- ════════════════════════════════════════════════════════════════
-- 012 — Storage güvenlik sertleştirmesi (media bucket)
--   • Dosya boyutu limiti: 5 MB
--   • Sadece görsel MIME tiplerine izin
--   • Listeleme engeli: anon kullanıcı dosyaları LİSTELEYEMEZ
--     (public bucket olduğu için /object/public/... linkleri YİNE ÇALIŞIR)
-- ════════════════════════════════════════════════════════════════

-- 1) Dosya boyutu + tip limiti (sadece görsel)
update storage.buckets
set
  public = true,
  file_size_limit = 5242880,  -- 5 MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
where id = 'media';

-- 2) Listeleme/enumerasyon engeli
-- Public okuma policy'sini kaldırıp SELECT'i sadece admin'e veriyoruz.
-- NOT: 'media' bucket public olduğu için tek tek dosya linkleri
-- (https://.../object/public/media/...) RLS'e bakılmadan servis edilir —
-- yani sitedeki görseller normal çalışır. Bu policy yalnızca toplu
-- LİSTELEME (list API) erişimini anon kullanıcıya kapatır.
drop policy if exists "media_public_read" on storage.objects;
drop policy if exists "media_auth_read" on storage.objects;
create policy "media_auth_read" on storage.objects
  for select using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Yazma/güncelleme/silme zaten sadece authenticated (admin) — teyit:
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
