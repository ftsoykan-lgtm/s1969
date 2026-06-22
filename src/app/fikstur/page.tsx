import { redirect } from 'next/navigation'

// Eski /fikstur bağlantıları yeni Maç Merkezi'ne yönlenir
export default function FiksturRedirect() {
  redirect('/mac-merkezi')
}
