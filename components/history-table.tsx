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
import { TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import type { ClosedPosition } from '@/lib/types'

interface HistoryTableProps {
  positions: ClosedPosition[]
}

export function HistoryTable({ positions }: HistoryTableProps) {
  if (positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No closed trades
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-800">
          <TableHead className="text-gray-400">Market</TableHead>
          <TableHead className="text-gray-400">Strategy</TableHead>
          <TableHead className="text-gray-400">Entry → Exit</TableHead>
          <TableHead className="text-gray-400 text-right">Size</TableHead>
          <TableHead className="text-gray-400 text-right">P&L</TableHead>
          <TableHead className="text-gray-400">Reason</TableHead>
          <TableHead className="text-gray-400">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position, index) => {
          const pnl = position.realizedPnL || 0
          const isProfit = pnl > 0

          return (
            <TableRow key={`${position.marketId}-${index}`} className="border-gray-800">
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
              <TableCell className="text-gray-400 text-sm">
                ${position.entryPrice.toFixed(4)} → ${(position.exitPrice || 0).toFixed(4)}
              </TableCell>
              <TableCell className="text-right">${position.size.toFixed(0)}</TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                  {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={position.exitReason === 'PROFIT_TARGET' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {position.exitReason}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400 text-sm">
                {position.exitTimestamp ? format(new Date(position.exitTimestamp), 'MMM d, HH:mm') : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
