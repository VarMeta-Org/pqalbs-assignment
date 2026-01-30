import { formatEther } from "ethers";
import {
	Activity,
	ArrowDownCircle,
	ArrowUpCircle,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserPosition } from "@/hooks/use-lending-dashboard";

interface UserPositionCardProps {
	userPosition: UserPosition | null;
	maxBorrow?: bigint;
	tokenBalance?: bigint;
	tokenSymbol?: string;
	isLoading?: boolean;
}

export const UserPositionCard = ({
	userPosition,
	maxBorrow,
	tokenBalance,
	tokenSymbol,
	isLoading,
}: UserPositionCardProps) => {
	const formatValue = (value?: bigint) => {
		if (value === undefined) return "0.00";
		return parseFloat(formatEther(value)).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const getHealthFactorStatus = (hf?: bigint) => {
		if (!hf) return { color: "text-muted-foreground", label: "No Position" };
		const value = Number(hf) / 100;
		if (hf > BigInt(10000))
			return { color: "text-green-500", label: "Excellent" };
		if (value < 1.2) return { color: "text-red-500", label: "Risk" };
		if (value < 1.5) return { color: "text-yellow-500", label: "Warning" };
		return { color: "text-green-500", label: "Healthy" };
	};

	const hfStatus = getHealthFactorStatus(userPosition?.healthFactor);

	return (
		<Card className="h-full border bg-card shadow-none">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="text-2xl font-bold flex items-center gap-2">
							<Wallet className="h-6 w-6 text-primary" />
							My Position
						</CardTitle>
						<CardDescription>
							Manage your supply and borrow positions
						</CardDescription>
					</div>
					{isLoading ? (
						<Skeleton className="h-8 w-24 rounded-full" />
					) : (
						userPosition?.healthFactor && (
							<Badge
								variant="outline"
								className={`${hfStatus.color} border-current bg-background/50 backdrop-blur-sm`}
							>
								{hfStatus.label}
							</Badge>
						)
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-6 pt-4">
				{/* Main Stats Grid */}
				<div className="grid grid-cols-2 gap-4">
					<div className="bg-background/50 p-4 border transition-all hover:bg-background/80 hover:shadow-md group">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<ArrowUpCircle className="h-4 w-4 text-green-500 transition-transform group-hover:-translate-y-0.5" />
							<span className="text-sm font-medium">Supplied</span>
						</div>
						<div className="text-2xl font-bold tracking-tight">
							{isLoading ? (
								<Skeleton className="h-8 w-24" />
							) : (
								`${formatValue(userPosition?.supplied)} ${tokenSymbol}`
							)}
						</div>
					</div>
					<div className="bg-background/50 p-4 border transition-all hover:bg-background/80 hover:shadow-md group">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<ArrowDownCircle className="h-4 w-4 text-blue-500 transition-transform group-hover:translate-y-0.5" />
							<span className="text-sm font-medium">Borrowed</span>
						</div>
						<div className="text-2xl font-bold tracking-tight">
							{isLoading ? (
								<Skeleton className="h-8 w-24" />
							) : (
								`${formatValue(userPosition?.borrowed)} ${tokenSymbol}`
							)}
						</div>
					</div>
				</div>

				{/* Health Factor Detail */}
				<div className="bg-secondary/20 p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Activity className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium">Health Factor</span>
						</div>
						<span className={`font-bold ${hfStatus.color}`}>
							{isLoading ? (
								<Skeleton className="h-5 w-16" />
							) : userPosition?.healthFactor &&
								userPosition.healthFactor > BigInt(10000) ? (
								"∞"
							) : (
								`${Number(userPosition?.healthFactor || 0)}%`
							)}
						</span>
					</div>
					{!isLoading && userPosition?.healthFactor && (
						<Progress
							value={Math.min(
								100,
								(Number(userPosition.healthFactor) / 300) * 100,
							)}
							className="h-2 bg-background/50"
							// indicatorClassName={hfStatus.color.replace("text-", "bg-")} // Note: You might need to adjust Progress component to accept indicatorClassName or just rely on CSS
						/>
					)}
				</div>

				{/* Secondary Stats */}
				<div className="space-y-3 pt-2">
					<div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
						<div className="flex items-center gap-2 text-muted-foreground">
							<TrendingUp className="h-4 w-4" />
							<span className="text-sm">Max Borrow Limit</span>
						</div>
						<span className="font-semibold">
							{isLoading ? (
								<Skeleton className="h-5 w-20" />
							) : (
								`${formatValue(maxBorrow)} ${tokenSymbol}`
							)}
						</span>
					</div>
					<div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/40 transition-colors">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Wallet className="h-4 w-4" />
							<span className="text-sm">Wallet Balance</span>
						</div>
						<span className="font-semibold">
							{isLoading ? (
								<Skeleton className="h-5 w-20" />
							) : (
								`${formatValue(tokenBalance)} ${tokenSymbol}`
							)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
