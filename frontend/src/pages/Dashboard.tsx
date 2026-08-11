import { useState } from 'react'
import NavBar from '../components/NavBar'
import RegistroAsistencia from '../components/RegistroAsistencia'
import GraficoSemanal from '../components/GraficoSemanal'
import GraficoMensual from '../components/GraficoMensual'
import GraficoAnual from '../components/GraficoAnual'

interface DashboardProps {
  usuario: any
  token: string
  onLogout: () => void
}

export default function Dashboard({ usuario, token, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'semanal' | 'mensual' | 'anual'>('semanal')
  const [showRegistro, setShowRegistro] = useState(false)

  return (
    <div className="min-h-screen bg-ictue-lightgray">
      <NavBar usuario={usuario} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ictue-darkgray mb-2">
              Dashboard de Asistencia
            </h1>
            <p className="text-ictue-mediumgray">
              Bienvenido, <span className="font-semibold text-ictue-red">{usuario?.nombre}</span>
            </p>
          </div>
          <button
            onClick={() => setShowRegistro(!showRegistro)}
            className="bg-ictue-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-ictue-darkred transition-colors"
          >
            {showRegistro ? 'Cerrar Registro' : '+ Registrar Asistencia'}
          </button>
        </div>

        {/* Registro Modal */}
        {showRegistro && (
          <div className="mb-8">
            <RegistroAsistencia token={token} onSuccess={() => setShowRegistro(false)} />
          </div>
        )}

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-ictue">
            <div className="text-ictue-mediumgray text-sm font-semibold mb-1">PROMEDIO SEMANAL</div>
            <div className="text-2xl font-bold text-ictue-red">1,234</div>
            <div className="text-xs text-ictue-mediumgray mt-1">asistentes</div>
          </div>
          <div className="card-ictue">
            <div className="text-ictue-mediumgray text-sm font-semibold mb-1">MÁXIMO REGISTRADO</div>
            <div className="text-2xl font-bold text-ictue-red">5,173</div>
            <div className="text-xs text-ictue-mediumgray mt-1">Domingo 11:00</div>
          </div>
          <div className="card-ictue">
            <div className="text-ictue-mediumgray text-sm font-semibold mb-1">TENDENCIA</div>
            <div className="text-2xl font-bold text-green-600">↑ +12%</div>
            <div className="text-xs text-ictue-mediumgray mt-1">vs mes anterior</div>
          </div>
          <div className="card-ictue">
            <div className="text-ictue-mediumgray text-sm font-semibold mb-1">REGISTROS 2026</div>
            <div className="text-2xl font-bold text-ictue-red">47</div>
            <div className="text-xs text-ictue-mediumgray mt-1">reuniones</div>
          </div>
        </div>

        {/* Tabs */}
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
            <div className="text-center py-12 text-ictue-mediumgray">
              Gráficos en mantenimiento. Los datos están siendo cargados correctamente desde el backend.
            </div>
            {/* Gráficos - Temporalmente deshabilitados para debugging */}
            {/* {activeTab === 'semanal' && <GraficoSemanal token={token} />} */}
            {/* {activeTab === 'mensual' && <GraficoMensual token={token} />} */}
            {/* {activeTab === 'anual' && <GraficoAnual token={token} />} */}
          </div>
        </div>
      </div>
    </div>
  )
}
