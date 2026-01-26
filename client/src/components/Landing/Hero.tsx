import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <h1 className="hero-title reveal-on-scroll">
                    The Unified <br /> Social-Academic <br /> Ecosystem
                </h1>
                <p className="hero-subtitle reveal-on-scroll delay-200">
                    Stop juggling spreadsheets and emails. Manage your projects,
                    find mentors, and track events in one intuitive platform.
                </p>
                <div className="hero-buttons reveal-on-scroll delay-400">
                    <a href="#pricing" className="btn-get-uniq">Get UniQ now</a>
                    
                    <button className="btn-watch-demo">Watch demo video</button>
                </div>
            </div>
            
            <div className="hero-image-container reveal-on-scroll delay-600">
                <div className="image-placeholder">
                    <img 
                        src="/Landing/heroimg.png" 
                        alt="UniQ platform dashboard preview" 
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;