import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Table } from 'tdesign-react'
import { getTicketListAPI } from '@/api'
import StatCard from '@/components/StatCard'
import type { Ticket } from '@/types'
import '@/styles/dashboard-section-one.css'
import '@/styles/dashboard-section-two.css'
import '@/styles/dashboard-section-three.css'

/** 仪表盘：统计卡片 + 周工单量柱状图 */
export default function Dashboard() {
  const [alertCount, setAlertCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [createdCount, setCreatedCount] = useState(0)
  const [todoCount, setTodoCount] = useState(0)
  const [weekData, setWeekData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const loadAll = async () => {
      const [allRes, createdRes, alertRes, todoRes] = await Promise.all([
        getTicketListAPI('allOrders'),
        getTicketListAPI('myOrder'),
        getTicketListAPI('myWarningTask'),
        getTicketListAPI('myCommision'),
      ])
      setTotalCount(allRes.data.length)
      setCreatedCount(createdRes.data.length)
      setAlertCount(alertRes.data.length)
      setTodoCount(todoRes.data.length)

      const counts = [0, 0, 0, 0, 0, 0, 0]
      allRes.data.forEach((item) => {
        const day = new Date(item.createTime).getDay()
        const index = day === 0 ? 6 : day - 1
        counts[index] += 1
      })
      setWeekData(counts)
      setRecentTickets(
        [...allRes.data]
          .sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
          .slice(0, 6),
      )
    }
    void loadAll()
  }, [])

  const option = {
    tooltip: {},
    legend: { data: ['工单数'], right: 0 },
    xAxis: { data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: {
      max: (value: { max: number }) => Math.max(3, Math.ceil(value.max * 1.2)),
    },
    series: [
      {
        name: '工单数',
        type: 'bar',
        data: weekData,
        label: { show: true, position: 'top', color: '#667085', fontSize: 11 },
        itemStyle: { color: '#0052d9' },
      },
    ],
  }

  const cards = [
    { title: '我的预警', number: alertCount, remark: '自上周以来下降10%', mainColor: true },
    { title: '总工单数', number: totalCount, remark: '自上周以来上升25%' },
    { title: '我创建的', number: createdCount, remark: '自上周以来上升15%' },
    { title: '我的待办', number: todoCount, remark: '自上周以来上升12%' },
  ]

  return (
    <>
      <section className="ti-dashbord-section-one">
        {cards.map((card, index) => (
          <div key={index} className="ti-dashbord-section-one-block">
            <StatCard
              title={card.title}
              number={card.number}
              remark={card.remark}
              mainColor={card.mainColor}
            />
          </div>
        ))}
      </section>
      <section className="ti-dashbord-section-two ti-section-wrapper">
        <div className="ti-section-header">
          <div className="ti-section-title-area">
            <span className="ti-title">总工单统计</span>
            <span className="ti-sub-title">（个）</span>
          </div>
        </div>
        <div className="ti-section-content">
          <ReactECharts option={option} style={{ height: 400 }} opts={{ renderer: 'svg' }} />
        </div>
      </section>
      <section className="ti-section-wrapper" style={{ marginTop: 16 }}>
        <div className="ti-section-header">
          <div className="ti-section-title-area">
            <span className="ti-title">最近工单</span>
          </div>
        </div>
        <Table
          data={recentTickets}
          rowKey="id"
          size="medium"
          columns={[
            { colKey: 'id', title: 'ID', width: 60 },
            { colKey: 'orderName', title: '标题', ellipsis: true },
            {
              colKey: 'status',
              title: '状态',
              width: 120,
              cell: ({ row }: { row: Ticket }) => {
                const map: Record<string, string> = {
                  创建: 'saas-status--created',
                  进行中: 'saas-status--processing',
                  处理完成: 'saas-status--done',
                  驳回: 'saas-status--rejected',
                  超时: 'saas-status--timeout',
                }
                return (
                  <span className={`saas-status ${map[row.status] ?? 'saas-status--created'}`}>
                    {row.status}
                  </span>
                )
              },
            },
            { colKey: 'createUser', title: '创建人', width: 100 },
            { colKey: 'createTime', title: '创建时间', width: 180 },
          ]}
          bordered
        />
      </section>
    </>
  )
}
