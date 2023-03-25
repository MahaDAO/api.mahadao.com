const Web3 = require("web3");
const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const abi = require("./abi/ERC20.json");
const cache = new NodeCache();

const addressToCheckBal = ["0xFdf0d51ddD34102472D7130c3d4831BC77386e78"];

const tokenAddress = "0x745407c86df8db893011912d3ab28e68b62e49b0";
const url = process.env.RPC_URL;

const getTotalSupply = async () => {
  const web3 = new Web3(url);
  const token = new web3.eth.Contract(abi, tokenAddress);

  const totalSupply = web3.utils.fromWei(
    await token.methods.totalSupply().call(),
    "ether"
  );

  return Number(totalSupply);
};

const getCirculatingSupply = async () => {
  const web3 = new Web3(url);
  const token = new web3.eth.Contract(abi, tokenAddress);

  const totalSupply = await getTotalSupply();

  let totalBalance = 0;
  for (let i = 0; i < addressToCheckBal.length; i++) {
    const balanceFrom = web3.utils.fromWei(
      await token.methods.balanceOf(`${addressToCheckBal[i]}`).call(),
      "ether"
    );

    totalBalance += Number(balanceFrom);
  }

  return totalSupply - totalBalance;
};

const getMAHAINRPrice = async () => {
  const api = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=mahadao&vs_currencies=inr"
  );
  const json = await api.json();
  return Math.floor(json.mahadao.inr);
};

const circulatingSupply = async (_req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200);

  if (cache.get("c-supply")) {
    res.send(cache.get("c-supply"));
  } else {
    const supply = await getCirculatingSupply();
    cache.set("c-supply", supply.toString(), 5);
    res.send(supply.toString());
  }
};

const totalSupply = async (_req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200);

  if (cache.get("c-supply")) {
    res.send(cache.get("t-supply"));
  } else {
    const supply = await getTotalSupply();
    cache.set("t-supply", supply.toString(), 5);
    res.send(supply.toString());
  }
};

const mahaInrPrice = async (_req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200);

  if (cache.get("maha-inr")) {
    res.send(cache.get("maha-inr"));
  } else {
    const supply = await getMAHAINRPrice();
    cache.set("maha-inr", supply.toString(), 60);
    res.send(supply.toString());
  }
};

module.exports = {
  circulatingSupply,
  totalSupply,
  mahaInrPrice,
};
