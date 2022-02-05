import logo from './logo.svg';
import './App.css';
// import { Web3Auth } from "@web3auth/web3auth";
// import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

// const polygonMumbaiConfig: CustomChainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   rpcTarget: "https://rpc-mumbai.maticvigil.com",
//   blockExplorer: "https://mumbai-explorer.matic.today",
//   chainId: "0x13881",
//   displayName: "Polygon Mumbai Testnet",
//   ticker: "matic",
//   tickerName: "matic",
// };

// const web3auth = new Web3Auth({
//     chainConfig: polygonMumbaiConfig,
//     clientId: "BKPxkCtfC9gZ5dj-eg-W6yb5Xfr3XkxHuGZl2o2Bn8gKQ7UYike9Dh6c-_LaXlUN77x0cBoPwcSx-IVm0llVsLA"
// });



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          // onClick={async () => {
          //   const provider = await web3auth.connect();
          // }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
