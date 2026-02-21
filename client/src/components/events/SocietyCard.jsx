import "./SocietyCard.css";
import { Link } from "react-router-dom";

const SocietyCard = ({ name }) => {

  const urlName = name.replace(/\s+/g, "-").toLowerCase();

  return (
    <Link to={`/society/${urlName}`} className="society-card-link">

      <div className="society-card">

        <img
          src="/images-d/design.jpg"
          alt={name}
          className="society-logo"
        />

        <span>{name}</span>

      </div>

    </Link>
  );
};

export default SocietyCard;