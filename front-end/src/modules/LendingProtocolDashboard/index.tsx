"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { useLendingDashboard } from "@/hooks/useLendingDashboard";
import { HealthFactorWarning } from "./components/HealthFactorWarning";
import { PoolInfoCard } from "./components/PoolInfoCard";
import { TransactionForm } from "./components/TransactionForm";
import { UserPositionCard } from "./components/UserPositionCard";

export const LendingProtocolDashboard = () => {
	const { isConnected, connect } = useWallet();
	const {
		poolInfo,
		userPosition,
		maxWithdraw,
		maxBorrow,
		tokenBalance,
		refetchAll,
	} = useLendingDashboard();

	return (
		<div className="space-y-6">
			{/* Health Factor Warning */}
			{userPosition && (
				<HealthFactorWarning healthFactor={userPosition.healthFactor} />
			)}

			{/* Pool Info Section */}
			<PoolInfoCard poolInfo={poolInfo} userPosition={userPosition} />

			{/* Connect Wallet Prompt */}
			{!isConnected && (
				<Card className="border-dashed">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Wallet className="h-5 w-5" />
							Connect Your Wallet
						</CardTitle>
						<CardDescription>
							Connect your wallet to supply, borrow, and manage your positions
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<Button onClick={connect} size="lg">
							Connect Wallet
						</Button>
					</CardContent>
				</Card>
			)}

			{isConnected && (
				<div className="grid gap-4 md:grid-cols-2">
					{/* User Position */}
					<UserPositionCard
						userPosition={userPosition}
						maxBorrow={maxBorrow}
						tokenBalance={tokenBalance}
					/>

					{/* Transaction Interface */}
					<TransactionForm
						userPosition={userPosition}
						maxWithdraw={maxWithdraw}
						maxBorrow={maxBorrow}
						tokenBalance={tokenBalance}
						refetchAll={refetchAll}
					/>
				</div>
			)}
		</div>
	);
};
