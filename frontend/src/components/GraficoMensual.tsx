import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabaseClient'

const DEMO_DATA = [
  { dia: 1, promedio: 1100 },
  { dia: 5, promedio: 1150 },
  { dia: 8, promedio: 2200 },
  { dia: 12, promedio: 1300 },
  { dia: 15, promedio: 2100 },
  { dia: 19, promedio: 1250 },
  { dia: 22, promedio: 2150 },
  { dia: 26, promedio: 1400 },
  { dia: 29, promedio: 2300 },
]

export default function GraficoMensual() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth = new Date().toISOString().substring(0, 7)
      const { data: rows, error } = await supabase.rpc('estadisticas_mensual', {
        p_tipo: 'Culto',
        p_month: currentMonth,
      })

      if (error || !rows || rows.length === 0) {
        setData(DEMO_DATA)
      } else {
        setData(
          rows.map((item: any) => ({
            dia: new Date(item.fecha).getDate(),
            promedio: item.promedio || 0,
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="dia" label={{ value: 'Día del mes', position: 'insideBottomRight', offset: -10 }} />
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
            dataKey="promedio"
            stroke="#C41E3A"
            strokeWidth={2}
            dot={{ fill: '#C41E3A', r: 5 }}
            activeDot={{ r: 7 }}
            name="Promedio de Asistencia"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
