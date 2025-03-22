import { ApiResponse } from './ApiResponse'

export const fetchApi = async <T> (url: string, init?: RequestInit, pickHeaders?: string[]) => {
  try {
    const rawResponse = await fetch(url, init)
    if (!rawResponse.ok) {
      const result = new ApiResponse<T>({
        data: null,
        error: rawResponse.statusText,
        ok: rawResponse.ok,
        status: rawResponse.status
      })
      return result
    }

    const headers = {} as Record<string, string | null>
    pickHeaders?.forEach(h => {
      headers[h] = rawResponse.headers.get(h)
    })

    const data = await rawResponse.json() as T
    const result = new ApiResponse<T>({
      data: data,
      headers: headers,
      ok: rawResponse.ok,
      status: rawResponse.status
    })
    return result
  }
  catch (error) {
    console.error(error)
    throw error
  }
}