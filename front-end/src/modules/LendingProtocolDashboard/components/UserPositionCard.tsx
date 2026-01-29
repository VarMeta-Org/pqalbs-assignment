import { formatEther } from "ethers";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { UserPosition } from "@/hooks/useLendingDashboard";

interface UserPositionCardProps {
	userPosition: UserPosition | null;
	maxBorrow?: bigint;
	tokenBalance?: bigint;
}

export const UserPositionCard = ({
	userPosition,
	maxBorrow,
	tokenBalance,
}: UserPositionCardProps) => {
	const formatValue = (value?: bigint) => {
		if (value === undefined) return "0.00";
		return parseFloat(formatEther(value)).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Position</CardTitle>
				<CardDescription>
					Your current supply and borrow position
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between border-b pb-2">
					<span className="text-muted-foreground text-sm">Supplied</span>
					<span className="font-medium">
						{formatValue(userPosition?.supplied)} USD8
					</span>
				</div>
				<div className="flex justify-between border-b pb-2">
					<span className="text-muted-foreground text-sm">Borrowed</span>
					<span className="font-medium">
						{formatValue(userPosition?.borrowed)} USD8
					</span>
				</div>
				<div className="flex justify-between border-b pb-2">
					<span className="text-muted-foreground text-sm">
						Max Borrowable limit
					</span>
					<span className="font-medium">{formatValue(maxBorrow)} USD8</span>
				</div>
				<div className="flex justify-between pt-2">
					<span className="text-muted-foreground text-sm">Wallet Balance</span>
					<span className="font-medium">{formatValue(tokenBalance)} USD8</span>
				</div>
			</CardContent>
		</Card>
	);
};
