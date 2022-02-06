const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const Superfluid_ABI = require("@superfluid-finance/js-sdk/src/abi");
const Web3 = require("web3");
const { ethers } = require("ethers");
require('dotenv').config()

async function startFlow() {
  const privateKey = process.env.PRIVATE_KEY;

  const jsonRPCProvider = "https://matic-mumbai.chainstacklabs.com";

  // using web3js provider to connect to superfluid
  const web3 = new Web3(jsonRPCProvider);

  // using ethers wallet to start flow
  const wallet = new ethers.Wallet(
    privateKey,
    new ethers.providers.JsonRpcProvider(jsonRPCProvider)
  );

  // initialize superfluid SDK
  const sf = new SuperfluidSDK.Framework({
    web3,
  });
  await sf.initialize();

  // connect to Host contract
  // https://docs.superfluid.finance/superfluid/networks/networks#test-networks
  const contract = new ethers.Contract(
    "0xEB796bdb90fFA0f28255275e16936D25d3418603", // Host
    Superfluid_ABI.ISuperfluid,
    wallet
  );

  // create call data to flow funds
  const callData = sf.agreements.cfa.contract.methods
    .createFlow(
      "0x3aD736904E9e65189c3000c7DD2c8AC8bB7cD4e3", // MATICx on Mumbai
    //   "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f", // fDAIx on Mumbai
      "0x389d212B12618dbDF4B1Ff5c4317DB5E096f954E", // address to flow to
      "100000000", // 2592 DAIx per month
      "0x" // data
    )
    .encodeABI();

  // send tx
  const receipt = await contract["callAgreement"](
    "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873", // CFAv1 address
    callData,
    "0x"
  );

  /*
  {
    nonce: 41,
    gasPrice: BigNumber { _hex: '0x3b9aca07' },
    gasLimit: BigNumber { _hex: '0x03e10d' },
    to: '0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9',
    value: BigNumber { _hex: '0x00' },
    data: '0x39255d5b000000000000000000000000ed6bcbf6907d4feeee8a8875543249bea9d308e80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a462fc305e000000000000000000000000f2d68898557ccb2cf4c10c3ef2b034b2a69dad00000000000000000000000000da064b1cef52e19caff22ae2cc1a4e8873b8bab000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    chainId: 5,
    v: 46,
    r: '0xee8df070bddc5f43b76974413ac76aeffd3c16386843f11475974b492a2a153c',
    s: '0x38e19bd66f9b58a31651b8013c5236c5642012ecb2afd785520f23d4eea8bace',
    from: '0xdD4c825203f97984e7867F11eeCc813A036089D1',
    hash: '0x73d1b0467f928c03c9ebcc14167af7f153ff945bda24d8782bcfdb802b9696e7',
    wait: [Function (anonymous)]
  }
  */
  console.log(receipt);
}

startFlow();