import { useState } from 'react'
import axios from 'axios'

interface RegistroAsistenciaProps {
  token: string
  onSuccess: () => void
}

const reuniones = [
  { id: 1, label: 'Martes 19:30', dia: 'MAR', hora: '19:30', tipo: 'Culto' },
  { id: 2, label: 'Jueves 19:30', dia: 'JUE', hora: '19:30', tipo: 'Culto' },
  { id: 3, label: 'Domingo 11:00 (Culto)', dia: 'DOM', hora: '11:00', tipo: 'Culto', seccion: 1 },
  { id: 4, label: 'Domingo 18:30 (Culto)', dia: 'DOM', hora: '18:30', tipo: 'Culto', seccion: 2 },
  { id: 5, label: 'Domingo 11:00 (UNT Kids)', dia: 'DOM', hora: '11:00', tipo: 'UNT Kids', seccion: 1 },
  { id: 6, label: 'Domingo 18:30 (UNT Kids)', dia: 'DOM', hora: '18:30', tipo: 'UNT Kids', seccion: 2 },
]

export default function RegistroAsistencia({ token, onSuccess }: RegistroAsistenciaProps) {
  const [selectedReunion, setSelectedReunion] = useState<number | null>(null)
  const [asistentes, setAsistentes] = useState('')
  const [expositor, setExpositor] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReunion || !asistentes) {
      setMessage({ type: 'error', text: 'Por favor completa los campos requeridos' })
      return
    }

    setLoading(true)
    try {
      const hoy = new Date().toISOString().split('T')[0]
      await axios.post(
        '/api/asistencia',
        {
          reunion_id: selectedReunion,
          fecha: hoy,
          num_asistentes: parseInt(asistentes),
          expositor: expositor || null,
          observaciones: observaciones || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: '✓ Asistencia registrada correctamente' })
      setAsistentes('')
      setExpositor('')
      setObservaciones('')
      setSelectedReunion(null)
      setTimeout(() => onSuccess(), 1500)
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error al registrar asistencia'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-ictue-red">
      <h2 className="text-2xl font-bold text-ictue-darkgray mb-6">Registrar Asistencia</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ictue-darkgray mb-3">
            Selecciona la Reunión
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reuniones.map((reunion) => (
              <button
                key={reunion.id}
                type="button"
                onClick={() => setSelectedReunion(reunion.id)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
                  selectedReunion === reunion.id
                    ? 'border-ictue-red bg-ictue-red text-white'
                    : 'border-ictue-mediumgray text-ictue-darkgray hover:border-ictue-red'
                }`}
              >
                {reunion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ictue-darkgray mb-2">
              Número de Asistentes *
            </label>
            <input
              type="number"
              value={asistentes}
              onChange={(e) => setAsistentes(e.target.value)}
              className="w-full px-4 py-2 border border-ictue-mediumgray rounded-lg focus:outline-none focus:border-ictue-red focus:ring-2 focus:ring-ictue-red focus:ring-opacity-10"
              placeholder="ej: 1500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ictue-darkgray mb-2">
              Expositor (opcional)
            </label>
            <input
              type="text"
              value={expositor}
              onChange={(e) => setExpositor(e.target.value)}
              className="w-full px-4 py-2 border border-ictue-mediumgray rounded-lg focus:outline-none focus:border-ictue-red focus:ring-2 focus:ring-ictue-red focus:ring-opacity-10"
              placeholder="Nombre del expositor"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ictue-darkgray mb-2">
            Observaciones (opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-4 py-2 border border-ictue-mediumgray rounded-lg focus:outline-none focus:border-ictue-red focus:ring-2 focus:ring-ictue-red focus:ring-opacity-10 resize-none"
            placeholder="Notas sobre la reunión..."
            rows={3}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ictue-red text-white py-3 rounded-lg font-bold hover:bg-ictue-darkred transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </form>
    </div>
  )
}
