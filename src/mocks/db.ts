import type { Position, Ticket, TicketCategory } from '@/types'

export interface MockUser {
  id: string
  username: string
  password: string
  positionName: string
  area: string
}

export const db = {
  users: [
    { id: '1', username: 'admin1', password: '123456', positionName: '审核员', area: '总部' },
    { id: '2', username: 'worker1', password: '123456', positionName: '保洁部', area: '越秀区' },
  ] as MockUser[],
  positions: [
    { id: 1, positionName: '审核员' },
    { id: 2, positionName: '保洁部' },
    { id: 3, positionName: '维修部' },
    { id: 4, positionName: '安保部' },
  ] as Position[],
  categories: [
    { Id: 1, Name: '环境卫生' },
    { Id: 2, Name: '设施维修' },
    { Id: 3, Name: '安全隐患' },
  ] as TicketCategory[],
  tickets: [] as Ticket[],
  /** 当前登录用户名（Mock 简化：按 token 映射到固定演示用户） */
  currentUser: 'worker1',
}

const titles = [
  '楼道垃圾清理不及时',
  '电梯按键损坏',
  '停车场灯光故障',
  '水管漏水报修',
  '消防通道被占用',
  '空调不制冷',
  '门禁系统失灵',
  '外墙瓷砖脱落',
  '垃圾分类标识缺失',
  '监控摄像头离线',
  '电梯异响需要检查',
  '大堂地面破损',
]

const statuses = ['创建', '进行中', '处理完成', '驳回', '超时']

export function initMockData(): void {
  db.tickets = titles.map((title, index) => {
    const status = statuses[index % statuses.length]
    const creator = index % 3 === 0 ? 'worker1' : 'admin1'
    const processList =
      status === '创建'
        ? []
        : [
            { from: '客服分单', to: '审核员', desc: '收到工单申请，进入审核流程', attachment: '' },
            ...(status === '进行中' || status === '处理完成'
              ? [{ from: '审核员', to: '保洁部', desc: '审核通过，转派处理', attachment: '' }]
              : []),
            ...(status === '处理完成'
              ? [{ from: '保洁部', to: '客服分单', desc: '处理完成，回访确认', attachment: '' }]
              : []),
            ...(status === '驳回' ? [{ from: '审核员', to: '客服分单', desc: '资料不全，驳回申请', attachment: '' }] : []),
            ...(status === '超时' ? [{ from: '保洁部', to: '客服分单', desc: '处理超时，进入预警', attachment: '' }] : []),
          ]
    return {
      id: index + 1,
      orderName: title,
      content: `${title}，请相关单位尽快处理。`,
      status,
      createUser: creator,
      createTime: new Date(Date.now() - index * 86400000).toISOString().replace('T', ' ').slice(0, 19),
      areaId: `${(index % 3) + 1}`,
      positionName: ['保洁部', '维修部', '安保部'][index % 3],
      category: db.categories[index % 3].Name,
      process_list: processList,
    }
  })
}

/** 校验请求中的 token */
export function isValidRequest(request: Request): boolean {
  return request.headers.get('token') === 'mock-token-123'
}

/** 生成固定 token（与 localStorage 持久化配合，刷新后登录态保持） */
export function createToken(): string {
  return 'mock-token-123'
}
