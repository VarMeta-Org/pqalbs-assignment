import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const showTransactionToast = (
	description: string,
	status: "pending" | "success" | "error" = "success",
	hash?: string,
) => {
	const explorerUrl = "https://sepolia.etherscan.io/tx/";

	const message =
		status === "success"
			? "Transaction Confirmed"
			: status === "pending"
				? "Transaction Pending"
				: "Transaction Failed";

	return toast[status === "pending" ? "loading" : status](message, {
		description: (
			<div className="flex items-center gap-1">
				<span>{description}</span>
				{hash && (
					<a
						href={`${explorerUrl}${hash}`}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-2 inline-flex items-center hover:underline"
					>
						<ExternalLink className="ml-1 h-3 w-3" />
					</a>
				)}
			</div>
		),
		duration: status === "pending" ? Infinity : 4000,
	});
};
