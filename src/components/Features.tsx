import React from 'react';
import './Features.css';

const featuresData = [
    {
        title: "Build the Perfect Team.",
        description: "Create profiles showcasing your skills and interests. Use our Skill Matching Engine to find compatible teammates and form groups 70-60% faster.",
        image: "/feature1.png"
    },
    {
        title: "Never Miss a Campus Beat.",
        description: "Clubs and departments post real-time announcements. Get event pop-ups and notifications so you are always aware of what is happening on campus.",
        image: "/feature2.png"
    },
    {
        title: "Connect with Experts.",
        description: "Juniors can book peer tutoring with seniors. Lecturers can display expertise and sync consultation slots directly with Google Calendar.",
        image: "/feature3.png"
    }
];

const Features: React.FC = () => {
    return (
        <section className="features-section" id="features">
            <h2 className="features-heading reveal-on-scroll">Key Features Breakdown</h2>

            <div className="features-masonry">
                {featuresData.map((feature, index) => (
                    <div
                        key={index}
                        className={`feature-card reveal-on-scroll delay-${(index + 1) * 200}`}
                        onMouseMove={(e) => {
                            const card = e.currentTarget;
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            card.style.setProperty('--mouse-x', `${x}px`);
                            card.style.setProperty('--mouse-y', `${y}px`);
                        }}
                    >
                        <div className="feature-image">
                            <img src={feature.image} alt={feature.title} className="feature-img-element" />
                        </div>
                        <div className="feature-content">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
