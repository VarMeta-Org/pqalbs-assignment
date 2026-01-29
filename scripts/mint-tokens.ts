import { ethers } from "hardhat";

async function main() {
	const [signer] = await ethers.getSigners();

	// Check for recipient address in arguments or env var
	// Usage: RECIPIENT=0x... npx hardhat run scripts/mint-tokens.ts --network localhost
	const args = process.argv;
	const providedAddress = args.find((arg) => ethers.isAddress(arg));
	const envAddress = process.env.RECIPIENT;
	const recipient = envAddress || providedAddress || signer.address;

	// Address from deployed_addresses.json for chain-31337
	const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	const amountObj = ethers.parseEther("1000"); // Mint 1000 tokens

	const token = await ethers.getContractAt("TestToken", tokenAddress);

	console.log(`Minting 1000 tokens to ${recipient}...`);
	const tx = await token.connect(signer).mint(recipient, amountObj);
	await tx.wait();

	const balance = await token.balanceOf(recipient);
	console.log(`Minted! New balance: ${ethers.formatEther(balance)} tokens`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
