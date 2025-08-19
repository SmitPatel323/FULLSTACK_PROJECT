import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
    return (
        <div className="layout-container">
            <Navbar />
            <main className="layout-main-content">
                {children}
            </main>
        </div>
    );
}
