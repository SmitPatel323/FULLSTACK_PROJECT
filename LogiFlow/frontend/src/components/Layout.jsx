import React from 'react';
import { useState } from 'react'; 
import Navbar from './Navbar';
import './Layout.css';
import { Menu } from 'lucide-react'; 

export default function Layout({ children }) {


const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <div className="layout-container">
            <button className="mobile-menu-button" onClick={toggleNav}>
                <Menu size={28} />
            </button>

            <Navbar isNavOpen={isNavOpen} />

            <main className="layout-main-content">
                {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
                {children}
            </main>
        </div>
    );
}

