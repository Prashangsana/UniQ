const ModuleCard = ({ module, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--card-bg-gray)',
      padding: '1.2rem',
      borderRadius: '1rem',
      cursor: 'pointer'
    }}
  >
    <h4>{module.name}</h4>
  </div>
);

export default ModuleCard;
