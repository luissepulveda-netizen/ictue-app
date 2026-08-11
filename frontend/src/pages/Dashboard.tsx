import { useState } from 'react'
import RegistroAsistencia from '../components/RegistroAsistencia'
import GraficoSemanal from '../components/GraficoSemanal'
import GraficoMensual from '../components/GraficoMensual'
import GraficoAnual from '../components/GraficoAnual'

interface DashboardProps {
  usuario: any
  onLogout: () => void
}

export default function Dashboard({ usuario, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'semanal' | 'mensual' | 'anual'>('semanal')
  const [showRegistro, setShowRegistro] = useState(false)

  return (
    <div className="min-h-screen bg-ictue-lightgray">
      <div className="bg-white shadow-sm border-b border-ictue-lightgray">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ictue-red">ICTUE</h1>
          <button
            onClick={onLogout}
            className="text-ictue-mediumgray hover:text-ictue-red font-semibold text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-ictue-darkgray mb-2">
              Dashboard de Asistencia
            </h2>
            <p className="text-ictue-mediumgray">
              Bienvenido, <span className="font-semibold text-ictue-red">{usuario?.nombre || usuario?.email}</span>
            </p>
          </div>
          <button
            onClick={() => setShowRegistro(!showRegistro)}
            className="bg-ictue-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-ictue-darkred transition-colors"
          >
            {showRegistro ? 'Cerrar Registro' : '+ Registrar Asistencia'}
          </button>
        </div>

        {showRegistro && (
          <div className="mb-8">
            <RegistroAsistencia onSuccess={() => setShowRegistro(false)} />
          </div>
        )}

        <div className="card bg-white rounded-lg shadow-md">
          <div className="flex border-b border-ictue-lightgray p-6 pb-0">
            <button
              onClick={() => setActiveTab('semanal')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'semanal'
                  ? 'text-ictue-red border-ictue-red'
                  : 'text-ictue-mediumgray border-transparent hover:text-ictue-darkgray'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setActiveTab('mensual')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'mensual'
                  ? 'text-ictue-red border-ictue-red'
                  : 'text-ictue-mediumgray border-transparent hover:text-ictue-darkgray'
              }`}
            >
              Este Mes
            </button>
            <button
              onClick={() => setActiveTab('anual')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'anual'
                  ? 'text-ictue-red border-ictue-red'
                  : 'text-ictue-mediumgray border-transparent hover:text-ictue-darkgray'
              }`}
            >
              Comparación Anual
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'semanal' && <GraficoSemanal />}
            {activeTab === 'mensual' && <GraficoMensual />}
            {activeTab === 'anual' && <GraficoAnual />}
          </div>
        </div>
      </div>
    </div>
  )
}
