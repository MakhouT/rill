const { Framework } = require("@superfluid-finance/sdk-core");
const Superfluid_ABI = require("@superfluid-finance/js-sdk/src/abi");
const Web3 = require("web3");
const { ethers } = require("ethers");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;

const jsonRPCProvider = "https://goerli.infura.io/v3/bb60b569787f42429d12b4dd007bdd5b";
const web3 = new Web3(jsonRPCProvider);
const wallet = new ethers.Wallet(
  privateKey,
  new ethers.providers.JsonRpcProvider(jsonRPCProvider)
);

const fDAIxGoerliAddress = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

let sf;
let signer;
async function initialize() {
  console.log('Initializing SuperFluid SDK');
   sf = await Framework.create({
    networkName: "goerli",
    provider: new ethers.providers.JsonRpcProvider(jsonRPCProvider),
  });
  
   signer = sf.createSigner({
    privateKey: privateKey,
    provider: new ethers.providers.JsonRpcProvider(jsonRPCProvider),
  });
};

async function startFlow(receiver) {
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: '1000000000000', // 2592 DAIx per month
      receiver,
      superToken: fDAIxGoerliAddress,
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
       View Your Stream At: https://app.superfluid.finance/dashboard/${receiver}
       Super Token: DAIx
      `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

async function stopFlow(receiver) {
  console.log('Connecting to host contract');
  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: wallet.address,
      receiver,
      superToken: fDAIxGoerliAddress,
    });

    console.log("Deleting your stream...");

    await deleteFlowOperation.exec(signer);

    console.log(
      `Congrats - you've just deleted your money stream!
       Network: Goerli
       Super Token: DAIx
       Sender: ${wallet.address}
       Receiver: ${receiver}
    `
    );
  } catch (error) {
    console.error(error);
  }
}

async function createIndex(){
  //id is a number randomly generated between 1 and a billion
  const id = Math.floor(Math.random() * 1000000000);
  console.log('id:', id);

  try {
    const createIndexOperation = sf.idaV1.createIndex({
      indexId: id,
      superToken: fDAIxGoerliAddress,
    });
    console.log(createIndexOperation);

    console.log("Creating your Index...");
    await createIndexOperation.exec(signer);
    console.log(
      `Congrats - you've just created a new Index!
       Network: Goerli
       Super Token: fDAIx
       Index ID: ${id}
    `
    );
  } catch (error) {
    console.error(error);
  }

}


async function start() {
  await initialize();

  // startFlow("0xF94C51949dECe1D5Abedd361DD0AedF6FCaC12C6");
  // stopFlow("0xF94C51949dECe1D5Abedd361DD0AedF6FCaC12C6");
  await createIndex();
}

start();

module.exports = {
  startFlow,
  stopFlow
};
