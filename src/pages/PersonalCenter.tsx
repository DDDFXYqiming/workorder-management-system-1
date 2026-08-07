import { Form } from 'tdesign-react'
import { MessagePlugin } from 'tdesign-react'
import { updateUserAPI } from '@/api'
import { getUserInfo, setUserInfo } from '@/api/token'
import '@/styles/personal-center.css'
import '@/styles/create-ticket.css'

const { FormItem } = Form

interface UserProfile {
  username?: string
  user_name?: string
  position?: string
  positionName?: string
  area?: string
  [key: string]: unknown
}

/** 个人中心：展示用户名/职位/地区 */
export default function PersonalCenter() {
  const userInfo = (getUserInfo() ?? {}) as UserProfile
  const name = userInfo.username ?? userInfo.user_name ?? ''
  const position = userInfo.position ?? userInfo.positionName ?? ''
  const area = userInfo.area ?? ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updated = { ...userInfo, user_name: name }
    setUserInfo(updated)
    const res = await updateUserAPI(updated)
    if (res.code === 1) {
      MessagePlugin.success('更新成功')
    } else {
      MessagePlugin.error('更新失败')
    }
  }

  return (
    <div>
      <section className="ti-section-wrapper ti-create-wrapper" style={{ height: '100%' }}>
        <form onSubmit={onSubmit}>
          <div className="ti-form-basic-container">
            <div className="ti-form-basic-item">
              <div className="ti-form-basic-container-title">个人详情</div>
              <FormItem label="用户名" name="username">
                <p>{name}</p>
              </FormItem>
              <FormItem label="职位" name="position">
                <p>{position}</p>
              </FormItem>
              <FormItem label="地区" name="area">
                <p>{area}</p>
              </FormItem>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
