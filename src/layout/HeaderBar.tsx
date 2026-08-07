import { Breadcrumb, Button, Dropdown } from 'tdesign-react'
import { ChevronDownIcon, UserCircleIcon } from 'tdesign-icons-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuth } from '@/api/token'

const { BreadcrumbItem } = Breadcrumb

const breadcrumbNameMap: Record<string, string> = {
  '/personalCenter': '个人中心',
  '/ticket/create': '工单申请',
  '/ticket/distribute': '分发工单',
  '/ticket/all': '所有工单',
  '/ticket/todo': '我的待办',
  '/ticket/related-to-me': '我相关的',
  '/ticket/created-by-me': '我创建的',
  '/ticket/alert': '我的预警',
  '/admin/approve/employee': '员工审核',
  '/dashbord/base': '工单统计',
}

function BreadcrumbNav() {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter(Boolean)
  const items = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    const name = breadcrumbNameMap[url]
    if (!name) return null
    if (pathSnippets.length === index + 1) {
      return <BreadcrumbItem key={url}>{name}</BreadcrumbItem>
    }
    return (
      <BreadcrumbItem key={url}>
        <Link className="ti-ticket-link" to={url}>
          {name}
        </Link>
      </BreadcrumbItem>
    )
  })
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link className="ti-ticket-link" to="/">
          首页
        </Link>
      </BreadcrumbItem>
      {items}
    </Breadcrumb>
  )
}

interface HeaderBarProps {
  name: string
}

export default function HeaderBar({ name }: HeaderBarProps) {
  const navigate = useNavigate()
  const options = [
    { content: '个人中心', value: 1 },
    { content: '退出登录', value: 2 },
  ]

  const clickHandler = (data: { value?: unknown }) => {
    if (data.value === 1) {
      navigate('/personalCenter')
    } else if (data.value === 2) {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <>
      <BreadcrumbNav />
      <div className="ti-reference">
        <Dropdown options={options} onClick={clickHandler} trigger="click">
          <Button variant="text">
            <span
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <UserCircleIcon size="20px" />
              <span style={{ margin: '0 10px' }}>{name}</span>
              <ChevronDownIcon />
            </span>
          </Button>
        </Dropdown>
      </div>
    </>
  )
}
