# 工单管理系统（workorder-management-system-1）

软工大作业工单系统。原版为 CRA + JavaScript，本仓库 `refactor` 分支完成现代化重构：

- Vite + React 18 + TypeScript（原 CRA5 + JS/JSX 混用）
- TDesign 组件库 + ECharts 统计图表
- MSW（Mock Service Worker）提供可独立运行的模拟后端，无需启动 Java 服务
- 保留 Capacitor 5 依赖，可继续打包 Android
- 腾讯云 COS 桶名/地域等配置外置到 `.env`（不再硬编码在源码中）

## 快速开始

```bash
npm install
npx msw init public/   # 首次安装后生成 Service Worker 文件
npm run dev            # 打开 http://localhost:5174
```

## 演示账号

| 账号 | 密码 | 身份 |
| --- | --- | --- |
| `admin1` | `123456` | 审核人（可审核工单） |
| `worker1` | `123456` | 处理人（可分发/完成工单） |

## 功能清单

- 登录/注册（注册含职位、市/区级联选择）
- 工作台：预警/总工单/我创建/待办统计卡片 + 周工单量柱状图
- 工单列表：我的待办、我的预警、我创建的、我相关的、所有工单、分发工单
- 创建工单（标题/内容/分类/操作单位）
- 工单详情：进度、内容、基本信息、流转历史
- 处理工单：审核通过/驳回、转派协助单位、完成工单
- 个人中心、系统管理占位页

## 目录结构

```text
src/
  api/        # axios 实例与接口层（auth / process / cos）
  components/ # 通用组件（StatCard、CardSection、TicketTable）
  layout/     # 主布局（侧边栏、面包屑、用户下拉）
  mocks/      # MSW 内存数据库与接口处理器
  pages/      # 页面（Login、Dashboard、TicketList、CreateTicket...）
  router/     # 路由配置
  types/      # TypeScript 类型定义
  data/       # 静态数据（区域字典）
```
