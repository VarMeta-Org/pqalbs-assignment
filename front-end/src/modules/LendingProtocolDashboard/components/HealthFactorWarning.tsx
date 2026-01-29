import { AlertTriangle, XCircle } from "lucide-react";

interface HealthFactorWarningProps {
	healthFactor: bigint;
}

export const HealthFactorWarning = ({
	healthFactor,
}: HealthFactorWarningProps) => {
	const value = Number(healthFactor);

	// No warning if health factor is infinite (no borrows) or above 150%
	if (healthFactor > BigInt(10000) || value >= 150) {
		return null;
	}

	const isCritical = value < 120;

	return (
		<div
			className={`rounded-lg border p-4 ${
				isCritical
					? "border-red-500/50 bg-red-500/10 text-red-500"
					: "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
			}`}
		>
			<div className="flex items-start gap-3">
				{isCritical ? (
					<XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
				) : (
					<AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
				)}
				<div>
					<h4 className="font-semibold text-sm">
						{isCritical
							? "Critical Health Factor"
							: "Low Health Factor Warning"}
					</h4>
					<p className="text-sm mt-1 opacity-90">
						Your health factor is at {value}%.{" "}
						{isCritical
							? "You are at risk of liquidation. Repay your debt or add more collateral immediately."
							: "Consider repaying some debt or adding more collateral to avoid liquidation risk."}
					</p>
				</div>
			</div>
		</div>
	);
};
