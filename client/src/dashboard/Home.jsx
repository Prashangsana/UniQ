import React, { useState, useEffect, use } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Home.css';

import DashboardView from './DashboardView';
import SettingsView from './SettingsView';
import { EventsPage } from '../pages/Event';

const GroupsView = () => (
  <div className="content-section fade-in">
    <h2>Study Groups</h2>
    <p>Find study partners or manage your current project groups.</p>
  </div>
);

const SkillsView = () => (
  <div className="content-section fade-in">
    <h2>Skill Matching</h2>
    <p>Connect with others based on shared skills and interests.</p>
  </div>
);

const ArticlesView = () => (
  <div className="content-section fade-in">
    <h2>Articles & Resources</h2>
    <p>Read the latest academic articles and shared resources.</p>
  </div>
);

const Home = ({ myEventsList }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (path.includes('/society') || path.includes('/events')) return 'society';
    if (path.includes('/groups')) return 'groups';
    if (path.includes('/skills')) return 'skills';
    if (path.includes('/articles')) return 'articles';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  });

  const location = useLocation();
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/dashboard')) {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            }
        }
    }, [location]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (window.location.pathname.includes('/society') || window.location.pathname.includes('/events')) {
      setActiveTab('society');
    }
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.pathname, location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'society':   return <EventsPage myEventsList={myEventsList} />;
      case 'groups':    return <GroupsView />;
      case 'skills':    return <SkillsView />;
      case 'articles':  return <ArticlesView />;
      case 'settings':  return <SettingsView />;
      default:          return <DashboardView />;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand-mobile">
          <span className="brand-text">UniQ</span>
        </div>

        <div className="sidebar-profile">
          <div className="profile-img-container">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User Profile"
              className="profile-img"
            />
            <div className="status-indicator"></div>
          </div>
          <div className="profile-info">
            <h3>Hi, Alex</h3>
            <p>Student Member</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
                <Icon icon="lucide:layout-dashboard" width="20" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className={activeTab === 'society' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('society'); }}>
                <Icon icon="lucide:party-popper" width="20" />
                <span>Society & Events</span>
              </a>
            </li>
            <li className={activeTab === 'groups' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('groups'); }}>
                <Icon icon="lucide:users" width="20" />
                <span>Groups</span>
              </a>
            </li>
            <li className={activeTab === 'skills' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('skills'); }}>
                <Icon icon="lucide:brain-circuit" width="20" />
                <span>Skill Matching</span>
              </a>
            </li>
            <li className={activeTab === 'articles' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('articles'); }}>
                <Icon icon="lucide:file-text" width="20" />
                <span>Articles</span>
              </a>
            </li>
          </ul>

          <div className="nav-divider"></div>

          <ul>
            <li className={activeTab === 'settings' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
                <Icon icon="lucide:settings" width="20" />
                <span>Settings</span>
              </a>
            </li>
            <li className="logout-item">
              <a 
                href={`${API_URL}/auth/logout`} 
                onClick={() => localStorage.removeItem('is_logged_in')}
              >
                <Icon icon="lucide:log-out" width="20" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="header-logo">
              <img src="/logo.png" alt="UniQ" width="28" height="28" />
              <span className="logo-text">UniQ</span>
            </div>
          </div>

          <div className="header-center">
            <div className="search-bar">
              <Icon icon="lucide:search" className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            <button className="icon-btn"><Icon icon="lucide:mail" width="22" /></button>
            <button className="icon-btn relative">
              <Icon icon="lucide:bell" width="22" />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {renderContent()}

          <footer className="dashboard-footer">
            <p>&copy; {new Date().getFullYear()} UniQ by Team Csypher. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#help">Help Center</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;