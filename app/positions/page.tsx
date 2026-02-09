'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PositionsTable } from '@/components/positions-table'
import { fetchTradingData } from '@/lib/data'
import type { TradingData, Position } from '@/lib/types'

export default function PositionsPage() {
  const [data, setData] = useState<TradingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const tradingData = await fetchTradingData()
      setData(tradingData)
      setLoading(false)
    }
    
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const totalInvested = data.positions.reduce((sum, p) => sum + p.size, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Open Positions</h1>
          <p className="text-gray-400 mt-1">
            {data.positions.length} active positions • ${totalInvested.toFixed(2)} invested
          </p>
        </div>
        <Badge variant="outline" className="text-blue-400 border-blue-400">
          Auto-refresh: 30s
        </Badge>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <PositionsTable positions={data.positions} />
        </CardContent>
      </Card>
    </div>
  )
}
