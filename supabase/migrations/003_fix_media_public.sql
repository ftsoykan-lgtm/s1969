-- DÜZELTME: 'media' bucket'ını herkese açık (public) yap
-- Sorun: bucket private oluşmuş → yüklenen logolar "Bucket not found" veriyordu
-- Supabase SQL Editor'de çalıştır

-- Bucket yoksa oluştur, varsa public=true yap
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do update set public = true;

-- Public okuma politikası (public bucket için garanti)
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

-- Kontrol: bucket'ın public olduğunu göster
-- (çalıştırınca 'public' sütunu true olmalı)
select id, name, public from storage.buckets where id = 'media';
