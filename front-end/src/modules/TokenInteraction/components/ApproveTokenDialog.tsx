import { useState } from "react";
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

interface ApproveTokenDialogProps {
	token: TokenData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onApprove: (amount: string) => void;
	isApproving: boolean;
}

export const ApproveTokenDialog = ({
	token,
	open,
	onOpenChange,
	onApprove,
	isApproving,
}: ApproveTokenDialogProps) => {
	const [amount, setAmount] = useState("");

	const handleConfirm = () => {
		if (!amount) {
			toast.error("Please enter an amount");
			return;
		}
		onApprove(amount);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setAmount(""); // Reset amount when closing
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Approve {token?.name}</DialogTitle>
					<DialogDescription>
						Set the maximum amount of {token?.name} that the Lending Protocol
						can spend on your behalf.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label htmlFor="approveAmount" className="text-sm font-medium">
							Allowance Amount
						</label>
						<Input
							id="approveAmount"
							name="approveAmount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount (e.g. 100)"
						/>
						<p className="text-xs text-muted-foreground">
							Enter the amount you want to allow the protocol to use.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isApproving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						loading={isApproving}
						disabled={isApproving}
					>
						Approve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
