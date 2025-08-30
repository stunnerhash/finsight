import type { BadgeVariant } from '@/types/finance';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const getBadgeVariant = (percentage: number): BadgeVariant => {
  if (percentage > 90) return "destructive";
  if (percentage > 75) return "outline";
  return "secondary";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};
