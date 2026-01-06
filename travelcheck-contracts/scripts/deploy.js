const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TravelCheck contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy TCK Token
  console.log("Deploying TravelCheck Token...");
  const TravelCheckToken = await ethers.getContractFactory("TravelCheckToken");
  const tckToken = await TravelCheckToken.deploy(deployer.address);
  await tckToken.waitForDeployment();
  console.log("✅ TCK Token deployed to:", await tckToken.getAddress());

  // Deploy Staking Contract
  console.log("\nDeploying Staking Contract...");
  const TravelCheckStaking = await ethers.getContractFactory("TravelCheckStaking");
  const staking = await TravelCheckStaking.deploy(
    await tckToken.getAddress(),
    deployer.address
  );
  await staking.waitForDeployment();
  console.log("✅ Staking Contract deployed to:", await staking.getAddress());

  // Deploy Badge NFT Contract
  console.log("\nDeploying Badge NFT Contract...");
  const TravelCheckBadge = await ethers.getContractFactory("TravelCheckBadge");
  const badge = await TravelCheckBadge.deploy(deployer.address);
  await badge.waitForDeployment();
  console.log("✅ Badge NFT Contract deployed to:", await badge.getAddress());

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  console.log("TCK Token:          ", await tckToken.getAddress());
  console.log("Staking Contract:   ", await staking.getAddress());
  console.log("Badge NFT Contract: ", await badge.getAddress());
  console.log("=".repeat(60) + "\n");

  // Save deployment addresses
  const addresses = {
    tckToken: await tckToken.getAddress(),
    staking: await staking.getAddress(),
    badge: await badge.getAddress(),
  };

  console.log("Deployment addresses:");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
