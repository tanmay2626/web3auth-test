import React from "react";
import { TwitterAuthProvider } from "firebase/auth";

export const Twitter = () => {
  const provider = new TwitterAuthProvider();

  return <div>Twitter</div>;
};
