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
const openloginAdapter = new OpenloginAdapter();
web3auth.configureAdapter(openloginAdapter);

const metamaskAdapter = new MetamaskAdapter({
  clientId: clientId,
  chainConfig: chainConfig,
});

const defaultWcSettings = getWalletConnectV2Settings(
  "eip155",
  ["1"],
  "04309ed1007e77d1f119b85205bb779d"
);
const walletConnectModal = new WalletConnectModal({
  projectId: "04309ed1007e77d1f119b85205bb779d",
});
const walletConnectV2Adapter = new WalletConnectV2Adapter({
  adapterSettings: {
    qrcodeModal: walletConnectModal,
  },
});

web3auth.configureAdapter(walletConnectV2Adapter);

const coinbaseAdapter = new CoinbaseAdapter({
  clientId: clientId,
  chainConfig: chainConfig,
});

web3auth.configureAdapter(metamaskAdapter);
web3auth.configureAdapter(coinbaseAdapter);

const Auth = () => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(false); // Track if a connection is in progress

  const connectToProvider = async (adapter: any, options: any) => {
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

  const Googlelogin = () =>
    connectToProvider(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "google" });

  const Applelogin = () =>
    connectToProvider(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "apple" });

  const Twitterlogin = () =>
    connectToProvider(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "twitter" });

  // Metamask
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

  const walletConnectLogin = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.WALLET_CONNECT_V2,
        {
          loginProvider: "walletconnect",
        }
      );
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Login with WalletConnect failed:", error);
    }
  };

  // Coinbase
  const coinbaseLogin = async () => {
    try {
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
    const web3 = new Web3(provider as any);
    try {
      const addresses = await web3.eth.getAccounts();
      if (addresses.length > 0) {
        console.log("Wallet Address:", addresses[0]);
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
        setInitError(error as Error);
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
            <button onClick={Googlelogin} className="card">
              Google
            </button>
            <button onClick={Applelogin} className="card">
              Apple
            </button>
            <button onClick={Twitterlogin} className="card">
              Twitter
            </button>
            <button onClick={metamaskLogin} className="card">
              Metamask
            </button>
            <button onClick={coinbaseLogin} className="card">
              Coinbase
            </button>
            <button onClick={walletConnectLogin} className="card">
              WalletConnect
            </button>
          </div>
        )
      ) : (
        <div>
          <button onClick={handleLogout} className="card">
            Logout
          </button>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
      )}
    </>
  );
};

export default Auth;
