import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { TransactionItemProps } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/financeUtils';

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {transaction.type === 'income' ? (
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-600" />
        )}
      </div>
      <div>
        <p className="font-medium text-sm">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {transaction.category} • {formatDate(transaction.date)}
        </p>
      </div>
    </div>
    <div className={`font-semibold ${
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    }`}>
      {transaction.type === 'income' ? '+' : ''}
      {formatCurrency(Math.abs(transaction.amount))}
    </div>
  </div>
);

export default TransactionItem;
