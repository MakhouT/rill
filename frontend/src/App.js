import './App.css';
import { Web3Auth } from "@web3auth/web3auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, CustomChainConfig, CONNECTED_EVENT_DATA } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui"
import { useEffect, useState } from 'react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function RillApp() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const subscribeAuthEvents = (web3auth) => {
    console.log('subscribeAuthEvents ', subscribed);

    if (subscribed) {
      return;
    }
    web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("Yeah!, you are successfully logged in", data);
      setUser(data);
    });
    
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });

    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
      setUser(null);
    });

    web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      console.log("some error or user have cancelled login request", error);
    });

    web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
      console.log("modal visibility", isVisible);
    });

    setSubscribed(true);
  };
  
  const polygonMumbaiConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai-explorer.matic.today",
    chainId: "0x13881",
    displayName: "Polygon Mumbai Testnet",
    ticker: "matic",
    tickerName: "matic",
  };

  const web3auth = new Web3Auth({
    chainConfig: polygonMumbaiConfig,
    clientId: "BKPxkCtfC9gZ5dj-eg-W6yb5Xfr3XkxHuGZl2o2Bn8gKQ7UYike9Dh6c-_LaXlUN77x0cBoPwcSx-IVm0llVsLA"
  });

  // ⭐️ initialize modal on page mount.
  const initializeModal = async () => {
    console.log('initializeModal');
    subscribeAuthEvents(web3auth)
    await web3auth.initModal();
    setLoaded(true)
  }
  
  useEffect(() => {
    console.log('useEffect');
    initializeModal();
  }, []);

  const login = async () => {
    const provider = await web3auth.connect();
  }
  const logout = async () => {
    const provider = await web3auth.logout();
  }
  const getUserInfo = async () => {
    const userInfo = await web3auth.getUserInfo();
    console.log(userInfo);
  }

  return (
    loaded && user ? <Dashboard logout={logout} getUserInfo={getUserInfo} /> : <Login login={login} initializeModal={initializeModal} />
  );
}

export default RillApp;
