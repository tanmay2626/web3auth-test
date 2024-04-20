import React, { useEffect, useState } from "react";
import TelegramLogin from "./Telegram";

// Declare the Telegram property on the Window object
declare global {
  interface Window {
    Telegram: any; // Adjust the type according to the structure of the Telegram object
  }
}

const tele = window.Telegram?.WebApp;
const App = () => {
  const [user, setUser] = useState<string | null>(null); // Specify the type of user state

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (tele) {
          await tele.ready();
          setUser(JSON.stringify(tele.initDataUnsafe.user));
        } else {
          console.error("Telegram WebApp API not available");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    };
    getUserData();
  }, [user]);

  return (
    <div>
      <p>Hello</p>
      {user && <p>{user}</p>}
    </div>
  );
};

export default App;
