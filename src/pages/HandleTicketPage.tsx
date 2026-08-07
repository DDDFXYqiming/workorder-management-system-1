import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Radio, Select } from 'tdesign-react'
import { MessagePlugin } from 'tdesign-react'
import { assistantPositionsAPI, completeTaskAPI, orderDetailsAPI, setAssigneeAPI } from '@/api'
import { getUserId } from '@/api/token'
import CardSection from '@/components/CardSection'
import type { Position, Ticket } from '@/types'
import '@/styles/ticket-detail-base.css'

const { FormItem } = Form

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
      <div className="ti-info-block">
        {processList.map((item, index) => (
          <div className="ti-info-item" key={index}>
            <span className="ti-info-item-title">
              {item.to ? `由${item.from}指派给${item.to}` : `由${item.from}完成`}：
            </span>
            <span className="ti-info-item-content">{item.desc}</span>
          </div>
        ))}
      </div>
    </CardSection>
  )
}

/** 处理工单页：审核 / 转派 / 完成 */
export default function HandleTicketPage() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [data, setData] = useState<Ticket>({} as Ticket)
  const [assistantPositions, setAssistantPositions] = useState<Position[]>([])
  const [positionId, setPositionId] = useState<number>()
  const userId = getUserId()
  const isApprover = userId === '1'

  useEffect(() => {
    if (!ticketId) return
    void orderDetailsAPI(ticketId)
      .then((res) => setData(res.data))
      .catch(() => setData({} as Ticket))
    void assistantPositionsAPI()
      .then((res) => setAssistantPositions(res.data))
      .catch(() => setAssistantPositions([]))
  }, [ticketId])

  const onSubmit = async (e: { validateResult: unknown }) => {
    if (e.validateResult !== true) return
    const values = form.getFieldsValue(true) as { complete?: number }
    const orderId = Number(ticketId)

    // 审核：通过/驳回
    if (values.complete === 0 || values.complete === 1) {
      const flag = values.complete === 1
      const res = await completeTaskAPI(flag, orderId)
      if (res.code === 1) {
        MessagePlugin.success(flag ? '审核成功' : '已驳回')
      } else {
        MessagePlugin.error('审核失败')
      }
      navigate('/')
      return
    }

    // 转派
    if (!positionId) {
      MessagePlugin.warning('请选择协助单位！')
      return
    }
    const res = await setAssigneeAPI(orderId, positionId)
    if (res.code === 1) {
      MessagePlugin.success('派发工单成功')
      navigate('/')
    } else {
      MessagePlugin.error('提交失败')
      navigate('/')
    }
  }

  const onSubmitComplete = async () => {
    const res = await completeTaskAPI(true, Number(ticketId))
    if (res.code === 1) {
      MessagePlugin.success('结束成功')
      navigate('/')
    } else {
      MessagePlugin.error('操作失败')
    }
  }

  return (
    <>
      <TicketContent data={data} />
      <TicketBase data={data} />
      <TicketHistory data={data} />
      <CardSection title="处理工单" className="ti-info">
        <Form form={form} colon rules={{}} onSubmit={onSubmit}>
          {isApprover ? (
            <FormItem label="是否通过" name="complete" rules={[{ required: true, message: '必选', type: 'error' }]}>
              <Radio.Group defaultValue={0}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </FormItem>
          ) : (
            <FormItem label="转发给" name="handler">
              <Select
                value={positionId}
                onChange={(v) => setPositionId(Number(v))}
                style={{ width: '40%' }}
                clearable
                options={assistantPositions.map((item) => ({ label: item.positionName, value: item.id }))}
              />
            </FormItem>
          )}
          <div className="ti-handle-submit-container">
            <FormItem style={{ marginLeft: 25 }}>
              <Button type="submit" content={isApprover ? '审核' : '分发'} />
              {!isApprover && (
                <Button style={{ marginLeft: 50 }} onClick={onSubmitComplete} type="button" content="完成工单" />
              )}
            </FormItem>
          </div>
        </Form>
      </CardSection>
    </>
  )
}
