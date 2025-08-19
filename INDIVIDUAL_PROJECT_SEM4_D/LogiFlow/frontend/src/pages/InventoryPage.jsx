// import React, { useState, useEffect } from 'react';
// import apiClient from '../services/api';
// import { AlertTriangle } from 'lucide-react';

// export default function InventoryPage() {
//     const [products, setProducts] = useState([]);
//     useEffect(() => { apiClient.get('/products/').then(res => setProducts(res.data)); }, []);

//     // --- NEW FUNCTION TO DETERMINE STOCK STATUS ---
//     const getStockStatus = (product) => {
//         if (product.stock === 0) {
//             return (
//                 <span style={{color: '#b91c1c', display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
//                     <AlertTriangle size={16} style={{marginRight: '8px'}}/>Out of Stock
//                 </span>
//             );
//         }
//         if (product.is_low_stock) {
//             return (
//                 <span style={{color: '#d97706', display: 'flex', alignItems: 'center'}}>
//                     <AlertTriangle size={16} style={{marginRight: '8px'}}/>Low Stock
//                 </span>
//             );
//         }
//         return <span style={{color: '#065f46'}}>In Stock</span>;
//     };
//     //-------------------------------------------
//     return (
//         <div>
//             <h1 className="page-header">Product Inventory</h1>
//             <div className="card">
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>SKU</th>
//                             <th>Stock</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map(p => (
//                             <tr key={p.id}>
//                                 <td>{p.name}</td>
//                                 <td>{p.sku}</td>
//                                 <td>{p.stock}</td>
//                                 <td>
//                                     {p.is_low_stock ? 
//                                         <span style={{color: 'var(--danger-color)', display: 'flex', alignItems: 'center'}}>
//                                             <AlertTriangle size={16} style={{marginRight: '8px'}}/>Low Stock
//                                         </span> : 
//                                         <span style={{color: '#065f46'}}>In Stock</span>
//                                     }
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

 
//---------------------------------------------------------

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

    // This function now correctly reads the 'stock_status' string from the backend
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
                                {/* --- THIS IS THE FIX --- */}
                                {/* This now correctly calls the function to display the right status */}
                                <td>{getStockStatusDisplay(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

//---------------------------------------------------------