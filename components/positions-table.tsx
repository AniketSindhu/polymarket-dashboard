'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Position } from '@/lib/types'

interface PositionsTableProps {
  positions: Position[]
  compact?: boolean
}

export function PositionsTable({ positions, compact }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No open positions
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-800">
          <TableHead className="text-gray-400">Market</TableHead>
          <TableHead className="text-gray-400">Strategy</TableHead>
          {!compact && <TableHead className="text-gray-400">Action</TableHead>}
          <TableHead className="text-gray-400 text-right">Size</TableHead>
          <TableHead className="text-gray-400 text-right">Entry</TableHead>
          <TableHead className="text-gray-400 text-right">Current</TableHead>
          <TableHead className="text-gray-400 text-right">P&L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const pnl = position.currentPnL || 0
          const pnlPct = position.currentPnLPct || 0
          const isProfit = pnl > 0
          const isLoss = pnl < 0

          return (
            <TableRow key={position.marketId} className="border-gray-800">
              <TableCell className="font-medium">
                <div className="max-w-[200px] truncate" title={position.question}>
                  {position.question}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {position.strategy}
                </Badge>
              </TableCell>
              {!compact && (
                <TableCell className="text-gray-400">{position.action}</TableCell>
              )}
              <TableCell className="text-right">${position.size.toFixed(0)}</TableCell>
              <TableCell className="text-right text-gray-400">
                ${position.entryPrice.toFixed(4)}
              </TableCell>
              <TableCell className="text-right text-gray-400">
                ${(position.currentPrice || position.entryPrice).toFixed(4)}
              </TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'}`}>
                  {isProfit && <TrendingUp className="h-4 w-4" />}
                  {isLoss && <TrendingDown className="h-4 w-4" />}
                  {!isProfit && !isLoss && <Minus className="h-4 w-4" />}
                  <span>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</span>
                  <span className="text-xs">({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)</span>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
