import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleBarChart = ({ data, dataKey, nameKey }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey={nameKey} stroke="#8B949E" />
                <YAxis stroke="#8B949E" />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#161B22', 
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#C9D1D9'
                    }} 
                />
                <Legend />
                <Bar dataKey={dataKey} fill="#0096FF" />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default SimpleBarChart;