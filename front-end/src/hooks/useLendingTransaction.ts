import { Contract, MaxUint256, parseUnits } from "ethers";
import { useCallback, useState } from "react";
import { SimpleLendingABI } from "@/abis/SimpleLending";
import { TestTokenABI } from "@/abis/TestToken";
import { showTransactionToast } from "@/components/ui/TransactionStatusToast";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";

export type TransactionStep =
	| "idle"
	| "approving"
	| "confirming"
	| "waiting"
	| "success"
	| "error";

export const useLendingTransaction = (onSuccess?: () => void) => {
	const { signer, address } = useWallet();
	const [isLoading, setIsLoading] = useState(false);
	const [txStep, setTxStep] = useState<TransactionStep>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const executeTransaction = useCallback(
		async (
			action: "supply" | "withdraw" | "borrow" | "repay",
			amount: string,
			decimals = 18,
		) => {
			if (!signer || !address) {
				showTransactionToast("", undefined, "error");
				return;
			}

			setIsLoading(true);
			setTxStep("idle");
			setErrorMessage(null);

			try {
				const parsedAmount = parseUnits(amount, decimals);
				const lendingContract = new Contract(
					env.SIMPLE_LENDING_CONTRACT,
					SimpleLendingABI,
					signer,
				);
				const tokenContract = new Contract(
					env.USD8_TOKEN,
					TestTokenABI,
					signer,
				);

				// Approval Flow for Supply and Repay
				if (action === "supply" || action === "repay") {
					const allowance = await tokenContract.allowance(
						address,
						env.SIMPLE_LENDING_CONTRACT,
					);
					if (allowance < parsedAmount) {
						setTxStep("approving");
						showTransactionToast("Approving...", undefined, "pending");
						const approveTx = await tokenContract.approve(
							env.SIMPLE_LENDING_CONTRACT,
							MaxUint256,
						);
						showTransactionToast(approveTx.hash, undefined, "pending");
						await approveTx.wait();
						showTransactionToast(approveTx.hash, undefined, "success");
					}
				}

				// Execute Action
				setTxStep("confirming");
				let tx;
				showTransactionToast("Confirming...", undefined, "pending");

				switch (action) {
					case "supply":
						tx = await lendingContract.supply(parsedAmount);
						break;
					case "withdraw":
						tx = await lendingContract.withdraw(parsedAmount);
						break;
					case "borrow":
						tx = await lendingContract.borrow(parsedAmount);
						break;
					case "repay":
						tx = await lendingContract.repay(parsedAmount);
						break;
				}

				setTxStep("waiting");
				showTransactionToast(tx.hash, undefined, "pending");
				await tx.wait();
				setTxStep("success");
				showTransactionToast(tx.hash, undefined, "success");

				onSuccess?.();
			} catch (error: any) {
				console.error("Transaction failed:", error);
				setTxStep("error");

				// Try to extract a better error message
				let errMsg = error.message || "Unknown error";

				if (error.code === "ACTION_REJECTED") {
					errMsg = "Transaction rejected by user";
				} else if (error.reason) {
					errMsg = error.reason;
				} else if (error.data?.message) {
					errMsg = error.data.message;
				}

				setErrorMessage(errMsg);
				showTransactionToast(errMsg, undefined, "error");
			} finally {
				setIsLoading(false);
			}
		},
		[signer, address, onSuccess],
	);

	const resetTxState = useCallback(() => {
		setTxStep("idle");
		setErrorMessage(null);
	}, []);

	return {
		supply: (amount: string, decimals?: number) =>
			executeTransaction("supply", amount, decimals),
		withdraw: (amount: string, decimals?: number) =>
			executeTransaction("withdraw", amount, decimals),
		borrow: (amount: string, decimals?: number) =>
			executeTransaction("borrow", amount, decimals),
		repay: (amount: string, decimals?: number) =>
			executeTransaction("repay", amount, decimals),
		isLoading,
		txStep,
		errorMessage,
		resetTxState,
	};
};
