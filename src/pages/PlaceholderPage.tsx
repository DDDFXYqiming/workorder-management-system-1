import CardSection from '@/components/CardSection'

interface PlaceholderPageProps {
  title: string
}

/** 原版为空的占位页：显示建设中提示 */
export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <CardSection title={title} className="ti-info">
      <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>该模块正在建设中，敬请期待</div>
    </CardSection>
  )
}
