import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import HowItWorks from './components/Landing/HowItWorks';
import Pricing from './components/Landing/Pricing';
import Team from './components/Landing/Team';
import Footer from './components/Landing/Footer';
import Home from './dashboard/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if user is already logged in / Returning from Google OAuth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
           credentials: 'include' 
        });
        const data = await response.json();
        
        if (data.authenticated) {
           console.log("Login verified. User role:", data.user.role);
           handleLogin(); 
        }
      } catch (error) {
        console.log("User is not logged in");
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div className="app-container">
      <Navbar onSignUpSuccess={handleLogin} />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Team />
      <Footer />
    </div>
  );
}

export default App;