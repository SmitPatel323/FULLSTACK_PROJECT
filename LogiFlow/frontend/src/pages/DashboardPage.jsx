import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Ship, Truck, PackageCheck, AlertTriangle } from 'lucide-react';

// A custom component for the bar chart's tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; // The data for the hovered bar
        return (
            <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <p className="label" style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{`${label} : ${data.totalVolume} Units`}</p>
                {data.products.length > 0 && (
                    <div className="intro">
                        <strong style={{fontSize: '12px'}}>Products Delivered:</strong>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
                            {data.products.map((product, index) => (
                                <li key={index}>{`${product.name}: ${product.quantity}`}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const StatCard = ({ title, value, icon }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '1rem', color: '#4f46e5' }}>{icon}</div>
        <div>
            <p style={{ margin: 0, color: '#6b778c', fontSize: '14px' }}>{title}</p>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>{value}</p>
        </div>
    </div>
);

export default function DashboardPage() {
    const [data, setData] = useState(null);
    useEffect(() => { apiClient.get('/dashboard/').then(res => setData(res.data)); }, []);

    if (!data) return <div>Loading Dashboard...</div>;

    const deliveryPieData = data.charts.deliveryPerformance.labels.map((label, i) => ({ name: label, value: data.charts.deliveryPerformance.data[i] }));
    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <div>
            <h1 className="page-header">Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Shipments" value={data.stats.totalShipments} icon={<Ship size={32}/>} />
                <StatCard title="In Transit" value={data.stats.inTransit} icon={<Truck size={32}/>} />
                <StatCard title="Delivered" value={data.stats.delivered} icon={<PackageCheck size={32}/>} />
                <StatCard title="Stock Alerts" value={data.stats.lowStockAlerts} icon={<AlertTriangle size={32}/>} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="card">
                    <h3 style={{fontWeight: 600}}>Monthly Delivered Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.charts.monthlyVolume}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="totalVolume" name="Total Units" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3 style={{fontWeight: 600}}>Delivery Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={deliveryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {deliveryPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
