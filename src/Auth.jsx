import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const UsernameComponent = () => {
  const [username, setUsername] = useState("");
  const [isCookieSet, setIsCookieSet] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsCookieSet(true);
    }
  }, []);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    Cookies.set("username", username, { expires: 7 }); // Cookie expires in 7 days
    setIsCookieSet(true);
  };

  return (
    <div>
      {isCookieSet ? (
        <div>
          <p>Welcome back, {username}!</p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label>
            Enter your name:
            <input type="text" value={username} onChange={handleInputChange} />
          </label>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default UsernameComponent;
