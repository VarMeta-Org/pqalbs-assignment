"use client";

import { useQuery } from "@tanstack/react-query";
import { Contract, formatUnits, MaxUint256 } from "ethers";
import { useState } from "react";
import { toast } from "sonner";
import { TestTokenABI } from "@/abis/TestToken";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

interface TokenData {
	name: string;
	address: string;
	balance: string;
	allowance: bigint;
	decimals: number;
}

export const TokenInteraction = () => {
	const { address, signer, provider } = useWallet();

	// State for tracking which token is currently being approved
	const [approvingToken, setApprovingToken] = useState<string | null>(null);

	const fetchTokenData = async (): Promise<TokenData[]> => {
		if (!address || !provider) return [];

		const tokens = [
			{ address: env.USD8_TOKEN, symbol: "USD8" },
			{ address: env.WETH_TOKEN, symbol: "WETH" },
		];

		const data = await Promise.all(
			tokens.map(async (token) => {
				const contract = new Contract(token.address, TestTokenABI, provider);

				// Fetch symbol dynamically or use fallback
				let symbol = token.symbol;
				try {
					symbol = await contract.symbol();
				} catch (e) {
					console.warn(`Failed to fetch symbol for ${token.address}`);
				}

				const [balance, allowance] = await Promise.all([
					contract.balanceOf(address),
					contract.allowance(address, env.SIMPLE_LENDING_CONTRACT),
				]);

				return {
					name: symbol,
					address: token.address,
					balance: formatUnits(balance, 18),
					allowance: allowance,
					decimals: 18,
				};
			}),
		);

		return data;
	};

	const {
		data: tokens = [],
		isLoading: isReading,
		refetch,
	} = useQuery({
		queryKey: ["token-data", address],
		queryFn: fetchTokenData,
		enabled: !!address && !!provider,
		refetchInterval: 10000,
	});

	const handleApprove = async (tokenAddress: string, tokenName: string) => {
		if (!signer) return;

		setApprovingToken(tokenAddress);
		try {
			const contract = new Contract(tokenAddress, TestTokenABI, signer);
			const tx = await contract.approve(
				env.SIMPLE_LENDING_CONTRACT,
				MaxUint256,
			);

			toast.info(`Approving ${tokenName}...`);
			await tx.wait();

			toast.success(`Approved ${tokenName} successfully!`);
			refetch();
		} catch (error: any) {
			console.error("Approval failed:", error);
			toast.error(error.message || `Failed to approve ${tokenName}`);
		} finally {
			setApprovingToken(null);
		}
	};

	if (!address) {
		return (
			<div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Token Interaction</h2>
				<p className="text-muted-foreground">
					Please connect your wallet to view balances.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Your Assets</h2>

			<div className="space-y-4">
				{tokens.map((token) => {
					const isApproved = token.allowance > BigInt(0);
					const isApproving = approvingToken === token.address;

					return (
						<div
							key={token.address}
							className="p-4 border rounded-md bg-card shadow-sm"
						>
							<div className="flex flex-col gap-3">
								<div className="flex justify-between items-start">
									<div>
										<div className="font-medium text-lg">{token.name}</div>
										<div className="text-xs text-muted-foreground break-all">
											{token.address.slice(0, 6)}...{token.address.slice(-4)}
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm text-muted-foreground">Balance</div>
										<span className="font-mono text-lg font-medium">
											{parseFloat(token.balance).toLocaleString(undefined, {
												maximumFractionDigits: 4,
											})}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between pt-2 border-t">
									<div className="text-sm flex items-center gap-2">
										<span
											className={`h-2 w-2 rounded-full ${
												isApproved ? "bg-green-500" : "bg-yellow-500"
											}`}
										/>
										<span className="text-muted-foreground text-xs">
											{isApproved ? "Approved" : "Not Approved"}
										</span>
									</div>

									{!isApproved && (
										<Button
											size="sm"
											variant="secondary"
											onClick={() => handleApprove(token.address, token.name)}
											disabled={isApproving || isReading}
											loading={isApproving}
											className="h-8"
										>
											Approve
										</Button>
									)}
								</div>
							</div>
						</div>
					);
				})}

				{tokens.length === 0 && isReading && (
					<div className="text-center py-4 text-muted-foreground">
						Loading assets...
					</div>
				)}
			</div>
		</div>
	);
};
