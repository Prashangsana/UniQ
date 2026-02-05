import { useState } from 'react';
import GroupsDashboard from '../components/groups/GroupsDashboard';
import ModuleGroupsView from '../components/groups/ModuleGroupsView';
import GroupDetailsView from '../components/groups/GroupDetailsView';
import InviteDetailsView from '../components/groups/InviteDetailsView';
import UserProfileView from '../components/groups/UserProfileView';

const GroupsPage = () => {
  // State: 'dashboard', 'module', 'group', 'invite', 'profile'
  const [view, setView] = useState('dashboard');
  
  // Data States
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // History tracking to know where to go 'back' to
  const [previousView, setPreviousView] = useState('dashboard');

  // --- Handlers ---

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setPreviousView(view); // Remember if we came from group or dashboard
    setView('profile');
  };

  const handleGroupClick = (group, source) => {
    setSelectedGroup(group);
    setPreviousView(source === 'module' ? 'module' : 'dashboard');
    setView('group');
  };

  // --- Renders ---

  if (view === 'module') {
    return (
      <ModuleGroupsView
        module={selectedModule}
        onBack={() => setView('dashboard')}
        onSelectGroup={(group) => handleGroupClick(group, 'module')}
      />
    );
  }

  if (view === 'group') {
    return (
      <GroupDetailsView
        group={selectedGroup}
        onBack={() => setView(previousView)}
        onViewProfile={handleProfileClick}
      />
    );
  }

  if (view === 'invite') {
    return (
      <InviteDetailsView 
        invite={selectedInvite}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'profile') {
    return (
      <UserProfileView
        user={selectedUser}
        onBack={() => setView(previousView)}
      />
    );
  }

  // Default: Dashboard
  return (
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
  );
};

export default GroupsPage;