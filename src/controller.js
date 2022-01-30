const Web3 = require('web3');
const abi = require('./abi/ERC20.json');
const NodeCache = require('node-cache');
const cache = new NodeCache();


const addressToCheckBal = [
  '0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC',
  '0xff3731bd6f44e49831eacc30388506e6bce4f49e',
  '0x047c4077fa9620a3ca0e2a010ba2012dc13ec07d'
];

const tokenAddress = '0xb4d930279552397bba2ee473229f89ec245bc365';
const url = process.env.RPC_URL;

const getTotalSupply = async () => {
  const web3 = new Web3(url);
  const token = new web3.eth.Contract(abi, tokenAddress);

  const totalSupply = web3.utils.fromWei(
    await token.methods.totalSupply().call(),
    'ether'
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
      'ether'
    );

    totalBalance += Number(balanceFrom);
  }

  return totalSupply - totalBalance;
};

const circulatingSupply = async (_req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200);

  if (cache.get('c-supply')) {
    res.send(cache.get('c-supply'));
  } else {
    const supply = await getCirculatingSupply();
    cache.set('c-supply', supply.toString(), 5);
    res.send(supply.toString());
  }
};

const totalSupply = async (_req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200);

  if (cache.get('c-supply')) {
    res.send(cache.get('t-supply'));
  } else {
    const supply = await getTotalSupply();
    cache.set('t-supply', supply.toString(), 5);
    res.send(supply.toString());
  }
};

module.exports = {
  circulatingSupply,
  totalSupply
};
