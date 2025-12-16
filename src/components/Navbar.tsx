import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="#" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/logo.png" alt="UniQ logo" className="navbar-logo-image" width={32} height={32} />
                </a>
            </div>

            <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <div className="dropdown">
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                </div>
                <div className="dropdown">
                    <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                </div>
                <div className="dropdown">
                    <a href="#team" onClick={() => setIsMenuOpen(false)}>Team</a>
                </div>
                <button className="btn-request-demo">Sign up</button>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
