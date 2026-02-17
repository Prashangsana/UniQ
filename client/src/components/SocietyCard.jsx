import "./SocietyCard.css";
import { Link } from "react-router-dom";

const SocietyCard = ({ name }) => {

  const urlName = name.replace(/\s+/g, "-").toLowerCase();

  return (
    <Link to={`/society/${urlName}`} className="society-card-link">

      <div className="society-card">

        <img
          src={`/images/${urlName}.png`}
          alt={name}
          className="society-logo"
          onError={(e) => {
            e.target.src = "/images/default.jpg";
          }}
        />

        <span>{name}</span>

      </div>

    </Link>
  );
};

export default SocietyCard;