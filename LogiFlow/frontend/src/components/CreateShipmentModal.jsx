import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api';
import './CreateShipmentModal.css';

const sampleAddresses = [
    { origin: 'Vastrapur Lake, Ahmedabad, Gujarat', destination: 'Ahmedabad One Mall, Vastrapur, Ahmedabad' },
    { origin: 'Sabarmati Ashram, Ahmedabad, Gujarat', destination: 'Sabarmati Riverfront Flower Park, Ahmedabad, Gujarat' },
    { origin: 'Law Garden, Ahmedabad, Gujarat', destination: 'Kankaria Lake, Ahmedabad, Gujarat' },
    { origin: 'Gujarat University, Ahmedabad, Gujarat', destination: 'Sabarmati Ashram, Ahmedabad, Gujarat' },
    { origin: 'Sabarmati Ashram, Ahmedabad, Gujarat', destination: 'Iscon Mega Mall, Sarkhej - Gandhinagar Hwy, Ahmedabad' }
];

export default function CreateShipmentModal({ isOpen, onClose, onShipmentCreated }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapUrl, setMapUrl] = useState('');
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [directionsLoading, setDirectionsLoading] = useState(false);
    const modalContentRef = useRef(null);

    
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedProduct('');
            setQuantity(1);
            setStartAddress('');
            setEndAddress('');
            setError('');
            setMapUrl('');
            setDistance('');
            setDuration('');
            
            apiClient.get('/products/')
                .then(res => setProducts(res.data))
                .catch(err => console.error("Failed to fetch products", err));
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            apiClient.get('/products/').then(res => setProducts(res.data));
        }
    }, [isOpen]);

    const handleGetDirections = async () => {
        if (!startAddress || !endAddress) {
            setError("Please enter both start and end addresses.");
            return;
        }
        setError('');
        setDirectionsLoading(true);
        setDistance('');
        setDuration('');

        const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(startAddress)}&destination=${encodeURIComponent(endAddress)}`;
        setMapUrl(embedUrl);

        try {
            const response = await apiClient.post('/get-directions/', { start_address: startAddress, end_address: endAddress });
            setDistance(response.data.distance);
            setDuration(response.data.duration);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Could not fetch directions.';
            setError(errorMessage);
        } finally {
            setDirectionsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiClient.post('/shipments/', {
                product_id: selectedProduct,
                quantity,
                start_address: startAddress,
                end_address: endAddress,
            });
            onShipmentCreated();
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data[0] || 'Failed to create shipment. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressFocus = () => {
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (origin, destination) => {
        setStartAddress(origin);
        setEndAddress(destination);
        setShowSuggestions(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div ref={modalContentRef} className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Create New Shipment</h2>
                {error && <p className="modal-error">{error}</p>}
                
                {mapUrl && (
                    <div className="directions-container">
                        <iframe
                            width="100%"
                            height="250"
                            style={{ border: 0, borderRadius: '6px' }}
                            loading="lazy"
                            allowFullScreen
                            src={mapUrl}>
                        </iframe>
                        <div className="directions-info">
                            <div><strong>Distance:</strong> {distance || '...'}</div>
                            <div><strong>Duration:</strong> {duration || '...'}</div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Product</label>
                        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="form-select" required>
                            <option value="">Select a product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-input" required/>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Start Address (Origin)</label>
                        <input 
                            type="text" 
                            value={startAddress} 
                            onChange={(e) => setStartAddress(e.target.value)} 
                            className="form-input" 
                            placeholder="e.g., Ahmedabad Airport, Gujarat" 
                            required
                            onFocus={handleAddressFocus} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Address (Destination)</label>
                        <input 
                            type="text" 
                            value={endAddress} 
                            onChange={(e) => setEndAddress(e.target.value)} 
                            className="form-input" 
                            placeholder="e.g., Surat Airport, Gujarat" 
                            required
                            onFocus={handleAddressFocus} 
                        />
                    </div>

                    {showSuggestions && (
                        <div className="suggestions-box">
                            <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#6b778c'}}>Try an example:</p>
                            <ul>
                                {sampleAddresses.map((addr, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(addr.origin, addr.destination)}>
                                        <strong>From:</strong> {addr.origin} <br/>
                                        <strong>To:</strong> {addr.destination}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="form-group">
                        <button type="button" onClick={handleGetDirections} className="btn btn-secondary" disabled={directionsLoading}>
                            {directionsLoading ? 'Getting Directions...' : 'Get Directions'}
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading || !distance} className="btn btn-primary">
                            {loading ? 'Creating...' : 'Create Shipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
