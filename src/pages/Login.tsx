import { useEffect, useState } from 'react'
import { Button, Form, Input, MessagePlugin, Select } from 'tdesign-react'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { useNavigate } from 'react-router-dom'
import { allPositionsAPI, loginAPI, registerAPI } from '@/api'
import { clearAuth, setToken, setUserId, setUserInfo } from '@/api/token'
import type { Position } from '@/types'
import regions from '@/data/regions.json'
import '@/styles/user.css'

const { FormItem } = Form

interface Region {
  category_id: string
  city: string
  districts: Array<{ category_id: string; area: string }>
}

const regionList = regions as Region[]

function Tab({ value, options, onChange }: { value: number; options: string[]; onChange: (v: number) => void }) {
  return (
    <div className="ti-login-tab">
      {options.map((item, index) => (
        <div
          key={item}
          className={`ti-tab-login${value === index ? ' ti-tab-login-active' : ''}`}
          onClick={() => onChange(index)}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function LoginForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onSubmit = async (e: { validateResult: unknown }) => {
    if (e.validateResult !== true) return
    const values = form.getFieldsValue(true) as { username: string; password: string }
    const res = await loginAPI(values)
    if (res.code !== 1) {
      MessagePlugin.error('用户名或密码错误！')
      return
    }
    const data = res.data
    setToken(String(data.token ?? ''))
    setUserId(String(data.identity ?? data.user_id ?? ''))
    setUserInfo(data)
    navigate('/')
  }

  return (
    <Form
      form={form}
      rules={{
        username: [
          { required: true, message: '必填', type: 'error' },
          { min: 4, message: '用户名不少于4个字符', type: 'error' },
        ],
        password: [
          { required: true, message: '必填', type: 'error' },
          { min: 6, message: '密码不少于6个字符', type: 'error' },
        ],
      }}
      className="ti-login-form"
      onSubmit={onSubmit}
      colon
      labelWidth={0}
    >
      <FormItem name="username" className="ti-login-input-wrapper">
        <Input
          className="ti-login-input"
          size="large"
          clearable
          prefixIcon={<DesktopIcon />}
          placeholder="请输入用户名"
        />
      </FormItem>
      <FormItem name="password" className="ti-login-input-wrapper">
        <Input
          className="ti-login-input"
          size="large"
          type="password"
          prefixIcon={<LockOnIcon />}
          clearable
          placeholder="请输入密码"
        />
      </FormItem>
      <FormItem statusIcon={false}>
        <Button size="large" theme="primary" type="submit" block>
          登录
        </Button>
      </FormItem>
    </Form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [form] = Form.useForm()
  const [positions, setPositions] = useState<Position[]>([])
  const [cityValue, setCityValue] = useState<string>()
  const [areaValue, setAreaValue] = useState<string>()
  const [districtOptions, setDistrictOptions] = useState<Region['districts']>([])

  useEffect(() => {
    void allPositionsAPI()
      .then((res) => setPositions(res.data))
      .catch(() => setPositions([]))
  }, [])

  const onCityChange = (value: unknown) => {
    const v = value === undefined || value === '' ? undefined : String(value)
    setCityValue(v)
    setAreaValue(undefined)
    const selected = regionList.find((item) => item.category_id === v)
    setDistrictOptions(selected?.districts ?? [])
  }

  const rePassword = (val: string) =>
    new Promise<boolean>((resolve) => {
      resolve(form.getFieldValue('password') === val)
    })

  const onSubmit = async (e: { validateResult: unknown }) => {
    if (e.validateResult !== true) return
    const values = form.getFieldsValue(true) as {
      username: string
      password: string
      positionId: number
      areaId: string
      area_category: string
    }
    const res = await registerAPI({
      username: values.username,
      password: values.password,
      positionId: Number(values.positionId),
      areaId: `${values.areaId}${values.area_category}`,
    })
    if (res.code !== 1) {
      MessagePlugin.error('用户名已存在')
      return
    }
    MessagePlugin.success('注册成功，请登录')
    onSuccess()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onSubmit={onSubmit}
      labelWidth={0}
      colon
      scrollToFirstError="smooth"
    >
      <FormItem
        name="username"
        rules={[
          { required: true, message: '用户名必填', type: 'error' },
          { pattern: /^[A-Za-z0-9]+$/, message: '用户名只能是英文和数字' },
          { min: 4, message: '至少需要4个字符', type: 'error' },
        ]}
      >
        <Input placeholder="请输入用户名" size="large" clearable prefixIcon={<DesktopIcon />} />
      </FormItem>
      <FormItem
        name="password"
        rules={[
          { required: true, message: '密码必填', type: 'error' },
          { min: 6, message: '至少需要6位', type: 'error' },
        ]}
      >
        <Input placeholder="请输入密码" type="password" size="large" prefixIcon={<LockOnIcon />} clearable />
      </FormItem>
      <FormItem
        name="rePassword"
        rules={[
          { required: true, message: '密码必填', type: 'error' },
          { validator: rePassword, message: '两次密码不一致' },
        ]}
      >
        <Input placeholder="请重复密码" type="password" size="large" prefixIcon={<LockOnIcon />} clearable />
      </FormItem>
      <FormItem label="职位" name="positionId" rules={[{ required: true, message: '必选', type: 'error' }]}>
        <Select
          style={{ width: '40%' }}
          clearable
          options={positions.map((item) => ({ label: item.positionName, value: item.id }))}
        />
      </FormItem>
      <FormItem label="市" name="areaId" rules={[{ required: true, message: '必选', type: 'error' }]}>
        <Select
          value={cityValue}
          onChange={onCityChange}
          style={{ width: '40%' }}
          clearable
          options={regionList.map((item) => ({ label: item.city, value: item.category_id }))}
        />
      </FormItem>
      <FormItem label="区/县" name="area_category" rules={[{ required: true, message: '必选', type: 'error' }]}>
        <Select
          value={areaValue}
          onChange={(v) => setAreaValue(String(v))}
          style={{ width: '40%' }}
          clearable
          options={districtOptions.map((d) => ({ label: d.area, value: d.category_id }))}
          disabled={districtOptions.length === 0}
        />
      </FormItem>
      <FormItem statusIcon={false}>
        <Button size="large" theme="primary" type="submit" block>
          注册
        </Button>
      </FormItem>
    </Form>
  )
}

/** 登录/注册页 */
export default function Login() {
  const [select, setSelect] = useState(0)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      alert('请重新登录！')
    }
    clearAuth()
  }, [])

  return (
    <div className="ti-login-wrapper">
      <div className="ti-login-content">
        <Tab value={select} options={['登录', '注册']} onChange={setSelect} />
        {select === 0 ? <LoginForm /> : <RegisterForm onSuccess={() => setSelect(0)} />}
      </div>
    </div>
  )
}
