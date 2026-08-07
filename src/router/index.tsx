import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { getToken, getUserId, getUserInfo } from '@/api/token'
import AppLayout from '@/layout/AppLayout'
import Login from '@/pages/Login'
import Status from '@/pages/Status'
import Dashboard from '@/pages/Dashboard'
import PersonalCenter from '@/pages/PersonalCenter'
import CreateTicket from '@/pages/CreateTicket'
import TicketListPage from '@/pages/TicketListPage'
import TicketDetailPage from '@/pages/TicketDetailPage'
import HandleTicketPage from '@/pages/HandleTicketPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import type { ReactNode } from 'react'

/** 路由守卫：无登录态跳转登录页 */
function AuthGuard({ children }: { children: ReactNode }) {
  const token = getToken()
  const userId = getUserId()
  const userInfo = getUserInfo()
  if (!token || !userId || !userInfo) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

/** 工单列表参数（保持原后端契约） */
const ticketListPages = {
  todo: { type: 2, status: 1, current_handler: 'current', flog: 'myCommision' },
  alert: { type: 2, status: 1, flog: 'myWarningTask' },
  created: { type: 2, creator_id: 'current', flog: 'myOrder' },
  related: { type: 2, relative_staff: 'current', flog: 'operationLog' },
  all: { type: 1, flog: 'allOrders' },
  distribute: { type: 2, status: 0, flog: 'allOrders' },
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'personalCenter', element: <PersonalCenter /> },
      { path: 'dashbord/base', element: <Dashboard /> },
      { path: 'dashbord/details', element: <Dashboard /> },
      { path: 'ticket/create', element: <CreateTicket /> },
      { path: 'ticket/todo', element: <TicketListPage params={ticketListPages.todo} page="todo" /> },
      { path: 'ticket/alert', element: <TicketListPage params={ticketListPages.alert} page="todo" /> },
      { path: 'ticket/created-by-me', element: <TicketListPage params={ticketListPages.created} page="list" /> },
      { path: 'ticket/related-to-me', element: <TicketListPage params={ticketListPages.related} page="list" /> },
      { path: 'ticket/all', element: <TicketListPage params={ticketListPages.all} page="list" /> },
      { path: 'ticket/distribute', element: <TicketListPage params={ticketListPages.distribute} page="distribute" /> },
      { path: 'ticket/todo/detail/:ticketId', element: <HandleTicketPage /> },
      { path: 'ticket/alert/detail/:ticketId', element: <HandleTicketPage /> },
      { path: 'ticket/created-by-me/detail/:ticketId', element: <TicketDetailPage /> },
      { path: 'ticket/related-to-me/detail/:ticketId', element: <TicketDetailPage /> },
      { path: 'ticket/all/detail/:ticketId', element: <TicketDetailPage /> },
      { path: 'ticket/distribute/detail/:ticketId', element: <TicketDetailPage /> },
      { path: 'admin/approve/employee', element: <PlaceholderPage title="员工审核" /> },
      { path: 'admin/role', element: <PlaceholderPage title="角色管理" /> },
      { path: 'admin/position', element: <PlaceholderPage title="岗位管理" /> },
      { path: 'admin/department', element: <PlaceholderPage title="部门管理" /> },
      { path: 'personal', element: <PlaceholderPage title="个人中心" /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'status', element: <Status /> },
]

export default routes
