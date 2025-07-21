import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface CommitData {
  date: string
  commits: number
  additions: number
  deletions: number
}

interface CommitTrendsProps {
  data: CommitData[]
}

export const CommitTrends: React.FC<CommitTrendsProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <YAxis 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '0.375rem'
          }}
          labelStyle={{ color: '#E5E7EB' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="commits" 
          stroke="#06B6D4" 
          strokeWidth={2}
          dot={{ fill: '#06B6D4', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="additions" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="deletions" 
          stroke="#EF4444" 
          strokeWidth={2}
          dot={{ fill: '#EF4444', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
