import { Layout } from 'tdesign-react'
import { Outlet } from 'react-router-dom'
import { getUserInfo } from '@/api/token'
import SideMenu from './SideMenu'
import HeaderBar from './HeaderBar'
import '@/styles/layout.css'

const { Header, Content, Aside } = Layout

/** 主布局：侧边栏 + 顶栏（面包屑/用户下拉）+ 内容区 */
export default function AppLayout() {
  const userInfo = getUserInfo<{ name?: string; user_name?: string }>()
  const name = userInfo?.name ?? userInfo?.user_name ?? ''

  return (
    <Layout>
      <Aside width="auto" style={{ fontSize: 0 }}>
        <SideMenu />
      </Aside>
      <Layout className="ti-flex">
        <Header id="ti-header">
          <HeaderBar name={name} />
        </Header>
        <div className="ti-content-and-footer-wrapper">
          <Content style={{ padding: 24 }}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  )
}
