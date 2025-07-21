import React from 'react';
import { Line } from 'react-chartjs-2';

interface CodeComplexityTrendProps {
  data: Array<{ date: string, complexity: number }>;
}

export const CodeComplexityTrend: React.FC<CodeComplexityTrendProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Code Complexity',
        data: data.map(item => item.complexity),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
      }
    ]
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Code Complexity Trend
      </h3>
      <Line data={chartData} />
    </div>
  );
};

