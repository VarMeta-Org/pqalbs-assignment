import { Contract, parseUnits } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { SimpleLendingABI } from "@/abis/SimpleLending";
import { TestTokenABI } from "@/abis/TestToken";
import { showTransactionToast } from "@/components/ui/TransactionStatusToast";
import { useWallet } from "@/contexts/WalletContext";
import { env } from "@/lib/const";
import { parseContractError } from "@/utils/common";

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
			const pendingToastIds: (string | number)[] = [];

			if (!signer || !address) {
				toast.error("Please connect your wallet wallet");
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

				const tokenAddress = await lendingContract.token();

				const tokenContract = new Contract(tokenAddress, TestTokenABI, signer);

				// Execute Action
				setTxStep("confirming");
				let tx: any;
				const toastId = showTransactionToast(
					`Confirming ${action}...`,
					"pending",
				);
				pendingToastIds.push(toastId);

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

				toast.dismiss(toastId);

				setTxStep("waiting");
				const pendingConfirmToastId = showTransactionToast(
					"Waiting for transaction to be confirmed...",
					"pending",
					tx.hash,
				);
				pendingToastIds.push(pendingConfirmToastId);

				await tx.wait();

				setTxStep("success");
				showTransactionToast("Transaction confirmed", "success", tx.hash);
				pendingToastIds.forEach((id) => toast.dismiss(id));

				onSuccess?.();
			} catch (error: any) {
				pendingToastIds.forEach((id) => toast.dismiss(id));
				console.error("Transaction failed:", error);
				setTxStep("error");

				const errMsg = parseContractError(error);

				setErrorMessage(errMsg);
				showTransactionToast(errMsg || "Something went wrong", "error");
			} finally {
				setIsLoading(false);
			}
		},
		[signer, address, onSuccess],
	);

	const approveToken = useCallback(
		async (amount: string, decimals = 18) => {
			const pendingToastIds: (string | number)[] = [];
			if (!signer || !address) {
				toast.error("Please connect your wallet");
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

				const tokenAddress = await lendingContract.token();
				const tokenContract = new Contract(tokenAddress, TestTokenABI, signer);

				// Approving token
				setTxStep("approving");
				const pendingApproveToastId = showTransactionToast(
					"Approving token...",
					"pending",
				);
				pendingToastIds.push(pendingApproveToastId);

				const approveTx = await tokenContract.approve(
					env.SIMPLE_LENDING_CONTRACT,
					parsedAmount,
				);
				toast.dismiss(pendingApproveToastId);

				// Confirming approval
				setTxStep("confirming");
				const pendingConfirmToastId = showTransactionToast(
					"Waiting for token approval...",
					"pending",
					approveTx.hash,
				);
				pendingToastIds.push(pendingConfirmToastId);

				await approveTx.wait();

				setTxStep("success");
				toast.dismiss(pendingConfirmToastId);
				showTransactionToast(
					"Token approved successfully",
					"success",
					approveTx.hash,
				);
				onSuccess?.();
			} catch (error: any) {
				pendingToastIds.forEach((id) => toast.dismiss(id));
				console.error("Approval failed:", error);
				setTxStep("error");
				const errMsg = parseContractError(error);
				setErrorMessage(errMsg);
				showTransactionToast(errMsg || "Approval failed", "error");
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
		approve: (amount: string, decimals?: number) =>
			approveToken(amount, decimals),
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
