import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const showTransactionToast = (
	hash: string,
	chainId?: number, // To potentially support multiple chains explorer
	status: "pending" | "success" | "error" = "success",
) => {
	// Simple explorer URL construction (assuming local hardhat or common testnets)
	// For local hardhat, user might not have explorer running, but let's assume standard structure or just show hash

	// Ideally use chain config to get explorer url
	const explorerUrl = "https://etherscan.io/tx/"; // Fallback

	const message =
		status === "success"
			? "Transaction Confirmed"
			: status === "pending"
				? "Transaction Pending"
				: "Transaction Failed";

	toast[status === "pending" ? "loading" : status](message, {
		description: (
			<div className="flex items-center gap-1">
				<span>
					Hash: {hash.slice(0, 6)}...{hash.slice(-4)}
				</span>
				{/* 
				<a
					href={`${explorerUrl}${hash}`}
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2 inline-flex items-center hover:underline"
				>
					View <ExternalLink className="ml-1 h-3 w-3" />
				</a> 
                */}
			</div>
		),
		duration: status === "pending" ? Infinity : 4000,
	});
};
