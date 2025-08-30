import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TransactionItem from '@/components/dashboard/TransactionItem';
import type { Transaction } from '@/types/finance';
import { Link } from 'react-router-dom';
import { List } from 'lucide-react';

interface RecentTransactionsSectionProps {
  recentTransactions: readonly Transaction[];
}

const RecentTransactionsSection: React.FC<RecentTransactionsSectionProps> = ({
  recentTransactions,
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between text-left">
        <CardTitle>Recent Transactions</CardTitle>
        <Link to="/transactions">
          <Button variant="outline" className="gap-2 text-white">
            <List className="h-4 w-4" />
            View All
          </Button>
        </Link>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-left space-y-4">
        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default RecentTransactionsSection;
