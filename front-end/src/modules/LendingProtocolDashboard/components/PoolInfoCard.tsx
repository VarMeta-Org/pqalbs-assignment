import { formatEther } from "ethers";
import { Info, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PoolInfo, UserPosition } from "@/hooks/use-lending-dashboard";

interface PoolInfoCardProps {
	poolInfo: PoolInfo | null;
	userPosition: UserPosition | null;
	tokenSymbol: string;
	isLoading?: boolean;
}

export const PoolInfoCard = ({
	poolInfo,
	tokenSymbol,
	isLoading = false,
}: PoolInfoCardProps) => {
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

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<TooltipProvider>
				{/* Total Supply */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm flex items-center gap-2">
							Total Supply
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-3 w-3 text-muted-foreground cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Total assets deposited in the protocol</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{isLoading ? (
								<Skeleton className="h-8 w-32" />
							) : (
								`${formatValue(poolInfo?.totalSupply)} ${tokenSymbol}`
							)}
						</div>
						<div className="text-muted-foreground text-xs pt-1 flex items-center gap-1">
							{isLoading ? (
								<Skeleton className="h-4 w-16" />
							) : (
								<>
									<span>
										Supply Rate: {formatPercentage(poolInfo?.supplyRate)} APY
									</span>
									<Tooltip>
										<TooltipTrigger>
											<Info className="h-3 w-3 cursor-help" />
										</TooltipTrigger>
										<TooltipContent>
											<p>Annual Percentage Yield (APY) earned by suppliers</p>
										</TooltipContent>
									</Tooltip>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Total Borrow */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm flex items-center gap-2">
							Total Borrow
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-3 w-3 text-muted-foreground cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Total assets borrowed from the protocol</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{isLoading ? (
								<Skeleton className="h-8 w-32" />
							) : (
								` ${formatValue(poolInfo?.totalBorrow)} ${tokenSymbol}`
							)}
						</div>
						<div className="text-muted-foreground text-xs pt-1 flex items-center gap-1">
							{isLoading ? (
								<Skeleton className="h-4 w-16" />
							) : (
								<>
									<span>
										Borrow Rate: {formatPercentage(poolInfo?.borrowRate)} APY
									</span>
									<Tooltip>
										<TooltipTrigger>
											<Info className="h-3 w-3 cursor-help" />
										</TooltipTrigger>
										<TooltipContent>
											<p>Annual Percentage Yield (APY) paid by borrowers</p>
										</TooltipContent>
									</Tooltip>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Available Liquidity */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm flex items-center gap-2">
							Available Liquidity
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-3 w-3 text-muted-foreground cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Total funds available for borrowing in the pool</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<Wallet className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{isLoading ? (
								<Skeleton className="h-8 w-32" />
							) : (
								`${formatValue(
									(poolInfo?.totalSupply ?? BigInt(0)) -
										(poolInfo?.totalBorrow ?? BigInt(0)),
								)} ${tokenSymbol}`
							)}
						</div>
					</CardContent>
				</Card>

				{/* Utilization Rate */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm flex items-center gap-2">
							Utilization Rate
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-3 w-3 text-muted-foreground cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Percentage of funds currently being borrowed</p>
								</TooltipContent>
							</Tooltip>
						</CardTitle>
						<div className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{isLoading ? (
								<Skeleton className="h-8 w-24" />
							) : (
								formatPercentage(poolInfo?.utilizationRate)
							)}
						</div>
					</CardContent>
				</Card>
			</TooltipProvider>
		</div>
	);
};
