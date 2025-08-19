import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { Download } from 'lucide-react';

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

export default function ReportsPage() {
    const [analytics, setAnalytics] = useState(null);
    useEffect(() => { apiClient.get('/dashboard/').then(res => setAnalytics(res.data)); }, []);
    
    const exportPDF = () => { 
        if (!analytics) return;
        const doc = new jsPDF();
        doc.text("LogiFlow Analytics Report", 20, 10);
        autoTable(doc, {
            startY: 20,
            head: [['Metric', 'Value']],
            body: [
                ['Avg. Delivery Time Prediction', analytics.predictions.deliveryTime],
                ['Avg. Maintenance Cost Prediction', analytics.predictions.maintenanceCost],
                ['On-time Deliveries', `${analytics.charts.deliveryPerformance.data[0]}%`],
                ['Delayed Deliveries', `${analytics.charts.deliveryPerformance.data[1]}%`],
            ],
        });
        doc.save('logiflow_report.pdf');
    };

    const exportCSV = () => { 
        if (!analytics) return;
        const csvData = analytics.charts.monthlyVolume.flatMap(monthData => 
            monthData.products.length > 0 ? monthData.products.map(p => ({
                Month: monthData.month,
                Product: p.name,
                Quantity: p.quantity
            })) : [{ Month: monthData.month, Product: 'N/A', Quantity: 0 }]
        );
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "monthly_shipment_details.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!analytics) return <div>Loading Reports...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-header">Reports & Analytics</h1>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button onClick={exportPDF} className="btn btn-secondary"><Download size={16} style={{marginRight: '8px'}}/> PDF</button>
                    <button onClick={exportCSV} className="btn btn-secondary"><Download size={16} style={{marginRight: '8px'}}/> CSV</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3>Avg. Delivery Time Prediction</h3>
                    <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)'}}>{analytics.predictions.deliveryTime}</p>
                </div>
                <div className="card">
                    <h3>Avg. Maintenance Cost Prediction</h3>
                    <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)'}}>{analytics.predictions.maintenanceCost}</p>
                </div>
            </div>
            <div className="card" style={{marginTop: '1.5rem'}}>
                <h3 style={{fontWeight: 600}}>Monthly Delivered Volume</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.charts.monthlyVolume}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="totalVolume" name="Total Units" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

