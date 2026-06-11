import { ApiError } from "./types"

export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"
      throw new ApiError("Unauthorized", "UNAUTHORIZED", 401)
    }

    const error = await response.json().catch(() => ({
      message: response.statusText,
    }))

    throw new ApiError(
      error.message ?? "Unknown error",
      error.code ?? "UNKNOWN",
      response.status,
    )
  }

  return response.json() as Promise<T>
}
