import "./SidebarSection.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarSection = ({ title }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const items = Array(showAll ? 5 : 3).fill(0);

  return (
    <div className="sidebar-section">

      <h3 className="sidebar-title">{title}</h3>

      <div className="sidebar-items">

        {items.map((_, index) => (
          <div
            key={index}
            className="sidebar-event-card"
            onClick={() => navigate(`/event/top-event-${index}`)}
          >

            <div
              className="sidebar-card-banner"
              style={{
                backgroundImage: `url(/images/top${index + 1}.jpg)`
              }}
            />

          </div>
        ))}

      </div>

      <button
        className="sidebar-view-more"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Show less" : "More >"}
      </button>

    </div>
  );
};

export default SidebarSection;