import { redirect } from 'next/navigation'

// Fikstür, sonuçlar ve puan durumu TFF'den otomatik çekilir — admin yönetimi kaldırıldı
export default function Redirect() {
  redirect('/admin')
}
