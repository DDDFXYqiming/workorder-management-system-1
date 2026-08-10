import { useEffect, useState } from 'react'
import { Button, DateRangePicker, Input, Select } from 'tdesign-react'
import TicketTable from '@/components/TicketTable'
import type { TicketQuery } from '@/types'
import '@/styles/ticket-list.css'

const { Option } = Select

interface TicketListPageProps {
  params: Omit<TicketQuery, 'title' | 'time_scope'>
  page: 'todo' | 'distribute' | 'list'
}

/** 工单列表页：查询表单（标题/结束状态/时间范围）+ 表格 */
export default function TicketListPage({ params, page }: TicketListPageProps) {
  const [queryParams, setQueryParams] = useState<TicketQuery>({ ...params, title: '', time_scope: null })
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined)
  const [dateValue, setDateValue] = useState<string[]>([])

  const showStatusSelect = page !== 'distribute' && page !== 'todo'

  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, title: inputValue }))
    }, 500)
    return () => clearTimeout(timer)
  }, [inputValue])

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      time_scope: dateValue.length === 2 ? dateValue : null,
    }))
  }, [dateValue])

  const onReset = () => {
    setInputValue('')
    setSelectValue(undefined)
    setDateValue([])
    setQueryParams((prev) => ({ ...prev, title: '', time_scope: null }))
  }

  return (
    <section className="ti-section-wrapper ti-related-wrapper" style={{ height: '100%' }}>
      <div className="ti-section-content">
        <div className="ti-input-area">
          <div className="ti-input-container">
            <div className="ti-input-wapper">
              <span className="ti-input-title">工单标题：</span>
              <Input placeholder="请输入工单标题" onChange={(v) => setInputValue(String(v))} clearable />
            </div>
            {showStatusSelect && (
              <div className="ti-input-wapper">
                <span className="ti-input-title">是否结束：</span>
                <div style={{ display: 'flex', flex: '1 1' }}>
                  <Select
                    value={selectValue}
                    onChange={(v) => setSelectValue(v === undefined || v === '' ? undefined : String(v))}
                    clearable
                  >
                    <Option key="true" label="是" value="1" />
                    <Option key="false" label="否" value="2" />
                  </Select>
                </div>
              </div>
            )}
            <div className="ti-input-wapper">
              <span className="ti-input-title">创建时间：</span>
              <DateRangePicker
                clearable
                onChange={(v) => setDateValue(v.map((d) => String(d)))}
                style={{ flex: '1 1' }}
              />
            </div>
            <div className="ti-input-wapper">
              <Button theme="default" variant="outline" size="small" onClick={onReset}>
                重置
              </Button>
            </div>
          </div>
        </div>
        <div className="ti-table-area">
          <TicketTable queryParams={queryParams} selectValue={selectValue} />
        </div>
      </div>
    </section>
  )
}
