import { ethers, network, run } from "hardhat";

async function main() {
	console.log("Starting TestToken deployment to network:", network.name);

	const [deployer] = await ethers.getSigners();
	console.log("Deploying contracts with the account:", deployer.address);

	// Deploy USD8
	console.log("\nDeploying USD8...");
	const USD8 = await ethers.getContractFactory("TestToken");
	const usd8 = await USD8.deploy("USD8", "USD8");
	await usd8.waitForDeployment();
	const usd8Address = await usd8.getAddress();
	console.log(`USD8 deployed to: ${usd8Address}`);

	// Deploy WETH
	console.log("\nDeploying WETH...");
	const WETH = await ethers.getContractFactory("TestToken");
	const weth = await WETH.deploy("WETH", "WETH");
	await weth.waitForDeployment();
	const wethAddress = await weth.getAddress();
	console.log(`WETH deployed to: ${wethAddress}`);

	console.log("\nDeployment completed!");
	console.log("----------------------------------");
	console.log(`USD8: ${usd8Address}`);
	console.log(`WETH: ${wethAddress}`);
	console.log("----------------------------------");

	// Verify contracts if on a live network
	if (network.name !== "hardhat" && network.name !== "localhost") {
		console.log("\nWaiting for block confirmations before verification...");
		// Wait for 6 blocks to ensure Etherscan has indexed the deployment
		const usd8Tx = usd8.deploymentTransaction();
		if (usd8Tx) {
			await usd8Tx.wait(6);
		}

		const wethTx = weth.deploymentTransaction();
		if (wethTx) {
			await wethTx.wait(6);
		}

		console.log("Verifying USD8...");
		try {
			await run("verify:verify", {
				address: usd8Address,
				constructorArguments: ["USD8", "USD8"],
			});
		} catch (error: any) {
			if (error.message.toLowerCase().includes("already verified")) {
				console.log("USD8 already verified!");
			} else {
				console.error("Error verifying USD8:", error);
			}
		}

		console.log("Verifying WETH...");
		try {
			await run("verify:verify", {
				address: wethAddress,
				constructorArguments: ["WETH", "WETH"],
			});
		} catch (error: any) {
			if (error.message.toLowerCase().includes("already verified")) {
				console.log("WETH already verified!");
			} else {
				console.error("Error verifying WETH:", error);
			}
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
