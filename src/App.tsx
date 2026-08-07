import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import '@/styles/app.css'

export default function App() {
  const element = useRoutes(routes)
  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      {element}
    </div>
  )
}
