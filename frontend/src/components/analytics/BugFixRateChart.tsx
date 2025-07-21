import React from 'react';
import { Line } from 'react-chartjs-2';

interface BugFixRateChartProps {
  data: Array<{ date: string, bugFixes: number }>;
}

export const BugFixRateChart: React.FC<BugFixRateChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Bug Fixes',
        data: data.map(item => item.bugFixes),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
      }
    ]
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Bug Fix Rate
      </h3>
      <Line data={chartData} />
    </div>
  );
};

