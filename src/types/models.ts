/** 统一接口响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message?: string
  data: T
}

/** 登录用户信息（sessionStorage user_info 内容） */
export interface UserSession {
  token?: string
  identity?: string
  user_id?: string
  user_name?: string
  username?: string
  position?: string
  positionName?: string
  area?: string
  [key: string]: unknown
}

/** 职位 */
export interface Position {
  id: number
  positionName: string
}

/** 工单分类 */
export interface TicketCategory {
  Id: number
  Name: string
}

/** 工单流转记录 */
export interface ProcessItem {
  from: string
  to?: string
  desc: string
  attachment?: string
}

/** 工单 */
export interface Ticket {
  id: number
  orderName: string
  content: string
  status: string
  createUser: string
  createTime: string
  areaId?: string
  positionName?: string
  category?: string
  process_list?: ProcessItem[]
  attachment?: string
}

/** 工单列表查询参数 */
export interface TicketQuery {
  type?: number
  status?: number
  current_handler?: string
  creator_id?: string
  relative_staff?: string
  flog: string
  title?: string
  time_scope?: string[] | string | null
  pageIndex?: number
  pageSize?: number
}

/** COS 临时密钥响应 */
export interface CosStsData {
  credentials: {
    tmpSecretId: string
    tmpSecretKey: string
    sessionToken: string
  }
  startTime: number
  expiredTime: number
}
