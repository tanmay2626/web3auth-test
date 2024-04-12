import { useEffect, useState } from "react";
// IMP START - Quick Start
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
  UX_MODE,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
// IMP END - Quick Start
import Web3 from "web3";

import "./App.css";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";

// IMP START - SDK Initialization
// IMP START - Dashboard Registration
const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  uiConfig: {
    mode: "dark",
    useLogoLoader: true,
    logoLight: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    logoDark: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    defaultLanguage: "en",
    theme: {
      primary: "#768729",
    },
  },
});

const openloginAdapter = new OpenloginAdapter();
web3auth.configureAdapter(openloginAdapter);
// IMP END - SDK Initialization

// Initialize MetaMask adapter
const metamaskAdapter = new MetamaskAdapter({
  clientId: clientId, // Use the same clientId for MetaMask adapter
  chainConfig: chainConfig, // This can be the same chainConfig used in other parts of your app
});

// Add Metamask Adapter

const coinbaseAdapter = new CoinbaseAdapter({
  clientId: clientId, // Use the same clientId for MetaMask adapter
  chainConfig: chainConfig, // This can be the same chainConfig used in other parts of your app
});

// Add Metamask Adapter
web3auth.configureAdapter(metamaskAdapter);
web3auth.configureAdapter(coinbaseAdapter);

function Social() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const Googlelogin = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );
    // IMP END - Login
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const Applelogin = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "apple",
      }
    );
    // IMP END - Login
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const metamaskLogin = async () => {
    try {
      // Use 'null' or '{}' as the second parameter if no additional options are needed
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.METAMASK,
        {}
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Login with MetaMask failed:", error);
    }
  };

  const coinbaseLogin = async () => {
    try {
      // Use 'null' or '{}' as the second parameter if no additional options are needed
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.COINBASE,
        {}
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Login with MetaMask failed:", error);
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        // Ensure only to initialize if not already connected
        if (!web3auth.connected) {
          await web3auth.init();
          setProvider(web3auth.provider);

          if (web3auth.connected) {
            setLoggedIn(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    // Cleanup function to potentially reset state or disconnect
    return () => {
      // Perform cleanup actions if needed
    };
  }, []); // Empty dependency array to ensure this runs once on mount

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <button onClick={Googlelogin} className="card">
        Google
      </button>
      <button onClick={Applelogin} className="card">
        Apple
      </button>
      <button onClick={metamaskLogin} className="card">
        Metamask
      </button>
      <button onClick={coinbaseLogin} className="card">
        Coinbase
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a
          target="_blank"
          href="https://web3auth.io/docs/sdk/pnp/web/no-modal"
          rel="noreferrer"
        >
          Web3Auth{" "}
        </a>
        & ReactJS (Webpack) Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/react-no-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
export default Social;
