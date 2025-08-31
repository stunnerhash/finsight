import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import TransactionRow from './TransactionRow';

interface BackendTransaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
    budgeted: number;
    spent: number;
    color: string;
  } | null;
}

interface TransactionsTableProps {
  transactions: BackendTransaction[];
  sortBy: 'date' | 'amount' | 'title';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'date' | 'amount' | 'title') => void;
  loading?: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onSort,
  loading = false,
}) => {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>All Transactions ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left py-3 px-4 font-medium">
                  <div
                    onClick={() => onSort('title')}
                    className="flex items-center gap-1 cursor-pointer hover:text-foreground"
                  >
                    Description
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  <div
                    onClick={() => onSort('amount')}
                    className="flex items-center gap-1 cursor-pointer hover:text-foreground"
                  >
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Category
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  Type
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  <div
                    onClick={() => onSort('date')}
                    className="flex items-center gap-1 cursor-pointer hover:text-foreground"
                  >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span>Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
