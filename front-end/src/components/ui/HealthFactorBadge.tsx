import { cn } from "@/lib/utils";

interface HealthFactorBadgeProps {
	healthFactor: bigint;
	className?: string;
}

export const HealthFactorBadge = ({
	healthFactor,
	className,
}: HealthFactorBadgeProps) => {
	// healthFactor is in basis points or scaled value?
	// Contract: healthFactor = (maxBorrowable * 100) / borrowed;
	// So 100 = 100%, 150 = 150%
	// If borrowed is 0, healthFactor is max uint256

	const isInfinite = healthFactor > BigInt(10000); // Arbitrary large number
	const value = Number(healthFactor);

	let colorClass =
		"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
	let label = "Healthy";

	if (isInfinite) {
		label = "∞";
	} else if (value < 100) {
		colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
		label = "At Risk";
	} else if (value < 150) {
		colorClass =
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
		label = "Caution";
	}

	return (
		<div
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
				colorClass,
				className,
			)}
		>
			{isInfinite ? "∞" : `${value}%`}
			{/* <span className="ml-1 opacity-75">({label})</span> */}
		</div>
	);
};
