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
      <CardTitle>Recent Transactions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-left space-y-4">
        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link to="/transactions">
          <Button variant="outline" size="sm" className="w-full gap-2 text-white hover:text-white">
            <List className="h-4 w-4" />
            View All Transactions
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default RecentTransactionsSection;
