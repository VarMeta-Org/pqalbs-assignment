import { useQuery } from "@tanstack/react-query";
import { Contract, type Interface, type InterfaceAbi } from "ethers";
import { SimpleLendingABI } from "@/abis/SimpleLending";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

type UseContractReadProps = {
	functionName: string;
	args?: any[];
	enabled?: boolean;
	refetchInterval?: number;
	address?: string;
	abi?: Interface | InterfaceAbi;
};

export const useContractRead = <TResult = any>({
	functionName,
	args,
	enabled = true,
	refetchInterval,
	address: contractAddressOverride,
	abi: contractAbiOverride,
}: UseContractReadProps) => {
	const { provider, address: walletAddress, isConnected } = useWallet();

	const targetAddress = contractAddressOverride || env.SIMPLE_LENDING_CONTRACT;
	const targetAbi = contractAbiOverride || SimpleLendingABI;

	const queryFn = async () => {
		if (!provider) throw new Error("Provider not initialized");
		const contract = new Contract(targetAddress, targetAbi, provider);
		const result = await contract[functionName](...(args || []));
		return result as TResult;
	};

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: [
			"contractRead",
			targetAddress,
			functionName,
			args,
			walletAddress,
			isConnected,
		],
		queryFn,
		enabled: enabled && !!provider,
		refetchInterval,
	});

	return {
		data,
		isLoading,
		isFetching,
		refetch,
	};
};
