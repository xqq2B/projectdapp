const {ethers} = require('hardhat');

const main = async () => {
  const dappFactory = await ethers.getContractFactory('socialdappERC721');
  const dappContract = await dappFactory.deploy();

  await dappContract.deployed();

  console.log("Deployed SOCIALDAAP contract to: " + dappContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}


runMain();