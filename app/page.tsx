'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity, 
  Target,
  BarChart3
} from 'lucide-react'
import { PnLChart } from '@/components/pnl-chart'
import { PositionsTable } from '@/components/positions-table'
import { RecentTrades } from '@/components/recent-trades'
import { fetchTradingData, calculateStats } from '@/lib/data'
import type { TradingData, Stats } from '@/lib/types'

export default function Dashboard() {
  const [data, setData] = useState<TradingData | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const tradingData = await fetchTradingData()
      setData(tradingData)
      setStats(calculateStats(tradingData))
      setLoading(false)
    }
    
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading || !data || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const totalPnL = stats.realizedPnL + stats.unrealizedPnL
  const totalReturn = (totalPnL / 1000) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Real-time trading performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
            <Wallet className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </div>
            <p className={`text-xs ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Realized P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.realizedPnL >= 0 ? '+' : ''}${stats.realizedPnL.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">Closed trades</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Unrealized P&L</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.unrealizedPnL >= 0 ? '+' : ''}${stats.unrealizedPnL.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">Open positions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {stats.winRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              {stats.winningTrades}W / {stats.losingTrades}L
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              P&L Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PnLChart data={data.closedPositions} />
          </CardContent>
        </Card>

        {/* Active Positions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Positions ({data.positions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PositionsTable positions={data.positions.slice(0, 5)} compact />
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTrades 
            closed={data.closedPositions.slice(0, 5)} 
            open={data.positions.slice(0, 3)} 
          />
        </CardContent>
      </Card>
    </div>
  )
}
