import { useCallback } from "react";
import { TestTokenABI } from "@/abis/TestToken";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";
import { useContractRead } from "./use-contract-read";

export interface PoolInfo {
	totalSupply: bigint;
	totalBorrow: bigint;
	utilizationRate: bigint;
	supplyRate: bigint;
	borrowRate: bigint;
}

export interface UserPosition {
	supplied: bigint;
	borrowed: bigint;
	collateralValue: bigint;
	healthFactor: bigint;
}

export const useLendingDashboard = () => {
	const { address } = useWallet();

	// Read Pool Info
	const { data: rawPoolInfo, refetch: refetchPoolInfo } = useContractRead({
		functionName: "getPoolInfo",
		refetchInterval: 10000, // Refetch every 10s
	});

	// Read User Position
	const { data: rawUserPosition, refetch: refetchUserPosition } =
		useContractRead({
			functionName: "getUserPosition",
			args: address ? [address] : undefined,
			enabled: !!address,
			refetchInterval: 10000,
		});

	// Read Max Withdraw (only for UI display, actual check in tx)
	const { data: maxWithdraw, refetch: refetchMaxWithdraw } = useContractRead({
		functionName: "calculateMaxWithdraw",
		args: address ? [address] : undefined,
		enabled: !!address,
	});

	// Read Max Borrow (only for UI display, actual check in tx)
	const { data: maxBorrow, refetch: refetchMaxBorrow } = useContractRead({
		functionName: "calculateMaxBorrow",
		args: address ? [address] : undefined,
		enabled: !!address,
	});

	// Read USD8 Token Balance
	const { data: tokenBalance, refetch: refetchTokenBalance } = useContractRead({
		functionName: "balanceOf",
		args: address ? [address] : undefined,
		address: env.USD8_TOKEN,
		abi: TestTokenABI,
		enabled: !!address,
	});

	// Read USD8 Allowance
	const { data: tokenAllowance, refetch: refetchAllowance } = useContractRead({
		functionName: "allowance",
		args: address ? [address, env.SIMPLE_LENDING_CONTRACT] : undefined,
		address: env.USD8_TOKEN,
		abi: TestTokenABI,
		enabled: !!address,
	});

	const refetchAll = useCallback(() => {
		refetchPoolInfo();
		refetchUserPosition();
		refetchMaxWithdraw();
		refetchMaxBorrow();
		refetchTokenBalance();
		refetchAllowance();
	}, [
		refetchPoolInfo,
		refetchUserPosition,
		refetchMaxWithdraw,
		refetchMaxBorrow,
		refetchTokenBalance,
		refetchAllowance,
	]);

	// Parse Pool Info
	const poolInfo: PoolInfo | null = rawPoolInfo
		? {
				totalSupply: rawPoolInfo[0],
				totalBorrow: rawPoolInfo[1],
				utilizationRate: rawPoolInfo[2],
				supplyRate: rawPoolInfo[3],
				borrowRate: rawPoolInfo[4],
			}
		: null;

	// Parse User Position
	const userPosition: UserPosition | null = rawUserPosition
		? {
				supplied: rawUserPosition[0],
				borrowed: rawUserPosition[1],
				collateralValue: rawUserPosition[2],
				healthFactor: rawUserPosition[3],
			}
		: null;

	return {
		poolInfo,
		userPosition,
		maxWithdraw: maxWithdraw as bigint | undefined,
		maxBorrow: maxBorrow as bigint | undefined,
		tokenBalance: tokenBalance as bigint | undefined,
		tokenAllowance: tokenAllowance as bigint | undefined,
		refetchAll,
	};
};
