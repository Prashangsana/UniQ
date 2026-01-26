import React from 'react';
import { Icon } from '@iconify/react';
import './Team.css';

const teamMembers = [
    {
        name: "Prabhavi Solomon",
        role: "Full Stack Developer",
        image: "/Landing/teammember1.jpg",
        bio: "Working on both the front and back end to bring the whole vision to life.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Yahani Dissanayake",
        role: "Feature Developer",
        image: "/Landing/teammember1.jpg",
        bio: "Building the core features like events and community tools you use everyday.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Sewmini Senevirathna",
        role: "System Developer",
        image: "/Landing/teammember1.jpg",
        bio: "Ensuring the system connects smoothly so everything runs without a hitch.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Upeshi Sorajapathi",
        role: "UI/UX Designer",
        image: "/Landing/teammember1.jpg",
        bio: "Crafting the designs to make sure the app looks good and feels right.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Dinuli Hangawaththa",
        role: "Frontend Developer",
        image: "/Landing/teammember1.jpg",
        bio: "Creating the interactive parts that make the site engaging and fun to use.",
        linkedin: "https://www.linkedin.com/feed/"
    },
    {
        name: "Prashangsana Dissanayake",
        role: "Backend Developer",
        image: "/Landing/teammember.jpg",
        bio: "Handling the data and logic behind the scenes to keep things fast.",
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