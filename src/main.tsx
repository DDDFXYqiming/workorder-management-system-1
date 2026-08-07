import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'tdesign-react/es/style/index.css'
import '@/styles/index.css'
import App from '@/App'

async function enableMocking(): Promise<void> {
  const enabled = import.meta.env.VITE_ENABLE_MOCK !== 'false'
  if (!enabled) return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
})
