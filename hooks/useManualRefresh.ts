import { useCallback, useState } from 'react'

/**
 * Drives RefreshControl's `refreshing` prop from a real user pull instead of react-query's
 * `isFetching`/`isRefetching`, which flips true on any background refetch (tab focus, unrelated
 * invalidation, etc.) and makes the native iOS spinner render stuck since it wasn't triggered by a gesture.
 */
export function useManualRefresh(refetch: () => unknown) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  return { refreshing, onRefresh }
}
