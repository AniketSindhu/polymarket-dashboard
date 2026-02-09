'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import type { ClosedPosition } from '@/lib/types'

interface PnLChartProps {
  data: ClosedPosition[]
}

export function PnLChart({ data }: PnLChartProps) {
  // Calculate cumulative P&L over time
  const chartData = data
    .slice()
    .reverse()
    .reduce((acc: { date: string; pnl: number; cumulative: number }[], position, index) => {
      const pnl = position.realizedPnL || 0
      const previousCumulative = index > 0 ? acc[index - 1].cumulative : 0
      const date = position.exitTimestamp 
        ? new Date(position.exitTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Unknown'
      
      acc.push({
        date,
        pnl,
        cumulative: previousCumulative + pnl
      })
      return acc
    }, [])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '6px'
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cumulative P&L']}
        />
        <Area 
          type="monotone" 
          dataKey="cumulative" 
          stroke="#3b82f6" 
          fillOpacity={1} 
          fill="url(#colorPnL)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
