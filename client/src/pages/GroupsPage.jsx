import { useState } from 'react';
import GroupsDashboard from '../components/groups/GroupsDashboard';
import ModuleGroupsView from '../components/groups/ModuleGroupsView';
import GroupDetailsView from '../components/groups/GroupDetailsView';
import InviteDetailsView from '../components/groups/InviteDetailsView';
import UserProfileView from '../components/groups/UserProfileView';
import CreateGroupView from '../components/groups/CreateGroupView';

const GroupsPage = () => {
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

  // --- Handlers ---

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setProfileReturnView(view); // Saves if we came from 'group' or 'dashboard'
    setView('profile');
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

  // --- Renders ---

  if (view === 'module') {
    return (
      <ModuleGroupsView
        module={selectedModule}
        onBack={() => setView('dashboard')}
        onSelectGroup={(group) => handleGroupClick(group, 'module')}
        onCreateGroup={() => handleCreateGroupClick(selectedModule)}
      />
    );
  }

  if (view === 'group') {
    return (
      <GroupDetailsView
        group={selectedGroup}
        onBack={() => setView(originView)}
        onViewProfile={handleProfileClick}
      />
    );
  }

  if (view === 'create-group') {
    return (
      <CreateGroupView 
        module={selectedModule} 
        onBack={() => setView('module')} 
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
        onBack={() => setView(profileReturnView)}
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