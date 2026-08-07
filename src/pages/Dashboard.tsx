import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { getTicketListAPI } from '@/api'
import StatCard from '@/components/StatCard'
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
    }
    void loadAll()
  }, [])

  const option = {
    tooltip: {},
    legend: { data: ['工单数'] },
    xAxis: { data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: {},
    series: [
      {
        name: '工单数',
        type: 'bar',
        data: weekData,
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
    </>
  )
}
