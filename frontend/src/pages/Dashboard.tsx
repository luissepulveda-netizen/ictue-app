interface DashboardProps {
  usuario: any
  token: string
  onLogout: () => void
}

export default function Dashboard({ usuario, token, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-ictue-lightgray p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-ictue-red mb-4">Bienvenido al Dashboard ICTUE</h1>

          {usuario && (
            <div className="mb-6">
              <p className="text-lg text-ictue-darkgray">
                <span className="font-semibold">Usuario:</span> {usuario.nombre}
              </p>
              <p className="text-lg text-ictue-darkgray">
                <span className="font-semibold">Email:</span> {usuario.email}
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Sistema Operacional</h2>
            <p className="text-green-700 mb-4">
              ¡Tu sistema de gestión de asistencia está completamente funcional!
            </p>
            <ul className="list-disc list-inside text-green-700 space-y-2">
              <li>Backend en Railway: ✅ Online</li>
              <li>PostgreSQL: ✅ Conectada</li>
              <li>Autenticación: ✅ Funcionando</li>
              <li>Frontend: ✅ En vivo</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Características Implementadas</h2>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Sistema de Login con JWT</li>
              <li>Registro de asistencia</li>
              <li>Base de datos PostgreSQL</li>
              <li>API REST completa</li>
              <li>Diseño responsive</li>
              <li>Colores personalizados ICTUE</li>
            </ul>
          </div>

          <button
            onClick={onLogout}
            className="bg-ictue-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-ictue-darkred transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
