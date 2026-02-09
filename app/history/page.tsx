'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HistoryTable } from '@/components/history-table'
import { fetchTradingData } from '@/lib/data'
import type { TradingData } from '@/lib/types'

export default function HistoryPage() {
  const [data, setData] = useState<TradingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const tradingData = await fetchTradingData()
      setData(tradingData)
      setLoading(false)
    }
    
    loadData()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const totalClosedPnL = data.closedPositions.reduce((sum, p) => sum + (p.realizedPnL || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trade History</h1>
          <p className="text-gray-400 mt-1">
            {data.closedPositions.length} closed trades • Total P&L: 
            <span className={totalClosedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
              {' '}{totalClosedPnL >= 0 ? '+' : ''}${totalClosedPnL.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <HistoryTable positions={data.closedPositions} />
        </CardContent>
      </Card>
    </div>
  )
}
