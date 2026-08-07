import { Fragment, useEffect, useState } from 'react'
import { Menu } from 'tdesign-react'
import {
  AppIcon,
  DashboardIcon,
  SettingIcon,
  ViewListIcon,
  ViewModuleIcon,
} from 'tdesign-icons-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserId } from '@/api/token'
import '@/styles/aside.css'

const { SubMenu, MenuItem } = Menu

/** 路径 → 菜单值映射（保持原版高亮逻辑） */
const menuValueMap: Record<string, string> = {
  '/': '0-1',
  '/dashbord/base': '0-1',
  '/personalCenter': '0-3',
  '/ticket/create': '1-1',
  '/ticket/todo': '1-2',
  '/ticket/created-by-me': '1-3',
  '/ticket/related-to-me': '1-4',
  '/ticket/all': '1-5',
  '/ticket/distribute': '1-6',
  '/ticket/alert': '1-7',
  '/ticket/todo/detail': '1-2',
  '/ticket/created-by-me/detail': '1-3',
  '/ticket/related-to-me/detail': '1-4',
  '/ticket/distribute/detail': '1-6',
  '/ticket/all/detail': '1-5',
  '/admin/approve/employee': '2-1',
}

const detailPaths = [
  '/ticket/todo/detail',
  '/ticket/created-by-me/detail',
  '/ticket/related-to-me/detail',
  '/ticket/all/detail',
  '/ticket/distribute/detail',
]

function resolveMenuValue(pathname: string): string {
  const path = detailPaths.find((p) => pathname.startsWith(p)) ?? pathname
  return menuValueMap[path] ?? '0-1'
}

export default function SideMenu() {
  const location = useLocation()
  const navigate = useNavigate()
  const userId = getUserId()
  // 原版：仅 user_id=1（审核员）显示分发，系统管理默认隐藏
  const [showDistribute] = useState(userId === '1')
  const [collapsed, setCollapsed] = useState(true)
  const [expands, setExpands] = useState(['0', '1'])
  const [logoContent, setLogoContent] = useState<React.ReactNode>('工单系统')
  const [active, setActive] = useState(resolveMenuValue(location.pathname))

  useEffect(() => {
    setActive(resolveMenuValue(location.pathname))
  }, [location.pathname])

  const toggleCollapse = () => {
    setLogoContent(collapsed ? <AppIcon /> : '工单系统')
    setCollapsed(!collapsed)
  }

  return (
    <Fragment>
      <Menu
        className="ti-aside-nav"
        value={active}
        collapsed={collapsed}
        logo={logoContent}
        expanded={expands}
        onExpand={(values) => setExpands(values.map(String))}
        onChange={(v) => setActive(String(v))}
        operations={<ViewListIcon className="t-menu__operations-icon" onClick={toggleCollapse} />}
      >
        <SubMenu value="0" title={<span>统计报表</span>} icon={<DashboardIcon />}>
          <MenuItem value="0-1" onClick={() => navigate('/dashbord/base')}>
            工单统计
          </MenuItem>
        </SubMenu>
        <SubMenu value="1" title={<span>工单系统</span>} icon={<ViewModuleIcon />}>
          <MenuItem value="1-1" onClick={() => navigate('/ticket/create')}>
            <span>工单申请</span>
          </MenuItem>
          <MenuItem value="1-2" onClick={() => navigate('/ticket/todo')}>
            <span>我的待办</span>
          </MenuItem>
          <MenuItem value="1-3" onClick={() => navigate('/ticket/created-by-me')}>
            <span>我创建的</span>
          </MenuItem>
          <MenuItem value="1-4" onClick={() => navigate('/ticket/related-to-me')}>
            <span>我历史的</span>
          </MenuItem>
          <MenuItem value="1-5" onClick={() => navigate('/ticket/all')}>
            <span>所有工单</span>
          </MenuItem>
          <MenuItem value="1-7" onClick={() => navigate('/ticket/alert')}>
            <span className="span-margin">我的预警</span>
          </MenuItem>
          {showDistribute && (
            <MenuItem value="1-6" onClick={() => navigate('/ticket/distribute')}>
              <span>分发工单</span>
            </MenuItem>
          )}
        </SubMenu>
        <SubMenu value="2" title={<span>系统管理</span>} icon={<SettingIcon />}>
          <MenuItem value="2-1" onClick={() => navigate('/admin/approve/employee')}>
            <span>员工审核</span>
          </MenuItem>
        </SubMenu>
      </Menu>
    </Fragment>
  )
}
