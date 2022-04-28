import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [username, setUsername] = React.useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="home-container">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        className="text-input-field"
      />
      <Link to={`/user/${username}`} className="enter-room-button">
        enter
      </Link>
      {JSON.stringify(process.env)}
    </div>
  );
};

export default Home;
