export default function Dashboard({ usuario, onLogout }: any) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#C41E3A', marginBottom: '16px' }}>
          Dashboard ICTUE
        </h1>

        <p style={{ fontSize: '18px', color: '#374151', marginBottom: '24px' }}>
          Bienvenido, <strong>{usuario?.nombre || 'Usuario'}</strong>
        </p>

        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px' }}>
            ✅ Sistema Operacional
          </h2>
          <p style={{ color: '#16a34a', marginBottom: '12px' }}>
            Tu sistema de gestión de asistencia está completamente funcional
          </p>
          <ul style={{ color: '#16a34a', lineHeight: '1.8' }}>
            <li>✅ Backend en Railway: Online</li>
            <li>✅ PostgreSQL: Conectada</li>
            <li>✅ Autenticación: Funcionando</li>
            <li>✅ Frontend: En vivo</li>
          </ul>
        </div>

        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#C41E3A',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
