import { HttpResponse } from 'msw'

export function ok<T>(data: T, message = 'ok') {
  return HttpResponse.json({ code: 1, message, data })
}

export function fail(code: number, message: string) {
  return HttpResponse.json({ code, message, data: null }, { status: code === 401 ? 401 : 200 })
}

export function tokenExpired() {
  return HttpResponse.json({ code: 0, message: 'Token expired', data: null })
}
