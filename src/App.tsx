import React, { useEffect } from "react";

const App = () => {
  const referralCode = "AXIB";
  useEffect(() => {
    // Define the callback function on the global scope
    window.onTelegramAuth = function (user) {
      alert(
        "Logged in as " +
          user.first_name +
          " " +
          user.last_name +
          " (" +
          user.id +
          (user.username ? ", @" + user.username : "") +
          ")"
      );
      // Add any additional logic you need here
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "mappatest_userBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "5");
    script.setAttribute("data-userpic", "false");
    script.setAttribute(
      "data-auth-url",
      `https://t.me/mappatest_userBot/App?startapp=${referralCode}`
    );
    script.setAttribute("data-request-access", "write");

    document.body.appendChild(script);

    // Cleanup the script and callback when component unmounts
    return () => {
      delete window?.onTelegramAuth; // Remove the callback from the global scope
      document.body.removeChild(script);
    };
  }, []);

  return <div className="App">Hello</div>;
};

export default App;
