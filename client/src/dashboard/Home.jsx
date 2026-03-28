import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Home.css';

// Core View Imports
import DashboardView from './DashboardView';
import SettingsView from './SettingsView';
import GroupsPage from '../pages/GroupsPage';
import Profile from '../components/Landing/Profile';
import { EventsPage } from '../pages/Event'; 
import { LeaderDashboard } from '../components/events/Leader/pages/Leader';

// Mentoring Imports (Preserved from your branch)
import PeerMentoring from '../pages/PeerMentoring';
import LecturerMentoring from '../pages/LecturerMentoring';
import MentorDashboardPeer from '../pages/MentorDashboardPeer';
import MentorDashboardLecturer from '../pages/MentorDashboardLecturer';
import MentoringHub from '../pages/MentoringHub';

const SkillsView = () => (
    <div className="content-section fade-in">
        <h2>Skill Matching</h2>
        <p>Connect with others based on shared skills and interests.</p>
    </div>
);

const Home = ({ myEventsList, onAddEvent, onRemoveEvent, onLogout, userRole: propRole }) => {
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


    const [userName, setUserName] = useState(localStorage.getItem('user_name') || 'User');
    const [userPhoto, setUserPhoto] = useState(localStorage.getItem('user_photo') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'student');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        const syncUserData = () => {
            setUserName(localStorage.getItem('user_name') || 'User');
            setUserPhoto(localStorage.getItem('user_photo') || '');
            setUserRole(localStorage.getItem('user_role') || 'student');
        };

        if (location.state && location.state.tab) {
            setActiveTab(location.state.tab);
        }

        window.addEventListener('storage', syncUserData);
        return () => window.removeEventListener('storage', syncUserData);
    }, [location.state]);

    /* 3. FRIEND'S CHANGES: Sidebar Profile Fetch */
    useEffect(() => {
        const fetchUserForSidebar = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/profile`, { 
                    credentials: 'include' 
                });
                const result = await response.json();
                if (result.success) {
                    const fetchedName = result.data.name || result.data.firstName || 'User';
                    setUserName(fetchedName);
                    setUserPhoto(result.data.profileImage || result.data.photo || '');
                    // setUserRole(result.data.role || 'student');
                    localStorage.setItem('user_name', fetchedName);
                }
            } catch (err) {
                console.error("SideBar Sync Error:", err);
            }
        };
        fetchUserForSidebar();
    }, [API_URL]);

    const avatarSrc = userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${userName !== 'User' ? userName : 'Guest'}`;

    /* Integrated Mentoring & Leader Views */
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': 
                return <DashboardView 
                    onSeeAll={() => setActiveTab('groups')} 
                    onSeeEvents={() => setActiveTab('society')}
                    onMentorSelect={(tab) => setActiveTab(tab)}
                />;
            case 'profile':   return <Profile />;
            case 'society':   return <EventsPage myEventsList={myEventsList} onAddEvent={onAddEvent} onRemoveEvent={onRemoveEvent} />;
            case 'leader':    return <LeaderDashboard />;
            case 'groups':    return <GroupsPage userRole={userRole}/>;
            case 'skills':    return <SkillsView />;
            case 'settings':  return <SettingsView />;
            
            // Mentoring Views (Your Work)
            case 'mentoring-hub': 
                return <MentoringHub onSelectCategory={(category) => setActiveTab(category)} />;
            case 'peer-mentoring': 
                return <PeerMentoring onBack={() => setActiveTab('mentoring-hub')} />;
            case 'lecturer-mentoring': 
                return <LecturerMentoring onBack={() => setActiveTab('mentoring-hub')} />;
            case 'peer-dashboard-view': 
                return <MentorDashboardPeer />;
            case 'lecturer-dashboard-view': 
                return <MentorDashboardLecturer />;
                
            default: return <DashboardView onSeeAll={() => setActiveTab('groups')} />;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-brand-mobile"><span className="brand-text">UniQ</span></div>

                <div className="sidebar-profile">
                    <div className="profile-img-container" onClick={() => setActiveTab('profile')} style={{cursor:'pointer'}}>
                        <img src={avatarSrc} alt="Profile" className="profile-img" />
                        <div className="status-indicator"></div>
                    </div>
                    <div className="profile-info">
                        <h3>Hi, {(userName && userName !== 'User') ? userName.split(' ')[0] : 'User'}</h3>
                        <p className="sidebar-role-tag">
                            {userRole === 'lecturer' ? 'University Lecturer' : 'Student Member'}
                        </p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className={activeTab === 'dashboard' ? 'active' : ''}>
                            <a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
                                <Icon icon="lucide:layout-dashboard" width="20" /> <span>Dashboard</span>
                            </a>
                        </li>
                        <li className={activeTab === 'leader' ? 'active' : ''}>
                            <a href="#leader" onClick={(e) => { e.preventDefault(); setActiveTab('leader'); }}>
                                <Icon icon="lucide:shield-check" width="20" /> <span>Society Leader</span>
                            </a>
                        </li>
                        <li className={activeTab === 'society' ? 'active' : ''}>
                            <a href="#society" onClick={(e) => { e.preventDefault(); setActiveTab('society'); }}>
                                <Icon icon="lucide:party-popper" width="20" /> <span>Society & Events</span>
                            </a>
                        </li>
                        <li className={activeTab === 'groups' ? 'active' : ''}>
                            <a href="#groups" onClick={(e) => { e.preventDefault(); setActiveTab('groups'); }}>
                                <Icon icon="lucide:users" width="20" /> <span>Groups</span>
                            </a>
                        </li>
                        <li className={['mentoring-hub', 'peer-mentoring', 'lecturer-mentoring'].includes(activeTab) ? 'active' : ''}>
                            <a href="#mentoring" onClick={(e) => { e.preventDefault(); setActiveTab('mentoring-hub'); }}>
                                <Icon icon="lucide:book-open" width="20" /> <span>Mentoring</span>
                            </a>
                        </li>
                    </ul>

                    <div className="nav-divider"></div>

                    <ul>
                        <li className={activeTab === 'settings' ? 'active' : ''}>
                            <a href="#settings" onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
                                <Icon icon="lucide:settings" width="20" /> <span>Settings</span>
                            </a>
                        </li>
                        <li className="logout-item">
                            {/* 5. EDITED: Using localStorage.clear() for a clean logout */}
                            <a href={`${API_URL}/auth/logout`} onClick={() => localStorage.clear()}>
                                <Icon icon="lucide:log-out" width="20" /> <span>Logout</span>
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
                    <div className="header-right">
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
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Home;