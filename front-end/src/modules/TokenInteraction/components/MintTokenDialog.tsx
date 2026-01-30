import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { TokenData } from "@/hooks/use-get-tokens";

interface MintTokenDialogProps {
	token: TokenData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onMint: (recipient: string, amount: string) => void;
	isMinting: boolean;
	userAddress?: string;
}

export const MintTokenDialog = ({
	token,
	open,
	onOpenChange,
	onMint,
	isMinting,
	userAddress,
}: MintTokenDialogProps) => {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");

	// Reset state when dialog opens
	useEffect(() => {
		if (open) {
			setRecipient(userAddress || "");
			setAmount("100");
		}
	}, [open, userAddress]);

	const handleConfirm = () => {
		if (!recipient || !amount) {
			toast.error("Please fill in both recipient and amount");
			return;
		}
		onMint(recipient, amount);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Mint {token?.name}</DialogTitle>
					<DialogDescription>
						Mint new tokens to any address. Only available to the creator.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label htmlFor="recipient" className="text-sm font-medium">
							Recipient Address
						</label>
						<Input
							name="recipient"
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
							placeholder="0x..."
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="amount" className="text-sm font-medium">
							Amount
						</label>
						<Input
							name="amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="100"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isMinting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						loading={isMinting}
						disabled={isMinting}
					>
						Mint
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
