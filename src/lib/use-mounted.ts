'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * İstemcide mount olunca true döner; sunucuda ve hydration'ın ilk render'ında false.
 *
 * useSyncExternalStore ile yazıldı: getServerSnapshot=false → SSR ve ilk istemci
 * paint'i AYNI değeri görür (hydration mismatch yok), ardından client snapshot=true
 * ile güncellenir. `useEffect` içinde setState yapmadığı için
 * `react-hooks/set-state-in-effect` kuralını tetiklemez.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
