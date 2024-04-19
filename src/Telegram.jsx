import React, { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    // Load Telegram JavaScript SDK asynchronously
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    document.body.appendChild(script);

    // Define the onTelegramAuth function
    window.onTelegramAuth = (user) => {
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
    };

    return () => {
      // Clean up: Remove the script when component unmounts
      document.body.removeChild(script);
      delete window.onTelegramAuth;
    };
  }, []);

  return (
    <div>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="mappatest_userBot"
        data-size="large"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
      ></script>
    </div>
  );
};

export default TelegramLogin;
