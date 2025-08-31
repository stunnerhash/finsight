import React from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import type { TimePeriod } from '@/types/finance';

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  const getMonthName = (monthIndex: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const now = new Date();
  const currentMonth = getMonthName(now.getMonth());
  const previousMonth = getMonthName(now.getMonth() - 1);
  const currentYear = now.getFullYear();

  const periods: { value: TimePeriod; label: string; description: string }[] = [
    {
      value: 'Current Month',
      label: 'Current Month',
      description: `${currentMonth} ${currentYear}`
    },
    {
      value: 'Previous Month',
      label: 'Previous Month', 
      description: `${previousMonth} ${currentYear}`
    },
    {
      value: 'This Year',
      label: 'This Year',
      description: `${currentYear}`
    }
  ];

  const currentPeriod = periods.find(p => p.value === selectedPeriod);

  return (
    <Select value={selectedPeriod} onValueChange={onPeriodChange}>
      <SelectTrigger className="w-[180px] text-white border-white/20 hover:border-white/40">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{currentPeriod?.description}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            <div className="flex flex-col">
              <span className="font-medium">{period.label}</span>
              <span className="text-xs text-muted-foreground">{period.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
