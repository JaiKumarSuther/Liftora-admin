'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartProps {
  data: ChartData[];
  type: 'line' | 'area' | 'bar' | 'pie' | 'radial' | 'scatter' | 'composed';
  height?: number;
  width?: string | number;
  className?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
  title?: string;
  subtitle?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnimatedChart: React.FC<ChartProps> = ({
  data,
  type,
  height = 300,
  width = '100%',
  className = '',
  colors = COLORS,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animation = true,
  title,
  subtitle
}) => {
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height,
      width: typeof width === 'string' ? 400 : width,
      margin: { top: 20, right: 40, left: 40, bottom: 60 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                animationDuration={animation ? 1000 : 0}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
                animationDuration={animation ? 1000 : 0}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={animation ? 1000 : 0}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart width={400} height={400} margin={{ top: 20, right: 80, bottom: 80, left: 80 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationDuration={animation ? 1000 : 0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
                formatter={(value: number, name: string) => [`${value}`, name]}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
                iconType="circle"
                formatter={(value: string) => {
                  const dataEntry = data.find(d => d.name === value);
                  const total = data.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);
                  const percentage = dataEntry ? ((typeof dataEntry.value === 'number' ? dataEntry.value : 0) / total * 100).toFixed(0) : '0';
                  return `${value} ${percentage}%`;
                }}
              />
            )}
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart width={400} height={350} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={data} margin={{ top: 20, right: 40, bottom: 60, left: 40 }}>
            <RadialBar
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey="value"
              animationDuration={animation ? 1000 : 0}
            />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
          </RadialBarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="x" stroke="#666" fontSize={12} />
            <YAxis dataKey="y" stroke="#666" fontSize={12} />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
            <Scatter dataKey="value" fill={colors[0]} />
          </ScatterChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '600'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            )}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => {
              if (index === 0) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                    animationDuration={animation ? 1000 : 0}
                  />
                );
              } else {
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                    animationDuration={animation ? 1000 : 0}
                  />
                );
              }
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className={`bg-gray-800 rounded-lg border border-gray-700 p-4 focus:outline-none ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-lg font-semibold text-white truncate">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400 mt-1 truncate">{subtitle}</p>}
        </div>
      )}
      <div className="relative w-full overflow-visible">
        <ResponsiveContainer width={width} height={height}>
          {renderChart() || <div />}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnimatedChart;
