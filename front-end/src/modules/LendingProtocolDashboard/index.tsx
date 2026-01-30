"use client";

import { motion } from "framer-motion";
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
import { useLendingDashboard } from "@/hooks/use-lending-dashboard";
import { PoolInfoCard } from "./components/PoolInfoCard";
import { TransactionForm } from "./components/TransactionForm";
import { UserPositionCard } from "./components/UserPositionCard";

export const LendingProtocolDashboard = () => {
	const { isConnected, connect, provider } = useWallet();
	const {
		poolInfo,
		userPosition,
		maxWithdraw,
		maxBorrow,
		tokenBalance,
		tokenAllowance,
		tokenSymbol,
		refetchAll,
		isUserPositionLoading,
		isPoolInfoLoading,
		isTokenBalanceLoading,
	} = useLendingDashboard();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="relative w-full overflow-auto p-6 md:p-8">
			<motion.div
				className="mx-auto max-w-6xl space-y-8"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Header Section */}
				<motion.div variants={itemVariants} className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tight bg-white bg-clip-text text-transparent">
						Lending Dashboard
					</h1>
					<p className="text-lg text-muted-foreground w-full max-w-2xl">
						Seamlessly supply assets, borrow against your portfolio, and track
						your financial health in real-time.
					</p>
				</motion.div>

				{/* Pool Info Section */}
				<motion.div variants={itemVariants}>
					<div className="rounded-xl bg-background/40 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
						<PoolInfoCard
							poolInfo={poolInfo}
							userPosition={userPosition}
							tokenSymbol={tokenSymbol}
							isLoading={isPoolInfoLoading}
						/>
					</div>
				</motion.div>

				{/* Connect Wallet Prompt */}
				{!isConnected && (
					<motion.div variants={itemVariants}>
						<Card className="border-dashed border-2 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:border-primary/50">
							<CardHeader className="text-center space-y-4">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
									<Wallet className="h-8 w-8" />
								</div>
								<CardTitle className="text-2xl font-bold">
									Connect Your Wallet
								</CardTitle>
								<CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
									Connect your wallet to access the lending market, manage your
									deposits, and borrow assets.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex justify-center pb-8">
								<Button
									onClick={connect}
									disabled={!provider}
									size="lg"
									className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
								>
									Connect Wallet
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{isConnected && (
					<motion.div
						variants={itemVariants}
						className="grid gap-6 lg:grid-cols-2"
					>
						{/* User Position */}
						<div className="h-full rounded-xl bg-background/40 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
							<UserPositionCard
								userPosition={userPosition}
								maxBorrow={maxBorrow}
								tokenBalance={tokenBalance}
								tokenSymbol={tokenSymbol}
								isLoading={isUserPositionLoading}
							/>
						</div>

						{/* Transaction Interface */}
						<div className="h-full rounded-xl  bg-background/40 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
							<TransactionForm
								userPosition={userPosition}
								maxWithdraw={maxWithdraw}
								maxBorrow={maxBorrow}
								tokenBalance={tokenBalance}
								tokenAllowance={tokenAllowance}
								refetchAll={refetchAll}
								tokenSymbol={tokenSymbol}
								isLoading={isTokenBalanceLoading}
							/>
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};
