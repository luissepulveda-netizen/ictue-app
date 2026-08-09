import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUsuario = localStorage.getItem('usuario')
    if (savedToken && savedUsuario) {
      setToken(savedToken)
      setUsuario(JSON.parse(savedUsuario))
    }
  }, [])

  const handleLogin = (token: string, usuario: any) => {
    setToken(token)
    setUsuario(usuario)
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
  }

  const handleLogout = () => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <div className="min-h-screen bg-ictue-lightgray">
      {token ? (
        <Dashboard usuario={usuario} token={token} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
