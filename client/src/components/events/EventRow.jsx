import "./EventRow.css";
import { useState } from "react";
import EventBanner from "./EventBanner";

const EventRow = ({ title, addedEvents = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const isMyEventsRow = title === "My events";

  const getDisplayItems = () => {
    if (isMyEventsRow) {
      return showAll ? addedEvents : addedEvents.slice(0, 3);
    }
    return Array(showAll ? 6 : 3).fill(0);
  };

  const displayItems = getDisplayItems();

  return (
    <section className="event-row">

      <div className="row-header">
        <h2>{title}</h2>

        {(isMyEventsRow ? addedEvents.length > 3 : true) && (
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "More >"}
          </button>
        )}
      </div>

      <div className="row-content">

        {isMyEventsRow && addedEvents.length === 0 ? (
          <div className="empty-state">
            <p>No events added to your schedule yet.</p>
          </div>
        ) : (
          displayItems.map((item, index) => (
            <EventBanner
              key={index}
              id={isMyEventsRow ? item : `recommended-${index}`}
              image={`/images-d/${['design.jpg', 'gd.jpg', 'ml.jpg', 'robotics.jpg'][index % 4]}`}
            />
          ))
        )}

      </div>

    </section>
  );
};

export default EventRow;