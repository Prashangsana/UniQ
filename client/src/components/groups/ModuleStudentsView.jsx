import React, { useState, useEffect } from 'react';
import './groups.css';

const ModuleStudentsView = ({ moduleId, groupId, onBack, onViewProfile }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // NOTE: Ensure your backend has this route to fetch available students
        const response = await fetch(`http://localhost:5000/api/modules/${moduleId}/available-students`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setStudents(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch available students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchStudents();
  }, [moduleId]);

  if (loading) return <div className="gf-main" style={{textAlign: 'center', padding: '3rem'}}>Loading students...</div>;

  return (
    <div className="gf-main">
      <button className="gf-btn-back" onClick={onBack}>&larr; Back to Group</button>

      <div className="gf-header">
        <h2>Find Members</h2>
        <p>Available students looking for a group in {moduleId}</p>
      </div>

      <div className="gf-grid">
        {students.length === 0 ? (
          <div className="gf-card-simple" style={{textAlign: 'center', gridColumn: '1 / -1'}}>
            <p style={{color: '#64748b'}}>No available students found for this module.</p>
          </div>
        ) : (
          students.map(student => (
            <div 
              key={student._id} 
              className="gf-card-simple"
              // Package the student data with flags for the Profile view to handle the invite
              onClick={() => onViewProfile({ ...student, isRosterView: true, targetGroupId: groupId })}
            >
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#cbd5e1'}}></div>
                <div>
                  <strong style={{display:'block'}}>{student.name || 'Student Name'}</strong>
                </div>
              </div>
              <div>
                {(student.skills || ['Student']).map(skill => (
                  <span key={skill} className="gf-skill-chip">{skill}</span>
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