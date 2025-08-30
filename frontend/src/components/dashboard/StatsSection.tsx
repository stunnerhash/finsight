import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import type { StatCardProps } from '@/types/finance';

interface StatsSectionProps {
  statsConfig: StatCardProps[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ statsConfig }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
    {statsConfig.map((config, index) => (
      <StatCard key={index} {...config} />
    ))}
  </div>
);

export default StatsSection;
