import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Team from './components/Team';
import Footer from './components/Footer';
import Home from './dashboard/Home'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if user is already logged in Returning from Google OAuth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Send "credentials: include" so the browser sends the cookie to backend
        const response = await fetch('http://localhost:5000/auth/me', {
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