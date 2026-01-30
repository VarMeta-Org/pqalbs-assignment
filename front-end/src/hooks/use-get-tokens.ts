import { useQuery } from "@tanstack/react-query";
import { Contract, formatUnits } from "ethers";
import { TestTokenABI } from "@/abis/TestToken";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

export interface TokenData {
	name: string;
	address: string;
	balance: string;
	allowance: bigint;
	decimals: number;
}

export const useGetTokens = () => {
	const { address, provider } = useWallet();

	const fetchTokenData = async (): Promise<TokenData[]> => {
		if (!address || !provider) return [];

		const tokens = [
			{ address: env.USD8_TOKEN, symbol: "USD8" },
			{ address: env.WETH_TOKEN, symbol: "WETH" },
		];

		const data = await Promise.all(
			tokens.map(async (token) => {
				const contract = new Contract(token.address, TestTokenABI, provider);

				// Fetch symbol dynamically or use fallback
				let symbol = token.symbol;
				try {
					symbol = await contract.symbol();
				} catch (e) {
					console.warn(`Failed to fetch symbol for ${token.address}`);
				}

				const [balance, allowance] = await Promise.all([
					contract.balanceOf(address),
					contract.allowance(address, env.SIMPLE_LENDING_CONTRACT),
				]);

				return {
					name: symbol,
					address: token.address,
					balance: formatUnits(balance, 18),
					allowance: allowance,
					decimals: 18,
				};
			}),
		);

		return data;
	};

	return useQuery({
		queryKey: ["token-data", address],
		queryFn: fetchTokenData,
		enabled: !!address && !!provider,
		refetchInterval: 10000,
	});
};
