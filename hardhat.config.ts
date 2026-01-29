import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: "0.8.19",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	networks: {
		// Ethereum Sepolia Testnet
		sepolia: {
			url:
				process.env.SEPOLIA_RPC_URL ||
				"https://ethereum-sepolia.publicnode.com",
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 11155111,
			timeout: 60000,
		},
	},
	etherscan: {
		enabled: true,
		apiKey: process.env.ETHERSCAN_API_KEY || "",
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS === "true",
		currency: "USD",
	},
	// sourcify: {
	// 	enabled: true,
	// },
};

export default config;
