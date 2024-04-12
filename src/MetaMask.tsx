import React, { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  UX_MODE,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import Web3 from "web3";
import "./App.css";

const MetaMask = () => {
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // Initialize Web3Auth instance
    const initWeb3Auth = async () => {
      try {
        const web3AuthInstance = new Web3AuthNoModal({
          clientId: "Your_Client_ID",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth",
          },
        });

        // Configure the MetaMask adapter
        web3AuthInstance.configureAdapter(metamaskAdapter);

        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    initWeb3Auth();
  }, []);

  const loginWithMetamask = async () => {
    try {
      // Connect and authenticate using the MetaMask adapter
      await web3auth.connect();
      const web3Provider = await web3auth.getProvider();
      setProvider(new Web3(web3Provider));
      console.log("Authenticated with MetaMask");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={loginWithMetamask}>Login with MetaMask</button>
      {/* Display additional UI elements based on authentication status */}
    </div>
  );
};

export default MetaMask;
