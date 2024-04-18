// import React, { useEffect } from "react";

// const App = () => {
//   const referralCode = "AXIB";
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "7189523771:AAEoK67HKH1UjZWQM3sTfTSCoXgbcF05_0";
//     script.async = true;
//     script.setAttribute("data-telegram-login", "mappatest_userBot");
//     script.setAttribute("data-size", "large");
//     script.setAttribute("data-radius", "5");
//     script.setAttribute("data-userpic", "false");
//     script.setAttribute(
//       "data-auth-url",
//       `https://t.me/mappatest_userBot/App?startapp=${referralCode}`
//     );
//     script.setAttribute("data-request-access", "write");

//     document.body.appendChild(script);

//     // Cleanup the script when component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return <div className="App">Hello</div>;
// };

// export default App;

import React from "react";

import Auth from "./Auth";

const App = () => {
  return (
    <div>
      <Auth />
    </div>
  );
};

export default App;
