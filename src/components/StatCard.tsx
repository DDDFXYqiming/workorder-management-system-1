import '@/styles/stat-card.css'

interface StatCardProps {
  title: string
  number: number
  remark?: string
  mainColor?: boolean
  figure?: boolean
}

/** 仪表盘统计卡片 */
export default function StatCard({ title, number, remark, mainColor, figure }: StatCardProps) {
  return (
    <div className={`ti-card-container ${mainColor ? 'mian-card-container' : ''}`}>
      <p className="ti-card-title">{title}</p>
      <p className="ti-card-number">{number}</p>
      <p className="ti-card-remark">{remark}</p>
      {figure && <div className="ti-card-figure" />}
    </div>
  )
}
