'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ClosedPosition, Position } from '@/lib/types'

interface RecentTradesProps {
  closed: ClosedPosition[]
  open: Position[]
}

export function RecentTrades({ closed, open }: RecentTradesProps) {
  const allTrades = [
    ...open.map(p => ({ ...p, status: 'OPEN' as const })),
    ...closed.slice(0, 5).map(p => ({ ...p, status: 'CLOSED' as const }))
  ].slice(0, 8)

  if (allTrades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent trades
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {allTrades.map((trade, index) => {
        const pnl = trade.status === 'CLOSED' 
          ? (trade as ClosedPosition).realizedPnL || 0
          : (trade as Position).currentPnL || 0
        
        const isProfit = pnl > 0
        const isLoss = pnl < 0

        return (
          <div 
            key={`${trade.marketId}-${index}`} 
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{trade.question}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {trade.strategy}
                </Badge>
                {trade.status === 'OPEN' ? (
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border-0 shrink-0">OPEN</Badge>
                ) : (
                  <Badge 
                    variant={(trade as ClosedPosition).exitReason === 'PROFIT_TARGET' ? 'default' : 'destructive'}
                    className="text-xs shrink-0"
                  >
                    {(trade as ClosedPosition).exitReason}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {trade.action} • ${trade.size.toFixed(0)}
              </div>
            </div>
            <div className={`text-right ${isProfit ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'}`}>
              <div className="flex items-center gap-1">
                {isProfit && <TrendingUp className="h-4 w-4" />}
                {isLoss && <TrendingDown className="h-4 w-4" />}
                {!isProfit && !isLoss && <Minus className="h-4 w-4" />}
                <span className="font-medium">{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
