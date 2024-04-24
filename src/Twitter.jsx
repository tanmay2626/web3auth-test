import React, { useEffect } from "react";
import { initializeApp } from "firebase/app"; // Importing Firebase initialization function
import {
  TwitterAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth"; // Importing necessary Firebase Auth services

const firebaseConfig = {
  apiKey: "AIzaSyAJ1mP-1RLsDuW2Falds6dv8-xn6Tz0F58",
  authDomain: "twitter-test-928f2.firebaseapp.com",
  projectId: "twitter-test-928f2",
  storageBucket: "twitter-test-928f2.appspot.com",
  messagingSenderId: "991790305360",
  appId: "1:991790305360:web:9366f1e1961746925e4155",
  measurementId: "G-DZY3QVS505",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const Twitter = () => {
  const provider = new TwitterAuthProvider();

  const handleLogin = () => {
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This gives you the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const secret = credential.secret;

          // The signed-in user info.
          const user = result.user;
          console.log(user);
          // Additional IdP data can be accessed if needed
          // const additionalUserInfo = getAdditionalUserInfo(result);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Authentication error:", error);
      });
  }, []);

  return (
    <div>
      <button onClick={handleLogin}>Connect with Twitter</button>
    </div>
  );
};
