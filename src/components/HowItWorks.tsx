import { Icon } from '@iconify/react';
import './HowItWorks.css';

const steps = [
    {
        title: "Create Profile",
        description: "Sign-Up with your university mail and list your skills/interests.",
        icon: "lucide:user-plus"
    },
    {
        title: "Connect",
        description: "Join a project group, book a mentor, register for an event.",
        icon: "lucide:users"
    },
    {
        title: "Collaborate",
        description: "Manage your workflow and gain recognition on the community blog.",
        icon: "lucide:rocket"
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section className="how-it-works-section" id="how-it-works">
            <h2 className="section-heading reveal-on-scroll">How It Works</h2>
            <div className="steps-container">
                {steps.map((step, index) => (
                    <div key={index} className={`step-card reveal-on-scroll delay-${(index + 1) * 200}`}>
                        <div className="step-icon-wrapper">
                            <Icon icon={step.icon} width="48" height="48" />
                        </div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                        {index < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
