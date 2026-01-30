import { Contract } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { TestTokenABI } from "../abis/TestToken";
import { showTransactionToast } from "../components/ui/TransactionStatusToast";
import { useWallet } from "../contexts/WalletContext";
import { parseContractError } from "../utils/common";

export type TokenFunctionName =
	| "mint"
	| "approve"
	| "transfer"
	| "transferFrom";

export function useTokenTransaction() {
	const { signer } = useWallet();
	const [hash, setHash] = useState<string | undefined>(undefined);
	const [isPending, setIsPending] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const reset = useCallback(() => {
		setHash(undefined);
		setIsPending(false);
		setIsConfirmed(false);
		setError(null);
	}, []);

	const handleTokenTransaction = useCallback(
		async (
			tokenAddress: string,
			functionName: TokenFunctionName,
			args: any[],
		) => {
			// Reset state before new transaction
			reset();

			if (!signer) {
				toast.error("Wallet not connected");
				return;
			}

			if (!tokenAddress) {
				toast.error("Token address is missing");
				return;
			}

			const pendingToastIds: (string | number)[] = [];

			try {
				setIsPending(true);
				const contract = new Contract(tokenAddress, TestTokenABI, signer);

				// Dynamic method call on the contract
				if (typeof contract[functionName] !== "function") {
					throw new Error(`Function ${functionName} not found on contract`);
				}

				// Show pending toast for signature
				const pendingSignToastId = showTransactionToast(
					"Please sign the transaction...",
					"pending",
				);
				pendingToastIds.push(pendingSignToastId);

				const tx = await contract[functionName](...args);
				toast.dismiss(pendingSignToastId);

				setHash(tx.hash);

				// Confirming transaction
				const confirmingToastId = showTransactionToast(
					"Transaction confirming...",
					"pending",
					tx.hash,
				);
				pendingToastIds.push(confirmingToastId);

				await tx.wait();

				toast.dismiss(confirmingToastId);
				setIsConfirmed(true);
				showTransactionToast(
					"Transaction confirmed successfully!",
					"success",
					tx.hash,
				);
				return true;
			} catch (err: any) {
				console.error("Token transaction failed:", err);
				const errorMsg = parseContractError(err) || "Transaction failed";
				setError(err);
				toast.error(errorMsg);
				return false;
			} finally {
				// Clean up any remaining pending toasts
				pendingToastIds.forEach((id) => toast.dismiss(id));

				// Don't set isPending to false immediately if successful if we want to show success state?
				// Actually usually hooks set isPending to false once done.
				setIsPending(false);
			}
		},
		[signer, reset],
	);

	return {
		handleTokenTransaction,
		hash,
		isPending,
		isConfirmed,
		error,
		reset,
	};
}
