import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const buildGCalURL = (session) => {
  const [year, month, day] = (session.date || '').split('-');
  const [hour, minute] = (session.time || '00:00').split(':');
  if (!year || !hour) return '#';

  const pad = (n) => String(n).padStart(2, '0');
  const start = `${year}${month}${day}T${pad(hour)}${pad(minute)}00`;
  const endHour = String(Number(hour) + 1).padStart(2, '0');
  const end = `${year}${month}${day}T${endHour}${pad(minute)}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `UniQ Session with ${session.studentName || 'Student'}`,
    dates: `${start}/${end}`,
    details: `Topic: ${session.topic || 'Mentoring Session'} | Via UniQ Platform`,
    location: session.link && session.link !== '#' ? session.link : 'UniQ Platform (Online)',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SessionCalendar = ({ allSessions, onDayClick, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const bookedSet = new Set(
    allSessions.map(s => s.date).filter(Boolean)
  );

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const makeDateStr = (d) =>
    `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          style={navBtnStyle}
        >
          <Icon icon="lucide:chevron-left" width="16" />
        </button>
        <span style={{ fontWeight:700, fontSize:'15px', color:'var(--deep-navy)' }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          style={navBtnStyle}
        >
          <Icon icon="lucide:chevron-right" width="16" />
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'6px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:'11px', fontWeight:700, color:'#aaa', padding:'4px 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dateStr = makeDateStr(d);
          const isBooked = bookedSet.has(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(isSelected ? null : dateStr)}
              style={{
                position:'relative',
                aspectRatio:'1',
                border:'none',
                borderRadius:'10px',
                background: isSelected ? 'var(--deep-navy)' : isToday ? '#eef2ff' : 'transparent',
                color: isSelected ? '#fff' : isToday ? '#4f46e5' : '#333',
                fontWeight: isBooked || isToday ? 700 : 400,
                fontSize:'13px',
                cursor: isBooked ? 'pointer' : 'default',
                transition:'all 0.15s ease',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                gap:'2px',
              }}
            >
              {d}
              {isBooked && (
                <span style={{
                  width:'5px', height:'5px', borderRadius:'50%',
                  background: isSelected ? '#a5b4fc' : '#4f46e5',
                  display:'block',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const navBtnStyle = {
  background:'#f4f5f7', border:'none', borderRadius:'8px',
  padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center',
  color:'#555', transition:'background 0.15s'
};

const StatusBadge = ({ status }) => {
  const map = {
    Pending:  { bg:'#fff8e1', color:'#f59e0b', label:'Pending' },
    Accepted: { bg:'#f0fdf4', color:'#22c55e', label:'Confirmed' },
    Declined: { bg:'#fef2f2', color:'#ef4444', label:'Declined' },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{ background:s.bg, color:s.color, padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:800, letterSpacing:'0.5px', textTransform:'uppercase' }}>
      {s.label}
    </span>
  );
};

const MentorDashboardPeer = () => {
  const [sessions, setSessions]   = useState([]);
  const [requests, setRequests]   = useState([]);
  const [allAppts, setAllAppts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);

  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/mentoring/appointments?mentorId=${currentUserId}`, { credentials:'include' });
        const data = await res.json();
        const fmt  = data.map(a => ({ ...a, dateObj: new Date(a.date) }));
        setAllAppts(fmt);
        setSessions(fmt.filter(a => a.status === 'Accepted'));
        setRequests(fmt.filter(a => a.status === 'Pending'));
      } catch (e) {
        console.error('Failed to load sessions:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUserId]);

const handleStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/api/mentoring/status/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json(); 

      if (res.ok) {
        const updatedObj = data.data ? data.data : data; 
        const fmt = { ...updatedObj, dateObj: new Date(updatedObj.date) };
        
        setAllAppts(prev => prev.map(a => a._id === id ? fmt : a));
        if (newStatus === 'Accepted') {
          setSessions(prev => [...prev, fmt]);
        }
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert(`Backend Error: ${data.message || 'Something went wrong on the server'}`);
      }
    } catch (err) {
      console.error("Fetch error details:", err);
      alert(`Network or Parsing Error: check your browser console (F12).`);
    } finally {
      setUpdatingId(null);
    }
  };

  const daySessionsToShow = selectedDate
    ? allAppts.filter(a => a.date === selectedDate && a.status !== 'Declined')
    : [];

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'300px', gap:'12px', color:'#888' }}>
        <Icon icon="lucide:loader-2" width="22" style={{ animation:'spin 1s linear infinite' }} />
        <span style={{ fontWeight:600 }}>Loading your sessions...</span>
      </div>
    );
  }

  return (
    <div style={{ padding:'4px 0' }}>
      <div style={{ marginBottom:'28px' }}>
        <h2 style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--deep-navy)', margin:0 }}>My Peer Mentor Hub</h2>
        <p style={{ color:'#888', marginTop:'6px', fontSize:'14px' }}>Manage incoming requests and track your confirmed sessions.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { label:'Total Sessions', value: allAppts.filter(a=>a.status!=='Declined').length, icon:'lucide:calendar', color:'#4f46e5', bg:'#eef2ff' },
              { label:'Pending Requests', value: requests.length, icon:'lucide:clock', color:'#f59e0b', bg:'#fff8e1' },
              { label:'Confirmed', value: sessions.length, icon:'lucide:check-circle-2', color:'#22c55e', bg:'#f0fdf4' },
            ].map(stat => (
              <div key={stat.label} style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'16px', padding:'20px 22px', display:'flex', alignItems:'center', gap:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ background:stat.bg, borderRadius:'12px', padding:'12px', display:'flex', flexShrink:0 }}>
                  <Icon icon={stat.icon} width="22" style={{ color:stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize:'26px', fontWeight:800, color:'var(--deep-navy)', lineHeight:1 }}>{stat.value}</div>
                  <div style={{ fontSize:'12px', color:'#999', marginTop:'4px', fontWeight:600 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <section>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, color:'var(--deep-navy)' }}>Incoming Requests</h3>
              {requests.length > 0 && (
                <span style={{ background:'#fef3c7', color:'#d97706', fontWeight:800, fontSize:'12px', padding:'2px 9px', borderRadius:'20px' }}>
                  {requests.length} new
                </span>
              )}
            </div>

            {requests.length === 0 ? (
              <EmptyState icon="lucide:inbox" text="No pending requests right now." />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {requests.map(req => (
                  <RequestCard
                    key={req._id}
                    item={req}
                    onAccept={() => handleStatus(req._id, 'Accepted')}
                    onDecline={() => handleStatus(req._id, 'Declined')}
                    loading={updatingId === req._id}
                    acceptLabel="Accept"
                    declineLabel="Decline"
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 style={{ margin:'0 0 16px', fontSize:'1.1rem', fontWeight:800, color:'var(--deep-navy)' }}>Confirmed Sessions</h3>
            {sessions.length === 0 ? (
              <EmptyState icon="lucide:calendar-check" text="No confirmed sessions yet." />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {sessions.map(session => (
                  <ConfirmedCard key={session._id} item={session} gcalUrl={buildGCalURL(session)} joinLabel="Start Meeting" />
                ))}
              </div>
            )}
          </section>
        </div>

        <div style={{ position:'sticky', top:'20px' }}>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'22px', border:'1px solid #f0f0f0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
              <Icon icon="lucide:calendar-days" width="18" style={{ color:'var(--deep-navy)' }} />
              <h3 style={{ margin:0, fontSize:'14px', fontWeight:800, color:'var(--deep-navy)' }}>Session Calendar</h3>
            </div>

            <SessionCalendar
              allSessions={allAppts.filter(a => a.status !== 'Declined')}
              onDayClick={setSelectedDate}
              selectedDate={selectedDate}
            />

            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'16px', paddingTop:'14px', borderTop:'1px solid #f0f0f0' }}>
              <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#4f46e5', display:'inline-block' }} />
              <span style={{ fontSize:'11px', color:'#999', fontWeight:600 }}>= session booked</span>
            </div>

            {selectedDate && (
              <div style={{ marginTop:'16px', borderTop:'1px solid #f0f0f0', paddingTop:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                  <span style={{ fontSize:'13px', fontWeight:800, color:'var(--deep-navy)' }}>
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' })}
                  </span>
                  <button onClick={() => setSelectedDate(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', padding:'2px' }}>
                    <Icon icon="lucide:x" width="14" />
                  </button>
                </div>

                {daySessionsToShow.length === 0 ? (
                  <p style={{ fontSize:'12px', color:'#bbb', textAlign:'center', padding:'10px 0' }}>No sessions on this day.</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {daySessionsToShow.map(s => (
                      <div key={s._id} style={{ background:'#f9fafb', borderRadius:'10px', padding:'10px 12px', borderLeft:'3px solid #4f46e5' }}>
                        <div style={{ fontSize:'12px', fontWeight:700, color:'var(--deep-navy)' }}>{s.studentName || 'Student'}</div>
                        <div style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>{s.topic}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'6px' }}>
                          <Icon icon="lucide:clock" width="11" style={{ color:'#4f46e5' }} />
                          <span style={{ fontSize:'11px', color:'#4f46e5', fontWeight:700 }}>{s.time}</span>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'#fafafa', borderRadius:'16px', border:'1px dashed #e5e7eb', gap:'10px' }}>
    <Icon icon={icon} width="28" style={{ color:'#d1d5db' }} />
    <p style={{ margin:0, color:'#aaa', fontSize:'13px', fontWeight:600 }}>{text}</p>
  </div>
);

const RequestCard = ({ item, onAccept, onDecline, loading, acceptLabel, declineLabel }) => (
  <div style={{ background:'#fff', border:'1px solid #fde68a', borderLeft:'4px solid #f59e0b', borderRadius:'16px', padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', transition:'box-shadow 0.15s', boxShadow:'0 2px 6px rgba(0,0,0,0.04)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:'14px', flex:1 }}>
      <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'#fff8e1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon icon="lucide:user" width="20" style={{ color:'#d97706' }} />
      </div>
      <div>
        <div style={{ fontWeight:700, color:'var(--deep-navy)', fontSize:'15px' }}>{item.studentName || 'Student'}</div>
        <div style={{ fontSize:'12px', color:'#888', marginTop:'3px' }}>{item.topic}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'5px' }}>
          <Icon icon="lucide:calendar" width="12" style={{ color:'#bbb' }} />
          <span style={{ fontSize:'12px', color:'#999' }}>{item.date}</span>
          <Icon icon="lucide:clock" width="12" style={{ color:'#bbb', marginLeft:'4px' }} />
          <span style={{ fontSize:'12px', color:'#999' }}>{item.time}</span>
        </div>
      </div>
    </div>
    <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
      <button onClick={onDecline} disabled={loading} style={{ padding:'8px 16px', borderRadius:'10px', border:'1px solid #fee2e2', background:'#fff', color:'#ef4444', fontWeight:700, fontSize:'13px', cursor:'pointer', transition:'all 0.15s' }}>
        {declineLabel}
      </button>
      <button onClick={onAccept} disabled={loading} style={{ padding:'8px 18px', borderRadius:'10px', border:'none', background:'#22c55e', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer', transition:'all 0.15s' }}>
        {loading ? '...' : acceptLabel}
      </button>
    </div>
  </div>
);

const ConfirmedCard = ({ item, gcalUrl, joinLabel }) => (
  <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderLeft:'4px solid #22c55e', borderRadius:'16px', padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', boxShadow:'0 2px 6px rgba(0,0,0,0.04)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:'14px', flex:1 }}>
      <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon icon="lucide:user-check" width="20" style={{ color:'#22c55e' }} />
      </div>
      <div>
        <div style={{ fontWeight:700, color:'var(--deep-navy)', fontSize:'15px' }}>{item.studentName || 'Student'}</div>
        <div style={{ fontSize:'12px', color:'#888', marginTop:'3px' }}>{item.topic}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'5px' }}>
          <Icon icon="lucide:calendar" width="12" style={{ color:'#bbb' }} />
          <span style={{ fontSize:'12px', color:'#999' }}>{item.date}</span>
          <Icon icon="lucide:clock" width="12" style={{ color:'#bbb', marginLeft:'4px' }} />
          <span style={{ fontSize:'12px', color:'#999' }}>{item.time}</span>
        </div>
      </div>
    </div>
    <div style={{ display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end', flexShrink:0 }}>
      {item.link && item.link !== '#' && (
        <button onClick={() => window.open(item.link, '_blank')} style={{ padding:'8px 18px', borderRadius:'10px', border:'none', background:'#2D8CFF', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
          <Icon icon="lucide:video" width="14" /> {joinLabel}
        </button>
      )}
      <a href={gcalUrl} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#888', textDecoration:'none', fontWeight:600, padding:'5px 8px', borderRadius:'8px', background:'#f9fafb', border:'1px solid #f0f0f0' }}>
        <Icon icon="simple-icons:googlecalendar" width="12" style={{ color:'#4285F4' }} />
        Add to Google Calendar
      </a>
    </div>
  </div>
);

export default MentorDashboardPeer;
