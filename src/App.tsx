import React, { useEffect } from "react";

const App = () => {
  const referralCode = "AXIB";
  useEffect(() => {
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

    // Callback function when script is loaded
    const handleScriptLoad = () => {
      console.log("Telegram script loaded successfully!");
      // Add any additional logic you need here
    };

    script.addEventListener("load", handleScriptLoad);

    document.body.appendChild(script);

    // Cleanup the script when component unmounts
    return () => {
      script.removeEventListener("load", handleScriptLoad);
      document.body.removeChild(script);
    };
  }, []);

  return <div className="App">Hello</div>;
};

export default App;
