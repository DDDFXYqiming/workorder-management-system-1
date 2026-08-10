import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Edit1Icon } from 'tdesign-icons-react'
import { Table } from 'tdesign-react'
import { getTicketListAPI } from '@/api'
import type { Ticket, TicketQuery } from '@/types'

interface TicketTableProps {
  queryParams: TicketQuery
  selectValue?: string | undefined
}

interface TableRow {
  id: number
  title: string
  status: string
  current_handler: string
  dept: string
  create_time: string
}

const STATUS_CLASS: Record<string, string> = {
  创建: 'saas-status--created',
  进行中: 'saas-status--processing',
  处理完成: 'saas-status--done',
  驳回: 'saas-status--rejected',
  超时: 'saas-status--timeout',
}

function isWithinTimeScope(createTime: string, timeScope: TicketQuery['time_scope']): boolean {
  if (!timeScope || !Array.isArray(timeScope) || timeScope.length < 2) return true
  const create = new Date(createTime).getTime()
  const start = new Date(timeScope[0]).setHours(0, 0, 0, 0)
  const end = new Date(timeScope[1]).setHours(23, 59, 59, 999)
  return create >= start && create <= end
}

function matchStatus(status: string, selectValue: string | undefined): boolean {
  if (selectValue === undefined || selectValue === '') return true
  const finished = ['处理完成', '驳回', '超时'].includes(status)
  return selectValue === '1' ? finished : !finished
}

/** 工单列表表格：拉取数据 + 客户端筛选 + 分页 */
export default function TicketTable({ queryParams, selectValue }: TicketTableProps) {
  const { flog, title, time_scope } = queryParams
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState<TableRow[]>([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const location = useLocation()
  const ticketPath = location.pathname

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await getTicketListAPI(flog)
      const list = (response.data ?? []).filter((item: Ticket) => {
        const titleOk = !title || item.orderName.includes(title)
        const statusOk = matchStatus(item.status, selectValue)
        const timeOk = isWithinTimeScope(item.createTime, time_scope)
        return titleOk && statusOk && timeOk
      })
      setRows(
        list.map((item) => ({
          id: item.id,
          title: item.orderName,
          status: item.status,
          current_handler: item.createUser,
          dept: item.areaId ?? '',
          create_time: item.createTime,
        })),
      )
    } catch {
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flog, title, time_scope, selectValue])

  const columns = [
    { align: 'center' as const, ellipsis: true, colKey: 'id', title: 'ID', width: '21%' },
    { colKey: 'title', ellipsis: true, title: '标题', width: '20%' },
    {
      align: 'center' as const,
      ellipsis: true,
      colKey: 'status',
      title: '当前状态',
      width: '12%',
      cell: ({ row }: { row: TableRow }) => (
        <span className={`saas-status ${STATUS_CLASS[row.status] ?? 'saas-status--created'}`}>
          {row.status}
        </span>
      ),
    },
    { align: 'center' as const, ellipsis: true, colKey: 'current_handler', title: '创建人', width: '13%' },
    { align: 'center' as const, ellipsis: true, colKey: 'dept', title: '区域号', width: '12%' },
    { align: 'center' as const, ellipsis: true, colKey: 'create_time', title: '创建时间', width: '21%' },
    {
      align: 'center' as const,
      ellipsis: true,
      colKey: 'operation',
      title: '操作',
      width: '15%',
      cell: ({ row }: { row: TableRow }) => {
        const action = queryParams.current_handler ? '处理' : '查看'
        return (
          <span>
            <Edit1Icon />
            <Link className="ti-ticket-link" to={`${ticketPath}/detail/${row.id}`}>
              {action}
            </Link>
          </span>
        )
      },
    },
  ]

  return (
    <Table
      stripe
      bordered
      data={rows.slice((current - 1) * pageSize, current * pageSize)}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      pagination={{
        current,
        pageSize,
        total: rows.length,
        onChange: (pageInfo) => {
          setCurrent(pageInfo.current)
          setPageSize(pageInfo.pageSize)
        },
        pageSizeOptions: [5, 10, 15, 20],
      }}
    />
  )
}
