'use client';

import React from 'react';

interface ReportCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor
}) => {
  return (
    <div
      className="relative overflow-hidden bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80 focus:outline-none"
      role="region"
      aria-label={`${title} card`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h3>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mb-4 sm:mb-6">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default ReportCard;
