const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistry.deploy();

  await certificateRegistry.waitForDeployment();

  const address = await certificateRegistry.getAddress();

  console.log(`CertificateRegistry deployed to: ${address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${(await hre.ethers.getSigners())[0].address}`);

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await certificateRegistry.deploymentTransaction().wait(6);

    console.log("Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Output deployment info
  console.log("\n=================================");
  console.log("Deployment Summary");
  console.log("=================================");
  console.log(`Contract Address: ${address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}`);
  console.log("=================================\n");

  console.log("Save this address to your .env file:");
  console.log(`NEXT_PUBLIC_${hre.network.name.toUpperCase()}_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
