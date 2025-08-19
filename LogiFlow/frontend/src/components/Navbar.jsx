import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Truck, Warehouse, BarChart2, Car, User, LogOut, Ship } from 'lucide-react';
import './Navbar.css';

const navLinks = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/' },
    { icon: Truck, name: 'Shipments', path: '/shipments' },
    { icon: Car, name: 'Fleet', path: '/fleet' },
    { icon: Warehouse, name: 'Inventory', path: '/inventory' },
    { icon: BarChart2, name: 'Reports', path: '/reports' },
    { icon: User, name: 'Profile', path: '/profile' },
];

export default function Navbar({ isNavOpen }) { // Accept the isNavOpen prop
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Add the 'is-open' class conditionally
    const navContainerClass = `navbar-container ${isNavOpen ? 'is-open' : ''}`;

    return (
        <aside className={navContainerClass}>
            <div className="navbar-header">
                <Ship size={28} />
                <h1>LogiFlow</h1>
            </div>
            <nav className="navbar-nav">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === '/'}
                        className={({ isActive }) =>
                            `navbar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <link.icon className="navbar-icon" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>
            <div className="navbar-footer">
                <button onClick={handleLogout} className="navbar-link logout-btn">
                    <LogOut className="navbar-icon" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
