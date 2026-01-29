import { formatEther } from "ethers";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthFactorBadge } from "@/components/ui/HealthFactorBadge";
import type { PoolInfo, UserPosition } from "@/hooks/useLendingDashboard";

interface PoolInfoCardProps {
	poolInfo: PoolInfo | null;
	userPosition: UserPosition | null;
}

export const PoolInfoCard = ({ poolInfo, userPosition }: PoolInfoCardProps) => {
	const formatValue = (value?: bigint) => {
		if (value === undefined) return "0.00";
		return parseFloat(formatEther(value)).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const formatPercentage = (value?: bigint) => {
		if (value === undefined) return "0.00%";
		return `${value.toString()}%`;
	};

	const healthFactor = userPosition?.healthFactor;
	// Only show infinity if significantly large
	const isHealthFactorInfinite = healthFactor && healthFactor > BigInt(10000);

	return (
		<div className="grid gap-4 md:grid-cols-4">
			{/* Total Supply */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Total Supply</CardTitle>
					<TrendingUp className="h-4 w-4 text-green-500" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{formatValue(poolInfo?.totalSupply)} USD8
					</div>
					<p className="text-muted-foreground text-xs">
						{formatPercentage(poolInfo?.supplyRate)} APY
					</p>
				</CardContent>
			</Card>

			{/* Total Borrow */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Total Borrow</CardTitle>
					<TrendingDown className="h-4 w-4 text-orange-500" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{formatValue(poolInfo?.totalBorrow)} USD8
					</div>
					<p className="text-muted-foreground text-xs">
						{formatPercentage(poolInfo?.borrowRate)} APY
					</p>
				</CardContent>
			</Card>

			{/* Utilization Rate */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Utilization Rate
					</CardTitle>
					<div className="h-4 w-4 text-blue-500" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{formatPercentage(poolInfo?.utilizationRate)}
					</div>
				</CardContent>
			</Card>

			{/* Health Factor */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Health Factor</CardTitle>
					{healthFactor && <HealthFactorBadge healthFactor={healthFactor} />}
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{isHealthFactorInfinite ? "∞" : `${healthFactor || 0}%`}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
