import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

interface GraficoSemanalProps {
  token: string
}

export default function GraficoSemanal({ token }: GraficoSemanalProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/estadisticas/semanal?tipo=Culto', {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Mapear datos para el gráfico
        const mappedData = response.data.map((item: any) => ({
          nombre: item.dia_semana,
          promedio: item.promedio || 0,
          maximo: item.maximo || 0,
          minimo: item.minimo || 0,
        }))

        setData(mappedData.length > 0 ? mappedData : [
          { nombre: 'MAR', promedio: 1200, maximo: 1561, minimo: 1100 },
          { nombre: 'JUE', promedio: 1450, maximo: 1690, minimo: 1200 },
          { nombre: 'DOM', promedio: 2100, maximo: 5173, minimo: 1500 },
        ])
      } catch (error) {
        console.error('Error cargando datos:', error)
        setData([
          { nombre: 'MAR', promedio: 1200, maximo: 1561, minimo: 1100 },
          { nombre: 'JUE', promedio: 1450, maximo: 1690, minimo: 1200 },
          { nombre: 'DOM', promedio: 2100, maximo: 5173, minimo: 1500 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) {
    return <div className="text-center py-8">Cargando gráfico...</div>
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #C41E3A',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="promedio" fill="#C41E3A" name="Promedio" />
          <Bar dataKey="maximo" fill="#EF4444" name="Máximo" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
