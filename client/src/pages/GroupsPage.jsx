import { useState, useEffect } from 'react';
import GroupsDashboard from '../components/groups/GroupsDashboard';
import ModuleGroupsView from '../components/groups/ModuleGroupsView';
import GroupDetailsView from '../components/groups/GroupDetailsView';
import InviteDetailsView from '../components/groups/InviteDetailsView';
import UserProfileView from '../components/groups/UserProfileView';
import CreateGroupView from '../components/groups/CreateGroupView';
import ModuleStudentsView from '../components/groups/ModuleStudentsView';
import LecturerDashboard from '../components/groups/LecturerDashboard';
import FinalisationFormView from '../components/groups/FinalisationFormView';

const GroupsPage = () => {
  // --- ROLE STATE ---
  // Defaulting to 'student'. In the future, you will fetch this from your auth context/backend!
  const [userRole, setUserRole] = useState('student'); 

  // State: 'dashboard', 'module', 'group', 'invite', 'profile'
  const [view, setView] = useState('dashboard');
  
  // Data States
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // This tracks where to return to when closing GroupDetails (Module or Dashboard)
  const [originView, setOriginView] = useState('dashboard');
  // This tracks where to return to when closing a Profile (Group or Dashboard)
  const [profileReturnView, setProfileReturnView] = useState('dashboard');

  const [rosterModuleId, setRosterModuleId] = useState(null);
  const [rosterGroupId, setRosterGroupId] = useState(null);

  // --- Handlers ---
  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setProfileReturnView(view);
    setView('profile');
  };

  const handleFindMembers = (moduleId, groupId) => {
    setRosterModuleId(moduleId);
    setRosterGroupId(groupId);
    setView('module-students');
  };

  const handleGroupClick = (group, source) => {
    setSelectedGroup(group);
    setOriginView(source === 'module' ? 'module' : 'dashboard');
    setView('group');
  };

  const handleCreateGroupClick = (module) => {
    setSelectedModule(module);
    setView('create-group');
  };

  const handleFinalisationSubmit = async (groupId, data) => {
  try {
      // Send the form data to the backend
      const response = await fetch(`http://localhost:5000/api/lecturer/groups/${groupId}/submit-finalisation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully submitted to lecturer as ${data.selectedPrefix}!`);
        // Update the local state so the UI changes to pending immediately
        setSelectedGroup(result.data); 
        setView('group'); 
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert("Failed to submit finalisation. Is the server running?");
    } 
};

  // --- LECTURER VIEW OVERRIDE ---
  if (userRole === 'lecturer') {
    return (
      <div style={{ position: 'relative' }}>
        {/* DEV TOGGLE: Remove this button later when real Auth is connected */}
        <button 
          onClick={() => setUserRole('student')} 
          style={{ position: 'absolute', top: '10px', right: '10px', background: '#334155', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', zIndex: 100 }}
        >
          Switch to Student View
        </button>

        <LecturerDashboard />
      </div>
    );
  }

  // --- STUDENT VIEWS ---
  return (
    <div style={{ position: 'relative' }}>
      {/* DEV TOGGLE: Remove this button later when real Auth is connected */}
      <button 
        onClick={() => setUserRole('lecturer')} 
        style={{ position: 'absolute', top: '10px', right: '10px', background: '#334155', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', zIndex: 100 }}
      >
        Switch to Lecturer View
      </button>

      {view === 'module' && (
        <ModuleGroupsView
          module={selectedModule}
          onBack={() => setView('dashboard')}
          onSelectGroup={(group) => handleGroupClick(group, 'module')}
          onCreateGroup={() => handleCreateGroupClick(selectedModule)}
        />
      )}

      {view === 'group' && (
        <GroupDetailsView
          group={selectedGroup}
          onBack={() => setView(originView)}
          onViewProfile={handleProfileClick}
          onFindMembers={handleFindMembers}
          onFinalise={() => setView('finalise')}
        />
      )}

      {view === 'module-students' && (
        <ModuleStudentsView
          moduleId={rosterModuleId}
          groupId={rosterGroupId}
          onBack={() => setView('group')}
          onViewProfile={handleProfileClick}
        />
      )}

      {view === 'create-group' && (
        <CreateGroupView 
          module={selectedModule} 
          onBack={() => setView('module')} 
        />
      )}

      {view === 'invite' && (
        <InviteDetailsView 
          invite={selectedInvite}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'profile' && (
        <UserProfileView
          user={selectedUser}
          onBack={() => setView(profileReturnView)}
        />
      )}

      {view === 'finalise' && (
        <FinalisationFormView
          group={selectedGroup}
          onBack={() => setView('group')}
          onSubmit={handleFinalisationSubmit}
        />
      )}

      {/* Default View: Dashboard */}
      {view === 'dashboard' && (
        <GroupsDashboard
          onSelectModule={(m) => {
            setSelectedModule(m);
            setView('module');
          }}
          onSelectGroup={(g) => handleGroupClick(g, 'dashboard')}
          onSelectInvite={(invite) => {
            setSelectedInvite(invite);
            setView('invite');
          }}
        />
      )}
    </div>
  );
};

export default GroupsPage;