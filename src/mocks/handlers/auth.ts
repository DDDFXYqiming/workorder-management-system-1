import { http } from 'msw'
import { createToken, db } from '../db'
import { fail, ok } from '../utils'

export const authHandlers = [
  /** 登录 */
  http.post('/user/login', async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    const user = db.users.find(
      (u) => u.username === body.username && u.password === body.password,
    )
    if (!user) {
      return fail(0, '用户名或密码错误')
    }
    db.currentUser = user.username
    return ok({
      token: createToken(),
      identity: user.id,
      user_id: user.id,
      user_name: user.username,
      username: user.username,
      position: user.positionName,
      positionName: user.positionName,
      area: user.area,
    })
  }),

  /** 注册 */
  http.post('/user/register', async ({ request }) => {
    const body = (await request.json()) as {
      username?: string
      password?: string
      positionId?: number
      areaId?: string
    }
    if (!body.username || !body.password) {
      return fail(0, '参数不完整')
    }
    if (db.users.some((u) => u.username === body.username)) {
      return fail(0, '用户名已存在')
    }
    const position = db.positions.find((p) => p.id === Number(body.positionId))
    db.users.push({
      id: String(db.users.length + 10),
      username: body.username,
      password: body.password,
      positionName: position?.positionName ?? '未分配',
      area: body.areaId ?? '',
    })
    return ok(null, '注册成功')
  }),

  /** 职位列表（注册页需要，免登录） */
  http.get('/user/allPositions', () => {
    return ok(db.positions)
  }),
]
