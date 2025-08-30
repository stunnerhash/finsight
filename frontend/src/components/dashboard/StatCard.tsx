import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { StatCardProps } from '@/types/finance';
import { formatCurrency } from '@/utils/financeUtils';

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  trend, 
  progress, 
  isVisible = true,
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">
          {isVisible ? (typeof value === 'number' ? formatCurrency(value) : value) : '••••••'}
        </div>
      </div>
      
      {progress && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={progress.value} className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {progress.value.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {progress.description}
          </p>
        </>
      )}
      
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <ArrowUpRight className={`h-4 w-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
          <span className="text-xs text-muted-foreground">{trend.description}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
