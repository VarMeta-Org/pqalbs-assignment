import { type Chain, hardhat, sepolia } from "wagmi/chains";

export const env = {
	APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
	SIMPLE_LENDING_CONTRACT:
		process.env.NEXT_PUBLIC_SIMPLE_LENDING_CONTRACT || "",
	USD8_TOKEN: process.env.NEXT_PUBLIC_USD8_TOKEN || "",
	WETH_TOKEN: process.env.NEXT_PUBLIC_WETH_TOKEN || "",
	USE_TESTNET: process.env.NEXT_PUBLIC_USE_TESTNET || "",
};

export const EVM_CHAINS: [Chain, ...Chain[]] = env.USE_TESTNET
	? [sepolia]
	: [hardhat];

export const TARGET_CHAIN = EVM_CHAINS[0];
export const EXM_CHAINS_IDS: number[] = EVM_CHAINS.map((chain) => chain.id);
