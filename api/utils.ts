import type { ErrorResponse } from './types/errors'

export function getLanguageCode(lang?: string): string {
  return { en: 'ENG', it: 'ITA' }[lang || ''] || 'ENG'
}

export class ApiError extends Error implements ErrorResponse {
  status: number
  title: string

  constructor(status: number, title = 'unknown-error') {
    super(title)
    this.name = 'ApiError'
    this.status = status
    this.title = title
  }
}

type ApiRequestInit = RequestInit

export async function apiFetchJson<TResponse>(url: string, init?: ApiRequestInit): Promise<TResponse> {
  const response = await fetch(url, init)

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    let message: string | undefined
    try {
      const parsed = JSON.parse(body)
      message = parsed.message || parsed.title || parsed.error || body || undefined
    } catch {
      message = body || undefined
    }
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<TResponse>
}

export async function apiFetchText(url: string, init?: ApiRequestInit): Promise<string> {
  const response = await fetch(url, init)

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new ApiError(response.status, body || undefined)
  }

  return response.text()
}
