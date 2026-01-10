import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <a href="#" onClick={() => window.scrollTo(0, 0)}>
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

                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>

            {isSignUpOpen && (
                <div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
                    <div className="modal-content signup-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsSignUpOpen(false)} aria-label="Close">
                            <Icon icon="lucide:x" width="24" height="24" />
                        </button>

                        <div className="signup-header">
                            <h2>Sign Up</h2>
                        </div>

                        <form onSubmit={handleSignUpSubmit} className="signup-form">
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

                            <button type="submit" className="btn-signup-submit">
                                Continue
                            </button>
                        </form>

                        <div className="divider-container">
                            <span className="line"></span>
                            <span className="text">or</span>
                            <span className="line"></span>
                        </div>

                        <button className="btn-google-signup">
                            <Icon icon="devicon:google" width="18" height="18" />
                            <span>Sign up with Google</span>
                        </button>

                        <div className="signup-footer">
                            By clicking on Sign up, you agree to our <a href="#">Terms and Conditions</a>  of Use.
                            <br /><br />
                            To learn more about how we collect, use, shares and protect your personal data please read our <a href="#">Privacy Policy</a>.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;