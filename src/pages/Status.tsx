import { CheckCircleIcon } from 'tdesign-icons-react'
import '@/styles/user.css'

/** 注册提交后的审核等待页 */
export default function Status() {
  return (
    <div className="ti-login-wrapper">
      <div className="ti-status-content">
        <CheckCircleIcon size="76px" style={{ color: 'var(--td-success-color)' }} />
        <p>你的信息已提交</p>
        <p>审核中，请耐心等待</p>
      </div>
    </div>
  )
}
