import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import Web3 from "web3";

import "./App.css";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";

const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

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

const metamaskAdapter = new MetamaskAdapter({
  clientId: clientId,
  chainConfig: chainConfig,
});

const coinbaseAdapter = new CoinbaseAdapter({
  clientId: clientId,
  chainConfig: chainConfig,
});

web3auth.configureAdapter(metamaskAdapter);
web3auth.configureAdapter(coinbaseAdapter);

function Social() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  const Googlelogin = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "google",
        }
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error: any) {
      if (error.message.includes("Failed to connect with wallet")) {
        console.log("Login popup window was closed. Please try again.");
        window.location.reload();
      } else {
        console.log("An error occurred during login:", error);
        console.error("Login error:", error);
      }
    }
  };

  const Applelogin = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "apple",
        }
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error: any) {
      if (error.message.includes("Failed to connect with wallet")) {
        console.log("Login popup window was closed. Please try again.");
        window.location.reload();
      } else {
        console.log("An error occurred during login:", error);
        console.error("Login error:", error);
      }
    }
  };

  const metamaskLogin = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.METAMASK,
        {}
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Login with MetaMask failed:", error);
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
      console.log("Login with Coinbase failed:", error);
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
          }
        }
      } catch (error) {
        setInitError(error as Error);
        console.log("Web3Auth initialization failed:", error);
      }
    };

    init();

    return () => {};
  }, []); // Empty dependency array to ensure this runs once on mount

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    console.log(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setProvider(null);
    setLoggedIn(false);
    console.log("logged out");
  };

  // IMP START - Blockchain Calls
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address),
      "ether"
    );
    console.log(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "Message";

    try {
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        "test password!"
      );
      console.log(signedMessage);
    } catch (error: Error | any) {
      if (error.code === 4001) {
        console.log("User rejected signing the message");
      } else {
        console.log("Error signing message:", error);
        console.error("Error signing message:", error);
      }
    }
  };

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

      {initError ? (
        <div>
          <p>Error initializing Web3AuthNoModal:</p>
          <pre>{initError.message}</pre>
        </div>
      ) : (
        <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      )}

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
