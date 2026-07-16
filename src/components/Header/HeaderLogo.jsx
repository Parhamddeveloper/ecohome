import { Link } from "react-router-dom";

export default function HeaderLogo({image}) {
  return (
    <Link to="/">
      <img src={image} className="w-20" alt="Eco Home Header Logo" />
    </Link>
  );
}
