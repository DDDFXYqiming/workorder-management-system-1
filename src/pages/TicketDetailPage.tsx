import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Steps } from 'tdesign-react'
import { orderDetailsAPI } from '@/api'
import CardSection from '@/components/CardSection'
import type { Ticket } from '@/types'
import '@/styles/ticket-detail-base.css'

const { StepItem } = Steps

function TicketProcess({ data }: { data: Ticket }) {
  const status = data.status
  const failed = status === '驳回' || status === '超时'
  return (
    <CardSection title="工单进度" className="ti-info">
      <Steps current={failed ? 2 : 1}>
        {failed ? (
          <>
            <StepItem title="进行中" />
            <StepItem status="error" title="未通过" />
          </>
        ) : (
          <>
            <StepItem title="进行中" />
            <StepItem title="完成" />
          </>
        )}
      </Steps>
    </CardSection>
  )
}

function TicketContent({ data }: { data: Ticket }) {
  return (
    <CardSection title="工单内容" className="ti-info">
      <div className="ti-info-block">
        <div className="ti-info-item">
          <span className="ti-info-item-title">标题：</span>
          <span className="ti-info-item-content">{data.orderName}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">内容：</span>
          <span className="ti-info-item-content">{data.content}</span>
        </div>
      </div>
    </CardSection>
  )
}

function TicketBase({ data }: { data: Ticket }) {
  return (
    <CardSection title="基本信息" className="ti-info">
      <div className="ti-info-block ti-base-info">
        <div className="ti-info-item">
          <span className="ti-info-item-title">工单ID：</span>
          <span className="ti-info-item-content">{data.id}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">创建者：</span>
          <span className="ti-info-item-content">{data.createUser}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">创建时间：</span>
          <span className="ti-info-item-content">{data.createTime}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">当前状态：</span>
          <span className="ti-info-item-content">{data.status}</span>
        </div>
      </div>
    </CardSection>
  )
}

function TicketHistory({ data }: { data: Ticket }) {
  const processList = data.process_list ?? []
  if (processList.length === 0) return null
  return (
    <CardSection title="流转历史" className="ti-info">
      <Steps layout="vertical" theme="dot" current={0}>
        {processList.map((item, index) => (
          <StepItem
            key={index}
            title={item.to ? `由${item.from}指派给${item.to}` : `由${item.from}完成`}
            content={item.desc}
          />
        ))}
      </Steps>
    </CardSection>
  )
}

/** 工单详情页（查看） */
export default function TicketDetailPage() {
  const { ticketId } = useParams()
  const [data, setData] = useState<Ticket>({} as Ticket)

  useEffect(() => {
    if (!ticketId) return
    void orderDetailsAPI(ticketId)
      .then((res) => setData(res.data))
      .catch(() => setData({} as Ticket))
  }, [ticketId])

  return (
    <>
      <TicketProcess data={data} />
      <TicketContent data={data} />
      <TicketBase data={data} />
      <TicketHistory data={data} />
    </>
  )
}
