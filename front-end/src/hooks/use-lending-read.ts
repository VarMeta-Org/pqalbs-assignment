import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Contract } from "ethers";
import { SimpleLendingABI } from "@/abis/SimpleLending";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

type LendingFunctionName =
	| "getPoolInfo"
	| "getUserPosition"
	| "positions"
	| "utilizationRate"
	| "supplyRate"
	| "borrowRate"
	| "totalBorrow"
	| "totalSupply"
	| "userBorrow"
	| "userSupply"
	| "BASE_RATE"
	| "token"
	| "calculateMaxWithdraw"
	| "calculateMaxBorrow"
	| "LIQUIDATION_THRESHOLD"
	| "LTV_RATIO"
	| "UTILIZATION_MULTIPLIER";

interface UseLendingReadProps<TData = any> {
	functionName: LendingFunctionName;
	args?: any[];
	enabled?: boolean;
	refetchInterval?: number | false;
	queryOptions?: Omit<
		UseQueryOptions<TData, Error, TData, any[]>,
		"queryKey" | "queryFn" | "enabled" | "refetchInterval"
	>;
}

export const useLendingRead = <TResult = any>({
	functionName,
	args = [],
	enabled = true,
	refetchInterval,
	queryOptions,
}: UseLendingReadProps<TResult>) => {
	const { provider, address: walletAddress, isConnected } = useWallet();

	const queryFn = async () => {
		if (!provider) throw new Error("Provider not initialized");

		const contract = new Contract(
			env.SIMPLE_LENDING_CONTRACT,
			SimpleLendingABI,
			provider,
		);

		// Helper to properly format args if needed, or just spread them
		const result = await contract[functionName](...args);
		return result as TResult;
	};

	return useQuery({
		queryKey: [
			"lendingRead",
			env.SIMPLE_LENDING_CONTRACT,
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
