import { useState, useEffect, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'

const STORAGE_KEY = 'proSavedOffers'

type Listener = (ids: string[]) => void
const listeners = new Set<Listener>()
let cachedIds: string[] | null = null

async function readIds(): Promise<string[]> {
  if (cachedIds) return cachedIds
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY)
    cachedIds = raw ? JSON.parse(raw) : []
    return cachedIds!
  } catch {
    return []
  }
}

async function writeIds(ids: string[]): Promise<void> {
  cachedIds = ids
  listeners.forEach((l) => l(ids))
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(ids))
}

export function useSavedOffers() {
  const [savedIds, setSavedIds] = useState<string[]>(cachedIds ?? [])

  useEffect(() => {
    readIds().then(setSavedIds)
    listeners.add(setSavedIds)
    return () => {
      listeners.delete(setSavedIds)
    }
  }, [])

  const isSaved = useCallback((id: string | number) => savedIds.includes(String(id)), [savedIds])

  const toggleSaved = useCallback(
    async (id: string | number) => {
      const key = String(id)
      const next = savedIds.includes(key) ? savedIds.filter((i) => i !== key) : [...savedIds, key]
      await writeIds(next)
    },
    [savedIds]
  )

  return { isSaved, toggleSaved, savedIds }
}
