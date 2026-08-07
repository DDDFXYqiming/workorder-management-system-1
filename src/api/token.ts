const TOKEN_KEY = 'token'
const USER_ID_KEY = 'user_id'
const USER_INFO_KEY = 'user_info'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserId(): string | null {
  return sessionStorage.getItem(USER_ID_KEY)
}

export function setUserId(id: string): void {
  sessionStorage.setItem(USER_ID_KEY, id)
}

export function removeUserId(): void {
  sessionStorage.removeItem(USER_ID_KEY)
}

export function getUserInfo<T = Record<string, unknown>>(): T | null {
  const raw = sessionStorage.getItem(USER_INFO_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setUserInfo(info: unknown): void {
  sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo(): void {
  sessionStorage.removeItem(USER_INFO_KEY)
}

/** 清空全部登录态 */
export function clearAuth(): void {
  removeToken()
  removeUserId()
  removeUserInfo()
}
