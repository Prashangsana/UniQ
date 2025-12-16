import React from 'react';
import './Pricing.css';

const pricingPlans = [
    {
        title: "Student Basic",
        subtitle: "For Current University Students",
        price: "Free",
        period: "Forever",
        features: [
            "Unlimited Project Groups",
            "Campus Event Pop-ups",
            "Find Study Partners",
            "Peer Tutoring Booking",
            "Community Forum Access"
        ],
        isPopular: false,
        buttonStyle: "outline",
        buttonText: "Join Now"
    },
    {
        title: "Pro Mentor",
        subtitle: "For Alumni",
        price: "$10.99",
        period: "USD/month",
        features: [
            "Everything in Student Basic",
            "Verified \"Top Mentor\" Badge",
            "Cross-Institution Networking",
            "Advanced Profile Analytics"
        ],
        isPopular: false,
        buttonStyle: "filled",
        buttonText: "Start Free Trial"
    },
    {
        title: "Institution",
        subtitle: "For Universities & Organizations",
        price: "$990.99",
        period: "USD/month",
        features: [
            "Unlimited Users & Sites",
            "Dedicated Server Deployment",
            "Google Calendar API Integration",
            "Lecturer Dashboard Panel"
        ],
        isPopular: false,
        buttonStyle: "outline",
        buttonText: "Contact Sales"
    }
];

const Pricing: React.FC = () => {
    return (
        <section className="pricing-section" id="pricing">
            <h2 className="section-heading reveal-on-scroll">Plans and Pricing</h2>
            <div className="pricing-container">
                {pricingPlans.map((plan, index) => (
                    <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''} reveal-on-scroll delay-${(index + 1) * 200}`}>
                        {plan.isPopular && <div className="popular-badge">Popular</div>}

                        <h3 className="plan-title">{plan.title}</h3>
                        <p className="plan-subtitle">{plan.subtitle}</p>

                        <div className="plan-price-container">
                            <span className="plan-price">{plan.price}</span>
                            <span className="plan-period">{plan.period}</span>
                        </div>

                        <button className={`btn-pricing ${plan.buttonStyle}`}>{plan.buttonText}</button>

                        <ul className="plan-features">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>
                                    <span className="check-icon">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
