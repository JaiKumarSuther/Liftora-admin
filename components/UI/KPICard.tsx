'use client';

import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
}) => {


  return (
    <div className="bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-700" role="region" aria-label={`${title} KPI`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-white leading-none">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-coral-500/20">
          <Icon className="w-5 h-5 text-coral-400" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
