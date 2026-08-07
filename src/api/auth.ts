import type { ApiResponse, Position, UserSession } from '@/types'
import { http } from './http'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  positionId: number
  areaId: string
}

/** 登录 */
export function loginAPI(data: LoginParams): Promise<ApiResponse<UserSession>> {
  return http.post('/user/login', data)
}

/** 注册 */
export function registerAPI(data: RegisterParams): Promise<ApiResponse<null>> {
  return http.post('/user/register', data)
}

/** 获取职位列表 */
export function allPositionsAPI(): Promise<ApiResponse<Position[]>> {
  return http.get('/user/allPositions')
}
