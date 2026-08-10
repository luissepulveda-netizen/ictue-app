import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
  onLogin: (token: string, usuario: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password })
      const { token, usuario } = response.data
      onLogin(token, usuario)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ictue-red to-ictue-darkred">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ictue-red mb-2">ICTUE</h1>
          <p className="text-ictue-darkgray text-sm">Iglesia Cristo Tu Única Esperanza</p>
          <p className="text-ictue-mediumgray text-xs mt-2">Sistema de Gestión de Asistencia</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ictue-darkgray mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-ictue-mediumgray rounded-lg focus:outline-none focus:border-ictue-red focus:ring-2 focus:ring-ictue-red focus:ring-opacity-10"
              placeholder="pastor@ictue.cl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ictue-darkgray mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-ictue-mediumgray rounded-lg focus:outline-none focus:border-ictue-red focus:ring-2 focus:ring-ictue-red focus:ring-opacity-10"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ictue-red text-white py-2 rounded-lg font-semibold hover:bg-ictue-darkred transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-xs text-ictue-mediumgray mt-6">
          Si no tienes cuenta, contacta al administrador
        </p>
      </div>
    </div>
  )
}
