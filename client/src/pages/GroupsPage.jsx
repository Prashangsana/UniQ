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

const GroupsPage = ({ userRole, initialSelectedGroup = null, onClearSelection = () => {} }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState('dashboard');
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [originView, setOriginView] = useState('dashboard');
  const [profileReturnView, setProfileReturnView] = useState('dashboard');

  const [rosterModuleId, setRosterModuleId] = useState(null);
  const [rosterGroupId, setRosterGroupId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser({
              ...data.user,
              _id: data.user._id || data.user.id,
              role: data.user.role
            });
          }
        } else {
          console.warn("User not authenticated");
        }
      } catch (err) {
        console.error("Auth error", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchProfile();
  }, [API_URL]);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

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
    console.log("Selected Module:", module);
    setSelectedModule(module);
    setView('create-group');
  };

  const handleFinalisationSubmit = async (groupId, data) => {
    try {
      const response = await fetch(`${API_URL}/api/lecturer/groups/${groupId}/submit-finalisation`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully submitted for review!`);
        setSelectedGroup(result.data); 
        setView('group'); 
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert("Failed to submit finalisation.");
    } 
  };

  if (userRole === 'lecturer') {
    return (
      <div style={{ position: 'relative' }}>
        <LecturerDashboard />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {view === 'module' && (
        <ModuleGroupsView
          module={selectedModule}
          currentUser={currentUser}
          onBack={() => setView('dashboard')}
          onSelectGroup={(group) => handleGroupClick(group, 'module')}
          onCreateGroup={() => handleCreateGroupClick(selectedModule)}
          onViewProfile={handleProfileClick}
          onSelectInvite={(invite) => {
            setSelectedInvite(invite);
            setView('invite');
          }}
        />
      )}

      {view === 'group' && (
        <GroupDetailsView
          group={selectedGroup}
          currentUser={currentUser}
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
          onSuccess={() => {
            setView('module');
            setSelectedModule({...selectedModule}); 
          }} 
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

      {view === 'dashboard' && (
        <GroupsDashboard
          onSelectModule={(m) => {
            if (!m) return;
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