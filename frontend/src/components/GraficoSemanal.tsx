import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabaseClient'

const DEMO_DATA = [
  { nombre: 'MAR', promedio: 1200, maximo: 1561, minimo: 1100 },
  { nombre: 'JUE', promedio: 1450, maximo: 1690, minimo: 1200 },
  { nombre: 'DOM', promedio: 2100, maximo: 5173, minimo: 1500 },
]

export default function GraficoSemanal() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: rows, error } = await supabase.rpc('estadisticas_semanal', { p_tipo: 'Culto' })

      if (error || !rows || rows.length === 0) {
        setData(DEMO_DATA)
      } else {
        setData(
          rows.map((item: any) => ({
            nombre: item.dia_semana,
            promedio: item.promedio || 0,
            maximo: item.maximo || 0,
            minimo: item.minimo || 0,
          }))
        )
      }
      setLoading(false)
    }

    fetchData()
  }, [])

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
