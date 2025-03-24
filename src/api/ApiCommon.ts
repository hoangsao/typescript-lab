import { ApiResponse } from './ApiResponse'

const defaultRequestConfig: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
}

const mergeRequestConfig = (defaultConfig: RequestInit, customConfig?: RequestInit): RequestInit => {
  if (!customConfig) {
    return defaultConfig;
  }

  const mergedHeaders = {
    ...defaultConfig.headers,
    ...customConfig.headers,
  };

  return {
    ...defaultConfig,
    ...customConfig,
    headers: mergedHeaders,
  };
}

export const fetchApi = async <T> (url: string, init?: RequestInit, pickHeaders?: string[]) => {
  try {
    const requestInitWithDefaults = mergeRequestConfig(defaultRequestConfig, init)
    const rawResponse = await fetch(url, requestInitWithDefaults)
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

    let data = null
    try {
      data = await rawResponse.json() as T
    }
    catch {
      data = null
    }

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