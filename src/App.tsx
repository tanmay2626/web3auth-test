import React, { useEffect } from "react";

const App = () => {
  const referralCode = "AXIB";
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "mappatest_userBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "5");
    script.setAttribute("data-userpic", "false");
    script.setAttribute(
      "data-auth-url",
      `https://t.me/mappatest_userBot/Test?startapp=${referralCode}`
    );
    script.setAttribute("data-request-access", "write");

    document.body.appendChild(script);

    // Cleanup the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="App">Hello</div>;
};

export default App;
