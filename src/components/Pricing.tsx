import React, { useState } from 'react';
import { Icon } from '@iconify/react';
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
        subtitle: "For Alumni & Tutors",
        price: "$20",
        period: "USD/month",
        features: [
            "Everything in Student Basic",
            "Cross-Institution Networking",
            "Advanced Mentee Analytics"
        ],
        isPopular: false,
        buttonStyle: "filled",
        buttonText: "Start Free Trial"
    },
    {
        title: "Institution",
        subtitle: "For Universities & Organizations",
        price: "$1,200",
        period: "USD/month",
        features: [
            "Unlimited Users & Sites",
            "Dedicated Server Deployment",
            "Google Calendar API Integration",
            "Lecturer Dashboard Panel",
            "24/7 Priority Support",
        ],
        isPopular: false,
        buttonStyle: "outline",
        buttonText: "Contact Sales"
    }
];

const Pricing: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        closeModal();
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <>
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

                <div className="pricing-contact reveal-on-scroll delay-800">
                    <p className="pricing-contact-text">
                        Have a question or want to learn more? We're here to help.
                    </p>
                    <button className="btn-send-message" onClick={openModal}>
                        Send Message
                    </button>
                </div>
            </section>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content size-md" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal} aria-label="Close">
                            <Icon icon="lucide:x" width="24" height="24" />
                        </button>
                        
                        <div className="modal-header">
                            <h2>Get in Touch</h2>
                            <p>Fill out the form below and we'll get back to you soon.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help?"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Tell us about your inquiry..."
                                />
                            </div>
                            
                            <button type="submit" className="btn-modal primary">
                                <Icon icon="lucide:send" width="18" height="18" />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pricing;