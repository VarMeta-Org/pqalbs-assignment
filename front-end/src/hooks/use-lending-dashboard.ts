import type BN from "bn.js";
import { useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";
import { toBN } from "@/utils/common";
import { useLendingRead } from "./use-lending-read";
import { useTokenRead } from "./use-token-read";

export interface PoolInfo {
	totalSupply: BN;
	totalBorrow: BN;
	utilizationRate: BN;
	supplyRate: BN;
	borrowRate: BN;
}

export interface UserPosition {
	supplied: BN;
	borrowed: BN;
	collateralValue: BN;
	healthFactor: BN;
}

export const useLendingDashboard = () => {
	const { address } = useWallet();

	// Read Pool Info
	const {
		data: rawPoolInfo,
		refetch: refetchPoolInfo,
		isLoading: isPoolInfoLoading,
	} = useLendingRead({
		functionName: "getPoolInfo",
		refetchInterval: 10000, // Refetch every 10s
	});

	// Read User Position
	const {
		data: rawUserPosition,
		refetch: refetchUserPosition,
		isLoading: isUserPositionLoading,
	} = useLendingRead({
		functionName: "getUserPosition",
		args: address ? [address] : undefined,
		enabled: !!address,
		refetchInterval: 10000,
	});

	// Read Max Withdraw (only for UI display, actual check in tx)
	const {
		data: maxWithdraw,
		refetch: refetchMaxWithdraw,
		isLoading: isMaxWithdrawLoading,
	} = useLendingRead({
		functionName: "calculateMaxWithdraw",
		args: address ? [address] : undefined,
		enabled: !!address,
	});

	// Read Max Borrow (only for UI display, actual check in tx)
	const {
		data: maxBorrow,
		refetch: refetchMaxBorrow,
		isLoading: isMaxBorrowLoading,
	} = useLendingRead({
		functionName: "calculateMaxBorrow",
		args: address ? [address] : undefined,
		enabled: !!address,
	});

	const { data: tokenAddress, isLoading: isTokenAddressLoading } =
		useLendingRead({
			functionName: "token",
		});

	const { data: tokenSymbol, isLoading: isTokenSymbolLoading } = useTokenRead({
		functionName: "symbol",
		tokenAddress: tokenAddress || "",
		enabled: !!tokenAddress,
	});

	const {
		data: tokenBalance,
		refetch: refetchTokenBalance,
		isLoading: isTokenBalanceLoading,
	} = useTokenRead({
		functionName: "balanceOf",
		args: address ? [address] : undefined,
		tokenAddress: tokenAddress || "",
		enabled: !!address,
	});

	const {
		data: tokenAllowance,
		refetch: refetchAllowance,
		isLoading: isTokenAllowanceLoading,
	} = useTokenRead({
		functionName: "allowance",
		args: address ? [address, env.SIMPLE_LENDING_CONTRACT] : undefined,
		tokenAddress: tokenAddress || "",
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
				totalSupply: toBN(rawPoolInfo[0]),
				totalBorrow: toBN(rawPoolInfo[1]),
				utilizationRate: toBN(rawPoolInfo[2]),
				supplyRate: toBN(rawPoolInfo[3]),
				borrowRate: toBN(rawPoolInfo[4]),
			}
		: null;

	// Parse User Position
	const userPosition: UserPosition | null = rawUserPosition
		? {
				supplied: toBN(rawUserPosition[0]),
				borrowed: toBN(rawUserPosition[1]),
				collateralValue: toBN(rawUserPosition[2]),
				healthFactor: toBN(rawUserPosition[3]),
			}
		: null;

	return {
		poolInfo,
		userPosition,
		maxWithdraw: maxWithdraw ? toBN(maxWithdraw as bigint) : undefined,
		maxBorrow: maxBorrow ? toBN(maxBorrow as bigint) : undefined,
		tokenBalance: tokenBalance ? toBN(tokenBalance as bigint) : undefined,
		tokenAllowance: tokenAllowance ? toBN(tokenAllowance as bigint) : undefined,
		tokenSymbol,
		refetchAll,
		isPoolInfoLoading,
		isUserPositionLoading,
		isMaxWithdrawLoading,
		isMaxBorrowLoading,
		isTokenAddressLoading,
		isTokenSymbolLoading,
		isTokenBalanceLoading,
		isTokenAllowanceLoading,
	};
};
