const hre = require("hardhat");

async function main() {
    // Get the ContractFactory for the Crowdfunding contract
    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");

    // Deploy the contract
    const crowdfunding = await Crowdfunding.deploy();

    // Wait for the deployment transaction to be mined
    await crowdfunding.waitForDeployment();

    // Log the contract address
    console.log("Crowdfunding contract deployed to:", await crowdfunding.getAddress());
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

