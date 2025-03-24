import { fetchApi } from "../ApiCommon";
import { ApiResponse } from "../ApiResponse";
import { AuthorizedUser } from "./AuthorizedUser";
import { AuthToken } from "./AuthToken";

const authApiUrl = `${import.meta.env.VITE_API_URL}/api/auth`;

export const AuthApi = {
  login: async (username: string, password: string): Promise<ApiResponse<AuthorizedUser>> => {
    const response = await fetchApi<AuthorizedUser>(`${authApiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 90, // optional, defaults to 60
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies (e.g., accessToken) in the request
    });

    return response;
  },

  me: async (): Promise<ApiResponse<AuthorizedUser>> => {
    const response = await fetchApi<AuthorizedUser>(`${authApiUrl}/me`, {
      method: 'GET',
      credentials: 'include' // Include cookies (e.g., accessToken) in the request
    });

    return response;
  },

  refresh: async (): Promise<ApiResponse<AuthToken>> => {
    const response = await fetchApi<AuthToken>(`${authApiUrl}/refresh`, {
      method: 'POST',
      body: JSON.stringify({
        // refreshToken: 'refreshToken', // Optional, if not provided, the server will use the cookie
        expiresInMins: 90, // optional, defaults to 60
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies (e.g., accessToken) in the request
    });

    return response;
  },
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await fetchApi<null>(`${authApiUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies (e.g., accessToken) in the request
    });

    return response;
  },
};