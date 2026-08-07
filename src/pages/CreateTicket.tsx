import { useEffect, useState } from 'react'
import { Button, Form, Input, Radio, Select, Textarea } from 'tdesign-react'
import { MessagePlugin } from 'tdesign-react'
import { useNavigate } from 'react-router-dom'
import { getDefineAPI, operatingPositionsAPI, saveTicketAPI } from '@/api'
import type { Position, TicketCategory } from '@/types'
import '@/styles/create-ticket.css'

const { FormItem } = Form

/** 创建工单页 */
export default function CreateTicket() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [positionValue, setPositionValue] = useState<number>()

  useEffect(() => {
    void getDefineAPI()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
    void operatingPositionsAPI()
      .then((res) => setPositions(res.data))
      .catch(() => setPositions([]))
  }, [])

  const onSubmit = async (e: { validateResult: unknown }) => {
    if (e.validateResult !== true) return
    const values = form.getFieldsValue(true) as {
      orderName: string
      content: string
      proDefId: number
      positionId: number
    }
    const res = await saveTicketAPI(values)
    if (res.code === 1) {
      MessagePlugin.success('申请成功')
      navigate('/')
    } else {
      MessagePlugin.error('申请失败')
    }
  }

  return (
    <section className="ti-section-wrapper ti-create-wrapper" style={{ height: '100%' }}>
      <Form
        form={form}
        colon
        onSubmit={onSubmit}
        labelAlign="top"
        rules={{
          orderName: [
            { required: true, message: '必填', type: 'error' },
            { min: 2, message: '至少需要两个字', type: 'error' },
          ],
          content: [
            { required: true, message: '必填', type: 'error' },
            { min: 10, message: '至少需要十个字', type: 'error' },
          ],
        }}
      >
        <div className="ti-form-basic-container">
          <div className="ti-form-basic-item">
            <div className="ti-form-basic-container-title">创建工单</div>
            <FormItem label="标题" name="orderName">
              <Input placeholder="请输入内容" />
            </FormItem>
            <FormItem label="内容" name="content">
              <Textarea placeholder="请输入内容" autosize={{ minRows: 3, maxRows: 10 }} maxlength={200} />
            </FormItem>
            <FormItem label="分类" name="proDefId" rules={[{ required: true, message: '必选', type: 'error' }]}>
              <Radio.Group>
                {categories.map((item) => (
                  <Radio value={item.Id} key={item.Id}>
                    {item.Name}
                  </Radio>
                ))}
              </Radio.Group>
            </FormItem>
            <FormItem label="操作单位" name="positionId" rules={[{ required: true, message: '必选', type: 'error' }]}>
              <Select
                value={positionValue}
                onChange={(v) => setPositionValue(v === undefined || v === '' ? undefined : Number(v))}
                style={{ width: '40%' }}
                clearable
                options={positions.map((item) => ({ label: item.positionName, value: item.id }))}
              />
            </FormItem>
          </div>
        </div>
        <div className="ti-form-submit-container">
          <div className="ti-form-submit-sub">
            <Button type="submit" content="提交" />
            <Button type="reset" theme="default" content="取消" className="reset" />
          </div>
        </div>
      </Form>
    </section>
  )
}
