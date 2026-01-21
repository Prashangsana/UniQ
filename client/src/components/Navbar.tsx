import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Navbar.css';

interface NavbarProps {
    onSignUpSuccess?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignUpSuccess }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    // Define the API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openSignUp = () => {
        setIsMenuOpen(false);
        setIsSignUpOpen(true);
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign up submitted");
        
        if (onSignUpSuccess) {
            onSignUpSuccess();
        }
    };

    // Redirect to dynamic Backend Auth URL
    const handleGoogleLogin = () => {
        window.open(`${API_URL}/auth/google`, "_self");
    };
    
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <a href="/" onClick={handleLogoClick}>
                        <img 
                            src="/logo.png" 
                            alt="UniQ logo" 
                            className="navbar-logo-image" 
                            width={32} 
                            height={32} 
                        />
                    </a>
                </div>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                    <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                    <a href="#team" onClick={() => setIsMenuOpen(false)}>Team</a>
                    
                    <button className="btn-request-demo" onClick={openSignUp}>
                        Sign up
                    </button>
                </div>

                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </nav>

            {isSignUpOpen && (
                <div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
                    <div className="modal-content size-sm" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsSignUpOpen(false)} aria-label="Close">
                            <Icon icon="lucide:x" width="24" height="24" />
                        </button>

                        <div className="modal-header">
                            <h2>Sign Up</h2>
                        </div>

                        <form onSubmit={handleSignUpSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="signup-email">Email address</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    name="email"
                                    required
                                    placeholder="name@domain.com"
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="btn-modal primary">
                                Continue
                            </button>
                        </form>

                        <div className="modal-divider">
                            <span className="line"></span>
                            <span className="text">or</span>
                            <span className="line"></span>
                        </div>

                        <button className="btn-modal google" onClick={handleGoogleLogin}>
                            <Icon icon="devicon:google" width="18" height="18" />
                            <span>Sign up with Google</span>
                        </button>

                        <div className="modal-footer">
                            By clicking on Sign up, you agree to UniQ's <a href="#">Terms and Conditions</a> of Use.
                            <br /><br />
                            To learn more about how we collect, use, share and protect your personal data please read UniQ's <a href="#">Privacy Policy</a>.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;