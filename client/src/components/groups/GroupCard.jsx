import './groups.css';

const GroupCard = ({ group, onClick, showJoin }) => (
  <div
    onClick={onClick}
    style={{
      background: 'white',
      padding: '1rem',
      borderRadius: '1rem',
      cursor: 'pointer',
      minWidth: '180px'
    }}
  >
    <h4>{group.id}</h4>
    <p>{group.domain}</p>
    <p>{group.members}/{group.maxMembers} members</p>
    {showJoin && !group.joined && <span>Join Group</span>}
  </div>
);

export default GroupCard;
