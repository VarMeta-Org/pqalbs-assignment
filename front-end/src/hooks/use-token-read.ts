import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Contract } from "ethers";
import { SimpleLendingABI } from "@/abis/SimpleLending";
import { TestTokenABI } from "@/abis/TestToken";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

type TokenFunctionName =
	| "symbol"
	| "name"
	| "decimals"
	| "balanceOf"
	| "allowance";

interface UseTokenReadProps<TData = any> {
	functionName: TokenFunctionName;
	tokenAddress: string;
	args?: any[];
	enabled?: boolean;
	refetchInterval?: number | false;
	queryOptions?: Omit<
		UseQueryOptions<TData, Error, TData, any[]>,
		"queryKey" | "queryFn" | "enabled" | "refetchInterval"
	>;
}

export const useTokenRead = <TResult = any>({
	functionName,
	tokenAddress,
	args = [],
	enabled = true,
	refetchInterval,
	queryOptions,
}: UseTokenReadProps<TResult>) => {
	const { provider, address: walletAddress, isConnected } = useWallet();

	const queryFn = async () => {
		if (!provider) throw new Error("Provider not initialized");

		const contract = new Contract(tokenAddress, TestTokenABI, provider);

		// Helper to properly format args if needed, or just spread them
		const result = await contract[functionName](...args);
		return result as TResult;
	};

	return useQuery({
		queryKey: [
			"tokenRead",
			tokenAddress,
			functionName,
			args,
			walletAddress, // Invalidate on wallet change
			isConnected,
		],
		queryFn,
		enabled: enabled && !!provider,
		refetchInterval,
		...queryOptions,
	});
};
