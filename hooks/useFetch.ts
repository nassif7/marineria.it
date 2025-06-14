import React, { useEffect, useState } from 'react'
import { ErrorTypes, isErrorResponse } from '@/api/types'

function useFetch<T>(
  fetchCallBack: () => Promise<T | ErrorTypes.ErrorResponse>,
  onError?: () => void
): {
  isLoading: boolean
  error?: ErrorTypes.ErrorResponse | null
  data?: T
} {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<T>()
  const [error, setError] = useState<any>(null)

  const fetch = async () => {
    setIsLoading(true)
    const data = await fetchCallBack()

    if (isErrorResponse(data)) {
      if (onError) {
        onError()
      }
      setError(data)
    } else {
      setData(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [fetchCallBack])

  return {
    isLoading,
    error,
    data,
  }
}

export default useFetch
