import React from 'react';
import { Icon } from '@iconify/react';
import './Team.css';

const teamMembers = [
    {
        name: "Prabhavi Solomon",
        role: "Lead Full Stack & API Engineer",
        image: "teammember1.jpg",
        bio: "The vision keeper who bridges design and functionality, ensuring the platform feels complete and unified",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Yahani Dissanayake",
        role: "Core Feature Engineer",
        image: "teammember1.jpg",
        bio: "The builder behind the platform's core activities, powering the events and community tools you use most.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Sewmini Senevirathna",
        role: "Integration & Systems Developer",
        image: "teammember1.jpg",
        bio: "The bridge between user actions and system responses, ensuring that navigation and access flow smoothly.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Upeshi Sorajapathi",
        role: "UI/UX & Visuals Developer",
        image: "teammember1.jpg",
        bio: "The detail-oriented eye who ensures the interface is polished, consistent, and looks great on every screen.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Dinuli Hangawaththa",
        role: "Interactive Modules Developer",
        image: "teammember1.jpg",
        bio: "The interaction specialist focused on making the platform engaging, dynamic, and fun to interact with.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Prashangsana Dissanayake",
        role: "Backend & API Architect",
        image: "teammember.jpg",
        bio: "The structural anchor who manages the data and operations running behind the scenes to keep everything fast and stable.",
        linkedin: "https://www.linkedin.com/feed/"
    }
];

const Team: React.FC = () => {
    return (
        <section className="team-section" id="team">
            <div className="team-container">
                <h2 className="section-heading reveal-on-scroll">Meet the Team</h2>
                <p className="section-subheading reveal-on-scroll delay-200">The passionate individuals behind UniQ</p>

                <div className="team-masonry-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card reveal-on-scroll" style={{ animationDelay: `${(index + 1) * 0.2}s` }}>
                            {/* Image Area */}
                            <div className="member-image-container">
                                <div className="member-image-wrapper">
                                    <img src={member.image} alt={member.name} className="member-image" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="member-info">
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-role">{member.role}</p>
                                <p className="member-bio">{member.bio}</p>
                            </div>

                            <a 
                                href={member.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="linkedin-overlay"
                                aria-label={`View ${member.name}'s LinkedIn`}
                            >
                                <div className="linkedin-btn">
                                    <Icon icon="fa6-brands:linkedin-in" width="20" height="20" />
                                    <span>View LinkedIn</span>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;