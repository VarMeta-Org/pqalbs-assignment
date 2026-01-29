import { ethers, network, run } from "hardhat";

async function main() {
	console.log("Starting SimpleLending deployment to network:", network.name);

	const [deployer] = await ethers.getSigners();
	console.log("Deploying contracts with the account:", deployer.address);

	const testTokenAddress = process.env.TEST_TOKEN_ADDRESS;
	if (!testTokenAddress) {
		throw new Error("TEST_TOKEN_ADDRESS environment variable is not set");
	}

	// Deploy SimpleLending
	console.log("Deploying SimpleLending...");
	console.log(`Using TestToken address: ${testTokenAddress}`);

	const SimpleLending = await ethers.getContractFactory("SimpleLending");
	const simpleLending = await SimpleLending.deploy(testTokenAddress);
	await simpleLending.waitForDeployment();
	const simpleLendingAddress = await simpleLending.getAddress();
	console.log(`SimpleLending deployed to: ${simpleLendingAddress}`);

	console.log("\nDeployment completed!");
	console.log("----------------------------------");
	console.log(`SimpleLending: ${simpleLendingAddress}`);
	console.log("----------------------------------");

	// Verify contracts if on a live network
	if (network.name !== "hardhat" && network.name !== "localhost") {
		console.log("Waiting for block confirmations before verification...");
		// Wait for 6 blocks to ensure Etherscan has indexed the deployment
		const lendingTx = simpleLending.deploymentTransaction();
		if (lendingTx) {
			await lendingTx.wait(6);
		}

		console.log("Verifying SimpleLending...");
		try {
			await run("verify:verify", {
				address: simpleLendingAddress,
				constructorArguments: [testTokenAddress],
			});
		} catch (error: any) {
			if (error.message.toLowerCase().includes("already verified")) {
				console.log("SimpleLending already verified!");
			} else {
				console.error("Error verifying SimpleLending:", error);
			}
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
