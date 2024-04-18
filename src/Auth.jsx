import React, { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import {
  getWalletConnectV2Settings,
  WalletConnectV2Adapter,
} from "@web3auth/wallet-connect-v2-adapter";
import Web3 from "web3";
import "./App.css";

// configure Web3Auth
const clientId =
  "BK2GYJCmhk8oOqyjBH6ZQvG7Wl0bW-DBkxmnKYsmoLu8Bm2tMTTMvgFQlcI_gw26MF6x2AlJvRbb0Us3kMjZ0Cc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xA",
  rpcTarget: "https://rpc.ankr.com/optimism",
  displayName: "Optimism Mainnet",
  blockExplorerUrl: "https://optimistic.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    mode: "dark",
    useLogoLoader: true,
    logoLight:
      "https://github.com/tanmay2626/react-realestate/blob/master/primary-light-removebg-preview.png?raw=true",
    logoDark:
      "https://github.com/tanmay2626/react-realestate/blob/master/primary-light-removebg-preview.png?raw=true",
    defaultLanguage: "en",
    theme: {
      primary: "#768729",
    },
  },
});

// setup adapters
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
  },
});
web3auth.configureAdapter(openloginAdapter);

const Auth = () => {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [initError, setInitError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [waddress, setWAddress] = useState(null);

  const connectToProvider = async (adapter, options) => {
    if (isConnecting) {
      console.log("Connection already in progress. Please wait.");
      return;
    }

    setIsConnecting(true);
    try {
      const web3authProvider = await web3auth.connectTo(adapter, options);
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
        getAccounts();
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const Twitterlogin = () =>
    connectToProvider(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "twitter" });

  const handleLogout = async () => {
    await web3auth.logout();

    setProvider(null);
    setLoggedIn(false);
    console.log("logged out");
  };

  // get wallet address
  const getAccounts = async () => {
    if (!provider) {
      console.log("Provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider);
    try {
      const addresses = await web3.eth.getAccounts();
      if (addresses.length > 0) {
        console.log("Wallet Address:", addresses[0]);
        setWAddress(addresses[0]);
      } else {
        console.log("No wallet addresses found.");
      }
    } catch (error) {
      console.error("Error fetching wallet addresses:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!web3auth.connected) {
          await web3auth.init();
          setProvider(web3auth.provider);

          if (web3auth.connected) {
            setLoggedIn(true);
            getAccounts();
          }
        }
      } catch (error) {
        setInitError(error);
        console.log("Web3Auth initialization failed:", error);
      }
    };

    init();

    return () => {};
  }, []);

  return (
    <>
      {!loggedIn ? (
        isConnecting ? (
          <span>Please Wait</span>
        ) : (
          <div className="flex-container">
            <button onClick={Twitterlogin} className="card">
              Twitter
            </button>
          </div>
        )
      ) : (
        <div>
          <button onClick={handleLogout} className="card">
            Logout
          </button>
          <button onClick={getAccounts} className="card">
            Get Wallet Address
          </button>
          <p>{waddress ? waddress : ""}</p>
        </div>
      )}
    </>
  );
};

export default Auth;
