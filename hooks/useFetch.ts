import React, { useEffect, useState } from 'react'
import { ErrorTypes, isErrorResponse } from '@/api/types'

function useFetch<T>(callBack: () => Promise<T | ErrorTypes.ErrorResponse>): {
  isLoading: boolean
  error?: any
  data?: T
} {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<T>()
  const [error, setError] = useState<any>(null)

  const fetch = async () => {
    setIsLoading(true)
    const data = await callBack()
    if (isErrorResponse(data)) {
      setError(data)
    } else {
      setData(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [callBack])

  return {
    isLoading,
    error,
    data,
  }
}

export default useFetch
