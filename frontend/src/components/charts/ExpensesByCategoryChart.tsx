import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { BackendTransaction } from '@/services/api';

interface ExpensesByCategoryChartProps {
  transactions: BackendTransaction[];
  budgetCategories: Array<{ id: number; name: string; color?: string }>;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  categoryId: number;
}

const COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
  '#F43F5E', // rose
  '#8B5A2B', // brown
  '#64748B', // slate
  '#A855F7', // purple
  '#14B8A6', // teal
];

export const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({
  transactions,
  budgetCategories
}) => {
  // Process data for the chart
  const chartData: ChartData[] = React.useMemo(() => {
    const categoryMap = new Map<number, { name: string; total: number; color: string }>();
    
    // Initialize categories with colors
    budgetCategories.forEach((category, index) => {
      categoryMap.set(category.id, {
        name: category.name,
        total: 0,
        color: COLORS[index % COLORS.length] // Always use our color palette
      });
    });

    // Calculate totals for each category
    transactions.forEach(transaction => {
      if (transaction.type === 'expense' && transaction.categoryId != null) {
        const category = categoryMap.get(transaction.categoryId);
        if (category) {
          category.total += Math.abs(transaction.amount);
        }
      }
    });

    // Convert to chart data format and filter out categories with zero expenses
    return Array.from(categoryMap.entries())
      .filter(([, data]) => data.total > 0)
      .map(([categoryId, data]) => ({
        name: data.name,
        value: Math.round(data.total * 100) / 100, // Round to 2 decimal places
        color: data.color,
        categoryId
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [transactions, budgetCategories]);

  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    chartData.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.color
      };
    });
    return config;
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 max-w-md">
      <CardHeader className="text-center pb-1">
        <CardTitle className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Expenses by Category
        </CardTitle>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Total: ${totalExpenses.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                stroke="white"
                strokeWidth={2}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartData;
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, data.name]}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl"
                      />
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Compact Legend */}
        <div className="mt-2 grid grid-cols-2 gap-1">
          {chartData.map((item) => (
            <div key={item.categoryId} className="flex items-center gap-1 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.name}</span>
              <span className="ml-auto font-medium">
                ${item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
