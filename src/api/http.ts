import axios from 'axios'
import { getToken } from './token'

export const http = axios.create({
  // 同源路径：开发环境由 Vite proxy 转发到真实后端；MSW 可直接拦截同源请求
  baseURL: '',
  withCredentials: true,
  timeout: 10000,
})

http.interceptors.request.use((req) => {
  const token = getToken()
  if (token) {
    req.headers.token = token
  }
  return req
})

http.interceptors.response.use(
  (response) => {
    // 后端约定：code === 0 表示 token 失效
    if (response.data?.code === 0) {
      clearAuthAndRedirect()
      return Promise.reject(new Error('Token expired'))
    }
    return response.data
  },
  (error) => {
    clearAuthAndRedirect()
    return Promise.reject(error)
  },
)

function clearAuthAndRedirect(): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('user_id')
  sessionStorage.removeItem('user_info')
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
}
