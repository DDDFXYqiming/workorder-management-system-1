import type { ApiResponse, Position, Ticket, TicketCategory } from '@/types'
import { http } from './http'

/** 按分类标识获取工单列表（flog: allOrders/myOrder/myWarningTask/myCommision/operationLog） */
export function getTicketListAPI(flog: string): Promise<ApiResponse<Ticket[]>> {
  return http.get(`/process/${flog}`)
}

/** 获取工单分类 */
export function getDefineAPI(): Promise<ApiResponse<TicketCategory[]>> {
  return http.get('/process/getDefine?currentpage=1&pagesize=999')
}

/** 获取操作单位列表 */
export function operatingPositionsAPI(): Promise<ApiResponse<Position[]>> {
  return http.get('/process/operatingPositions')
}

/** 获取协助单位列表 */
export function assistantPositionsAPI(): Promise<ApiResponse<Position[]>> {
  return http.get('/process/assistantPositions')
}

/** 创建工单 */
export function saveTicketAPI(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return http.post('/process/save', data)
}

/** 工单详情 */
export function orderDetailsAPI(orderId: string): Promise<ApiResponse<Ticket>> {
  return http.get(`/process/orderDetails?orderId=${orderId}`)
}

/** 完成/驳回工单 */
export function completeTaskAPI(flag: boolean, orderId: number): Promise<ApiResponse<null>> {
  return http.get(`/process/completeTask?flag=${flag}&orderId=${orderId}`)
}

/** 转派协助单位 */
export function setAssigneeAPI(orderId: number, positionId: number): Promise<ApiResponse<null>> {
  return http.post(`/process/setAssignee?orderId=${orderId}&positionId=${positionId}`)
}

/** 更新用户信息 */
export function updateUserAPI(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return http.post('/api/v1/updateUser', data)
}
