import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const MentorLogin = () => {
  const { role } = useParams(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isPeer = role === 'peer';

  const handleLogin = (e) => {
    e.preventDefault();
    const targetTab = isPeer ? 'peer-dashboard-view' : 'lecturer-dashboard-view';
    navigate('/', { state: { tab: targetTab } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f4f5f7', fontFamily: 'var(--font-family, inherit)' }}>
      
      <div className="login-left-panel" style={{ 
        flex: 1, 
        backgroundColor: 'var(--deep-navy)', 
        color: 'white', 
        padding: '60px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        position: 'relative' 
      }}>

         <button 
           onClick={() => navigate(-1)} 
           style={{ position: 'absolute', top: '40px', left: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex', transition: 'background 0.2s' }}
           onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
         >
            <Icon icon="lucide:arrow-left" width="24" />
         </button>

         {/* Dynamic Headers based on Role */}
         <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', lineHeight: '1.2' }}>
           {isPeer ? 'Give a Helping\nHand.' : 'Guide the Next\nGeneration.'}
         </h1>
         <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '50px', lineHeight: '1.6', maxWidth: '450px' }}>
           {isPeer 
             ? 'Join the UniQ peer mentoring program. Share your expertise, help juniors navigate their coursework, and build your own leadership portfolio.'
             : 'Access your faculty dashboard to seamlessly manage office hours, schedule 1-on-1 consultations, and support student success.'}
         </p>

         {/* Meaningful Perks List */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem' }}>
             <Icon icon="lucide:check-circle-2" width="28" style={{ color: 'var(--accent-gold, #d9c086)' }}/>
             <span>{isPeer ? 'Log verifiable mentoring hours' : 'Streamline your booking process'}</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem' }}>
             <Icon icon="lucide:check-circle-2" width="28" style={{ color: 'var(--accent-gold, #d9c086)' }}/>
             <span>{isPeer ? 'Enhance your professional CV' : 'Sync directly with Google Calendar'}</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem' }}>
             <Icon icon="lucide:check-circle-2" width="28" style={{ color: 'var(--accent-gold, #d9c086)' }}/>
             <span>{isPeer ? 'Connect with driven students' : 'Centralize student communications'}</span>
           </div>
         </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
           
           <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
             <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '50%' }}>
               <Icon icon={isPeer ? "lucide:users" : "lucide:graduation-cap"} width="45" style={{ color: 'var(--deep-navy)' }} />
             </div>
           </div>

           <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '10px', color: 'var(--deep-navy)' }}>
             {isPeer ? 'Peer Mentor Login' : 'Faculty Login'}
           </h2>
           <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
             Please sign in with your University credentials.
           </p>

           <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
             
             {/* Email Input */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontWeight: '600', color: '#444', fontSize: '0.95rem' }}>University Email</label>
               <input 
                 type="email" 
                 required 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
                 placeholder={isPeer ? "w1234567@my.westminster.ac.uk" : "name@westminster.ac.uk"}
                 style={{ 
                    padding: '16px', borderRadius: '12px', border: '1px solid #ddd', 
                    fontSize: '15px', fontFamily: 'inherit', outline: 'none', 
                    transition: 'border-color 0.2s', background: '#fafafa' 
                 }}
                 onFocus={(e) => { e.target.style.borderColor = 'var(--deep-navy)'; e.target.style.background = '#fff'; }}
                 onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#fafafa'; }}
               />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontWeight: '600', color: '#444', fontSize: '0.95rem' }}>Password</label>
               <input 
                 type="password" 
                 required 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 placeholder="••••••••"
                 style={{ 
                    padding: '16px', borderRadius: '12px', border: '1px solid #ddd', 
                    fontSize: '15px', fontFamily: 'inherit', outline: 'none', 
                    transition: 'border-color 0.2s', background: '#fafafa' 
                 }}
                 onFocus={(e) => { e.target.style.borderColor = 'var(--deep-navy)'; e.target.style.background = '#fff'; }}
                 onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#fafafa'; }}
               />
             </div>

             {/* Submit Button */}
             <button 
               type="submit" 
               style={{ 
                  background: 'var(--deep-navy)', color: 'white', padding: '16px', 
                  borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', 
                  border: 'none', cursor: 'pointer', marginTop: '15px', 
                  fontFamily: 'inherit', transition: 'opacity 0.2s',
                  boxShadow: '0 4px 15px rgba(13, 33, 79, 0.2)'
               }} 
               onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} 
               onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
             >
               Access Dashboard
             </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;