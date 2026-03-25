import React, { useState, useEffect } from 'react';
import './groups.css';

const ModuleStudentsView = ({ moduleId, groupId, onBack, onViewProfile }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/modules/${moduleId}/available-students`, {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          setStudents(data.data);
          setFilteredStudents(data.data); // Initialize filtered list
        }
      } catch (error) {
        console.error("Failed to fetch available students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchStudents();
  }, [moduleId]);

  // NEW: Handle filtering logic
  useEffect(() => {
    const results = students.filter(student => {
      const nameMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const skillMatch = student.skills?.some(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return nameMatch || skillMatch;
    });
    setFilteredStudents(results);
  }, [searchTerm, students]);

  if (loading) return <div className="gf-main" style={{ textAlign: 'center', padding: '3rem' }}>Loading students...</div>;

  return (
    <div className="gf-main">
      <button className="gf-btn-back" onClick={onBack}>&larr; Back to Group</button>

      <div className="gf-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Find Members</h2>
            <p>Available students looking for a group in {moduleId}</p>
          </div>

          {/* SEARCH BAR UI */}
          <div style={{ position: 'relative', width: '350px' }}>
            <span style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#94a3b8', // Subtle grey for the icon
              pointerEvents: 'none'
            }}>
              {/* Magnifying Glass Icon (Standard Unicode or SVG) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="gf-input"
              style={{
                paddingLeft: '50px',
                paddingRight: '20px',
                height: '50px',
                borderRadius: '25px', // Creates the pill shape
                backgroundColor: '#f1f5f9', // Light grey background
                border: 'none', // Flat design
                fontSize: '16px',
                color: '#475569',
                width: '100%',
                marginBottom: 0,
                outline: 'none',
                boxShadow: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
      </div>

      <div className="gf-grid">
        {filteredStudents.length === 0 ? (
          <div className="gf-card-simple" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              {searchTerm ? `No students found matching "${searchTerm}"` : "No available students found for this module."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredStudents.map(student => (
            <div
              key={student._id}
              className="gf-card-simple"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => onViewProfile({ ...student, isRosterView: true, targetGroupId: groupId })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  {student.photo ? <img src={student.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
                <div>
                  <strong style={{ display: 'block' }}>{student.name || 'Student Name'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {(student.skills || ['Student']).map(skill => (
                  <span
                    key={skill}
                    className="gf-skill-chip"
                    style={{
                      background: skill.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== ''
                        ? '#dbeafe' // Highlight matching skills
                        : '#f1f5f9'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleStudentsView;