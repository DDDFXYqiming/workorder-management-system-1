import { http } from 'msw'
import { db, isValidRequest } from '../db'
import { fail, ok } from '../utils'
import type { ProcessItem, Ticket } from '@/types'

function buildTicketList(flog: string, username: string): Ticket[] {
  switch (flog) {
    case 'allOrders':
      return db.tickets
    case 'myOrder':
      return db.tickets.filter((t) => t.createUser === username)
    case 'myCommision':
      return db.tickets.filter((t) => t.status === '进行中')
    case 'myWarningTask':
      return db.tickets.filter((t) => t.status === '超时')
    case 'operationLog':
      return db.tickets.filter((t) => t.status !== '创建')
    default:
      return []
  }
}

export const processHandlers = [
  /** 工单分类 */
  http.get('/process/getDefine', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    return ok(db.categories)
  }),

  /** 操作单位 */
  http.get('/process/operatingPositions', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    return ok(db.positions)
  }),

  /** 协助单位 */
  http.get('/process/assistantPositions', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    return ok(db.positions.slice(1))
  }),

  /** 创建工单 */
  http.post('/process/save', async ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const body = (await request.json()) as {
      orderName?: string
      content?: string
      proDefId?: number
      positionId?: number
    }
    if (!body.orderName || !body.content) {
      return fail(0, '参数不完整')
    }
    const position = db.positions.find((p) => p.id === Number(body.positionId))
    const category = db.categories.find((c) => c.Id === Number(body.proDefId))
    const ticket: Ticket = {
      id: Date.now(),
      orderName: body.orderName,
      content: body.content,
      status: '创建',
      createUser: db.currentUser,
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      areaId: '1',
      positionName: position?.positionName ?? '',
      category: category?.Name ?? '',
      process_list: [],
    }
    db.tickets.unshift(ticket)
    return ok(null, '申请成功')
  }),

  /** 工单详情 */
  http.get('/process/orderDetails', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const url = new URL(request.url)
    const orderId = Number(url.searchParams.get('orderId'))
    const ticket = db.tickets.find((t) => t.id === orderId)
    if (!ticket) return fail(0, '工单不存在')
    return ok(ticket)
  }),

  /** 完成/驳回工单 */
  http.get('/process/completeTask', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const url = new URL(request.url)
    const flag = url.searchParams.get('flag') === 'true'
    const orderId = Number(url.searchParams.get('orderId'))
    const ticket = db.tickets.find((t) => t.id === orderId)
    if (!ticket) return fail(0, '工单不存在')
    ticket.status = flag ? '处理完成' : '驳回'
    ticket.process_list = ticket.process_list ?? []
    ticket.process_list.push({
      from: db.currentUser,
      to: '客服分单',
      desc: flag ? '处理完成，回访确认' : '审核不通过，驳回申请',
    } satisfies ProcessItem)
    return ok(null, flag ? '结束成功' : '审核成功')
  }),

  /** 转派协助单位 */
  http.post('/process/setAssignee', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const url = new URL(request.url)
    const orderId = Number(url.searchParams.get('orderId'))
    const positionId = Number(url.searchParams.get('positionId'))
    const ticket = db.tickets.find((t) => t.id === orderId)
    if (!ticket) return fail(0, '工单不存在')
    const position = db.positions.find((p) => p.id === positionId)
    ticket.status = '进行中'
    ticket.process_list = ticket.process_list ?? []
    ticket.process_list.push({
      from: db.currentUser,
      to: position?.positionName ?? '未知单位',
      desc: '转派给协助单位处理',
    } satisfies ProcessItem)
    return ok(null, '派发工单成功')
  }),

  /** 更新用户信息 */
  http.post('/api/v1/updateUser', async ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const body = (await request.json()) as { user_name?: string }
    if (body.user_name) {
      db.users.find((u) => u.username === db.currentUser)!.username = body.user_name
      db.currentUser = body.user_name
    }
    return ok(null, '更新成功')
  }),

  /** COS 临时密钥 */
  http.get('/api/tx/v1/cos/sts', ({ request }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      credentials: {
        tmpSecretId: 'mock-tmp-secret-id',
        tmpSecretKey: 'mock-tmp-secret-key',
        sessionToken: 'mock-session-token',
      },
      startTime: now,
      expiredTime: now + 1800,
    }
    return ok(JSON.stringify(payload))
  }),

  /** 工单列表（按 flog 区分，须放在最后避免吞掉具体接口） */
  http.get('/process/:flog', ({ request, params }) => {
    if (!isValidRequest(request)) return fail(401, '未登录')
    const flog = String(params.flog)
    return ok(buildTicketList(flog, db.currentUser))
  }),
]
