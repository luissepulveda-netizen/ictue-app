import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabaseClient'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const DEMO_DATA = [
  { mes: 'Ene', año2024: 1150, año2025: 1200, año2026: 1280 },
  { mes: 'Feb', año2024: 1200, año2025: 1250, año2026: 1350 },
  { mes: 'Mar', año2024: 1300, año2025: 1450, año2026: 1550 },
  { mes: 'Abr', año2024: 1250, año2025: 1350, año2026: 1480 },
  { mes: 'May', año2024: 1100, año2025: 1200, año2026: 1320 },
  { mes: 'Jun', año2024: 1180, año2025: 1280, año2026: 1400 },
]

export default function GraficoAnual() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: rows, error } = await supabase.rpc('estadisticas_anual', { p_tipo: 'Culto' })

      if (error || !rows || rows.length === 0) {
        setData(DEMO_DATA)
      } else {
        const grouped: { [key: string]: any } = {}
        rows.forEach((item: any) => {
          const mesKey = `${parseInt(item.mes) - 1}`
          const anio = parseInt(item.anio)
          if (!grouped[mesKey]) {
            grouped[mesKey] = { mes: MESES[mesKey] }
          }
          grouped[mesKey][`año${anio}`] = item.promedio
        })
        setData(Object.values(grouped))
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
