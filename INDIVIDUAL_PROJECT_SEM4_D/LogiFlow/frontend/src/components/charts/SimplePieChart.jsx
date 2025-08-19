import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SimplePieChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie 
                    data={data} 
                    dataKey="count" 
                    nameKey="status" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={120} 
                    fill="#8884d8" 
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#161B22', 
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#C9D1D9'
                    }} 
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
export default SimplePieChart;