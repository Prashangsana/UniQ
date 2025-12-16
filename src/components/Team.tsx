import React from 'react';
import './Team.css';

const teamMembers = [
    {
        name: "Prabhavi Solomon",
        role: "Lead Full Stack & API Engineer",
        image: "",
        bio: "The vision keeper who bridges design and functionality, ensuring the platform feels complete and unified"
    },
    {
        name: "Yahani Dissanayake",
        role: "Core Feature Engineer",
        image: "",
        bio: "The builder behind the platform's core activities, powering the events and community tools you use most."
    },
    {
        name: "Sewmini Senevirathna",
        role: "Integration & Systems Developer",
        image: "",
        bio: "The bridge between user actions and system responses, ensuring that navigation and access flow smoothly."
    },
    {
        name: "Upeshi Sorajapathi",
        role: "UI/UX & Visuals Developer",
        image: "",
        bio: "The detail-oriented eye who ensures the interface is polished, consistent, and looks great on every screen."
    },
    {
        name: "Dinuli Hangawaththa",
        role: "Interactive Modules Developer",
        image: "",
        bio: "The interaction specialist focused on making the platform engaging, dynamic, and fun to interact with."
    },
    {
        name: "Prashangsana Dissanayake",
        role: "Backend & API Architect",
        image: "",
        bio: "The structural anchor who manages the data and operations running behind the scenes to keep everything fast and stable."
    }
];

const Team: React.FC = () => {
    return (
        <section className="team-section" id="team">
            <div className="team-container">
                <h2 className="section-heading reveal-on-scroll">Meet the Team</h2>
                <p className="section-subheading reveal-on-scroll delay-200">The passionate individuals behind UniQ.</p>

                <div className="team-masonry-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card reveal-on-scroll" style={{ animationDelay: `${(index + 1) * 0.2}s` }}>
                            <div className="member-image-container">
                                <img src={member.image} alt={member.name} className="member-image" />
                            </div>
                            <div className="member-info">
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-role">{member.role}</p>
                                <p className="member-bio">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
