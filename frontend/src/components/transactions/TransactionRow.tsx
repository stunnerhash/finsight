import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/financeUtils';
import type { BackendTransaction } from '@/services/api';

interface TransactionRowProps {
  transaction: BackendTransaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-3 px-4">{transaction.title}</td>
      <td className="py-3 px-4">
        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(Math.abs(transaction.amount))}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge variant="outline">
          {transaction.category?.name || (transaction.type === 'income' ? 'Income' : 'Other')}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
          {transaction.type}
        </Badge>
      </td>
      <td className="py-3 px-4 text-muted-foreground">
        {new Date(transaction.date).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default TransactionRow;
