const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const Superfluid_ABI = require("@superfluid-finance/js-sdk/src/abi");
const Web3 = require("web3");
const { ethers } = require("ethers");
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY;

const jsonRPCProvider = "https://goerli.infura.io/v3/bb60b569787f42429d12b4dd007bdd5b";
const web3 = new Web3(jsonRPCProvider);
const wallet = new ethers.Wallet(
  privateKey,
  new ethers.providers.JsonRpcProvider(jsonRPCProvider)
);

const sf = new SuperfluidSDK.Framework({
  web3,
});

async function initialize() {
  console.log('Initializing SuperFluid SDK');
  await sf.initialize();
};

async function startFlow(receiver) {
  console.log('Connecting to host contract');
  const contract = new ethers.Contract(
    "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9", // Host
    Superfluid_ABI.ISuperfluid,
    wallet
  );

  console.log('Create call to flow funds');
  const callData = sf.agreements.cfa.contract.methods
    .createFlow(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00", // fDAIx on goerli
      receiver, // address to flow to
      "1000000000000", // 2592 DAIx per month
      "0x" // data
    )
    .encodeABI();

  // send tx
  const receipt = await contract["callAgreement"](
    "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8", // CFAv1 address
    callData,
    "0x"
  );
  console.log(receipt);
}

async function stopFlow(receiver) {
  console.log('Connecting to host contract');
  const contract = new ethers.Contract(
    "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9", // Host
    Superfluid_ABI.ISuperfluid,
    wallet
  );

  console.log('Create call to stop funds flow');
  const callData = sf.agreements.cfa.contract.methods
    .deleteFlow(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00", // fDaix on goerli
      wallet.address, // address of the user starting the flow
      receiver, // address to stop flow
      "0x" // data
    )
    .encodeABI();

  // send tx
  const receipt = await contract["callAgreement"](
    "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8", // CFAv1 address
    callData,
    "0x"
  );

  console.log(receipt);
}

async function start() {
  await initialize();

  // startFlow("0x389d212B12618dbDF4B1Ff5c4317DB5E096f954E");
  stopFlow("0x389d212B12618dbDF4B1Ff5c4317DB5E096f954E");
}

start();