import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        apiClient.get('/products/')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch inventory:", err);
                setLoading(false);
            });
    }, []);

    const getStockStatusDisplay = (product) => {
        switch (product.stock_status) {
            case "Out of Stock":
                return (
                    <span style={{color: '#b91c1c', display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
                        <AlertTriangle size={16} style={{marginRight: '8px'}}/>Out of Stock
                    </span>
                );
            case "Low Stock":
                return (
                    <span style={{color: '#d97706', display: 'flex', alignItems: 'center'}}>
                        <AlertTriangle size={16} style={{marginRight: '8px'}}/>Low Stock
                    </span>
                );
            case "In Stock":
            default:
                return <span style={{color: '#065f46'}}>In Stock</span>;
        }
    };
    
    if (loading) return <div>Loading inventory...</div>;

    return (
        <div>
            <h1 className="page-header">Product Inventory</h1>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.stock}</td>
                                <td>{getStockStatusDisplay(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

