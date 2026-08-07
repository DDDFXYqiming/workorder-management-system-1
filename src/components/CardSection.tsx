import type { ReactNode } from 'react'
import '@/styles/card-section.css'

interface CardSectionProps {
  title: string
  className?: string
  option?: ReactNode
  children: ReactNode
}

/** 带标题的卡片区块 */
export default function CardSection({ title, className, option, children }: CardSectionProps) {
  return (
    <div className={`ti-card-wrapper ${className ?? ''}`}>
      <div className="ti-card-header">
        <div className="ti-card-title-area">
          <span className="ti-title">{title}</span>
        </div>
        {option && <div className="ti-card-options">{option}</div>}
      </div>
      <div className="ti-card-content">{children}</div>
    </div>
  )
}
