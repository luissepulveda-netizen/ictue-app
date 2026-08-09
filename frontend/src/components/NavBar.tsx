interface NavBarProps {
  usuario: any
  onLogout: () => void
}

export default function NavBar({ usuario, onLogout }: NavBarProps) {
  return (
    <nav className="bg-white shadow-md border-b-4 border-ictue-red">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-ictue-red rounded-full flex items-center justify-center text-white font-bold">
            I
          </div>
          <div>
            <h1 className="text-lg font-bold text-ictue-red">ICTUE</h1>
            <p className="text-xs text-ictue-mediumgray">Gestión de Asistencia</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-ictue-darkgray">{usuario?.nombre}</p>
            <p className="text-xs text-ictue-mediumgray">{usuario?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-ictue-lightgray text-ictue-red px-4 py-2 rounded-lg hover:bg-ictue-red hover:text-white transition-colors text-sm font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
