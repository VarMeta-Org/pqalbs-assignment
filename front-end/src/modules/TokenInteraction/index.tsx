"use client";

import { MaxUint256, parseEther } from "ethers";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Coins, Copy, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useWallet } from "@/contexts/WalletContext";
import { type TokenData, useGetTokens } from "@/hooks/use-get-tokens";
import { useTokenTransaction } from "@/hooks/use-token-transaciton";
import { env } from "@/lib/const";
import { ApproveTokenDialog } from "./components/ApproveTokenDialog";
import { MintTokenDialog } from "./components/MintTokenDialog";
import { TokenCardSkeleton } from "./components/TokenCardSkeleton";

export const TokenInteraction = () => {
	const { address, connect } = useWallet();
	const { handleTokenTransaction } = useTokenTransaction();

	// Animation variants
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

	// State for tracking which token is currently being approved
	const [approvingToken, setApprovingToken] = useState<string | null>(null);

	// State for minting
	// State for minting
	const [mintingToken, setMintingToken] = useState<TokenData | null>(null);
	const [isMinting, setIsMinting] = useState(false);

	const isOwner = address?.toLowerCase() === env.TOKEN_OWNER.toLowerCase();

	const { data: tokens = [], isLoading: isReading, refetch } = useGetTokens();

	// State for approving
	const [approvingDialogToken, setApprovingDialogToken] =
		useState<TokenData | null>(null);

	const openApproveDialog = (token: TokenData) => {
		setApprovingDialogToken(token);
	};

	const handleConfirmApprove = async (amount: string) => {
		if (!approvingDialogToken) return;

		try {
			// Validate amount
			const parsedAmount = parseEther(amount);

			setApprovingToken(approvingDialogToken.address);
			const success = await handleTokenTransaction(
				approvingDialogToken.address,
				"approve",
				[env.SIMPLE_LENDING_CONTRACT, parsedAmount],
			);

			if (success) {
				refetch();
				setApprovingDialogToken(null);
			}
		} catch (error) {
			toast.error("Invalid amount");
		} finally {
			setApprovingToken(null);
		}
	};

	const handleMint = async (recipient: string, amount: string) => {
		if (!mintingToken) return;

		setIsMinting(true);
		const parsedAmount = parseEther(amount);

		const success = await handleTokenTransaction(mintingToken.address, "mint", [
			recipient,
			parsedAmount,
		]);

		if (success) {
			setMintingToken(null);
			refetch();
		}
		setIsMinting(false);
	};

	const openMintDialog = (token: TokenData) => {
		setMintingToken(token);
	};

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg bg-muted/20">
				<div className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/20">
					<Wallet className="w-8 h-8 text-primary" />
				</div>
				<h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
				<p className="text-muted-foreground text-sm max-w-[280px] mb-6">
					Connect your wallet to view your token balances and manage your assets
					securely.
				</p>
				<Button onClick={() => connect()}>Connect Wallet</Button>
			</div>
		);
	}

	return (
		<div className="relative w-full overflow-hidden p-6 md:p-8">
			<motion.div
				className="space-y-6 relative w-full overflow-hidden mx-auto max-w-6xl"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div
					variants={itemVariants}
					className="flex items-center justify-between"
				>
					<div>
						<h2 className="text-4xl text-white font-bold tracking-tight">
							Your Assets
						</h2>
						<p className="text-lg text-muted-foreground">
							Manage your tokens and approvals
						</p>
					</div>
				</motion.div>

				<motion.div
					variants={containerVariants}
					className="grid grid-cols-1 lg:grid-cols-2 gap-4"
				>
					{tokens.length === 0 && isReading && (
						<>
							{Array.from({ length: 2 }).map((_, i) => (
								<TokenCardSkeleton key={i} />
							))}
						</>
					)}

					{tokens.map((token) => {
						const isApproved = token.allowance > BigInt(0);
						const isApproving = approvingToken === token.address;
						const formattedAllowance =
							token.allowance > BigInt("1000000000000000000000000000") // rough check for very large number
								? "Unlimited"
								: parseFloat(
										(Number(token.allowance) / 10 ** 18).toString(),
									).toLocaleString(undefined, {
										maximumFractionDigits: 4,
									});

						return (
							<motion.div variants={itemVariants} key={token.address}>
								<Card className="transition-all duration-200 hover:shadow-md border-muted/60 bg-background/40 backdrop-blur-md shadow-sm">
									<CardContent className="p-6">
										<div className="flex flex-col gap-4">
											<div className="flex justify-between items-start">
												<div className="flex items-center gap-4">
													<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
														<Coins className="h-6 w-6 text-primary" />
													</div>
													<div>
														<div className="font-semibold text-lg flex items-center gap-2">
															{token.name}
														</div>
														<div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 w-fit mt-1">
															{token.address.slice(0, 6)}...
															{token.address.slice(-4)}
															<Copy
																className="h-3 w-3 cursor-pointer hover:text-foreground ml-1"
																onClick={() => {
																	navigator.clipboard.writeText(token.address);
																	toast.success("Address copied to clipboard");
																}}
															/>
														</div>
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm text-muted-foreground mb-1">
														Balance
													</div>
													<span className="font-mono text-xl font-bold tracking-tight">
														{parseFloat(token.balance).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 4,
															},
														)}
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between pt-4 border-t border-dashed">
												<div className="flex flex-col gap-1.5">
													<div className="flex items-center gap-2">
														{isApproved ? (
															<Badge
																variant="outline"
																className="bg-green-500/10 text-green-600 border-green-200 gap-1.5 hover:bg-green-500/20 hover:text-green-700"
															>
																<CheckCircle2 className="h-3.5 w-3.5" />
																Approved
															</Badge>
														) : (
															<Badge
																variant="outline"
																className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1.5 hover:bg-amber-500/20 hover:text-amber-700"
															>
																<AlertCircle className="h-3.5 w-3.5" />
																Not Approved
															</Badge>
														)}
													</div>
													<span className="text-[10px] text-muted-foreground pl-1">
														Allowance:{" "}
														<span className="font-mono font-medium text-foreground">
															{formattedAllowance}
														</span>
													</span>
												</div>

												<div className="flex gap-2">
													{isOwner && (
														<Button
															size="sm"
															variant="outline"
															onClick={() => openMintDialog(token)}
															className="h-8 text-xs font-medium"
														>
															Mint (Creator Only)
														</Button>
													)}
													<Button
														size="sm"
														variant={isApproved ? "outline" : "default"}
														onClick={() => openApproveDialog(token)}
														disabled={isApproving || isReading}
														loading={isApproving}
														className="h-8 px-4 text-xs font-medium"
													>
														{isApproved ? "Update Approval" : "Approve Usage"}
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}

					{/* Mint Dialog */}
					<MintTokenDialog
						token={mintingToken}
						open={!!mintingToken}
						onOpenChange={(open) => !open && setMintingToken(null)}
						onMint={handleMint}
						isMinting={isMinting}
						userAddress={address || undefined}
					/>

					{/* Approve Dialog */}
					<ApproveTokenDialog
						token={approvingDialogToken}
						open={!!approvingDialogToken}
						onOpenChange={(open) => !open && setApprovingDialogToken(null)}
						onApprove={handleConfirmApprove}
						isApproving={!!approvingToken}
					/>
				</motion.div>
			</motion.div>
		</div>
	);
};
