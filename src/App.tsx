import React, { useEffect, useState } from "react";
import TelegramLogin from "./Telegram";
import { Twitter } from "./Twitter";

// Declare the Telegram property on the Window object
declare global {
  interface Window {
    Telegram: any; // Adjust the type according to the structure of the Telegram object
  }
}

const tele = window.Telegram?.WebApp;
const App = () => {
  const [user, setUser] = useState<object | null>(null); // Specify the type of user state
  const [refer, setRefer] = useState<string | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      try {
        if (tele) {
          await tele.ready();
          setUser(tele.initDataUnsafe.user);
          setRefer(JSON.stringify(tele.initDataUnsafe.is_premium));
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
      <p>{refer && refer}</p>
    </div>
  );
};

export default App;
