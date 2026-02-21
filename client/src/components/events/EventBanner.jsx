import { useNavigate } from "react-router-dom";
import "./EventBanner.css";

const EventBanner = ({ large, id = "sample-event", image }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`event-banner ${large ? "large" : ""}`}
      onClick={() => navigate(`/event/${id}`)}
      style={{
        backgroundImage: `url(${image || "/images-d/design.jpg"})`
      }}
    >
    </div>
  );
};

export default EventBanner;