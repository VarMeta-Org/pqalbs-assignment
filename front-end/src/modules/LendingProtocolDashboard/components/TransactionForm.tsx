import BN from "bn.js";
import { parseUnits } from "ethers";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserPosition } from "@/hooks/use-lending-dashboard";
import {
	type TransactionStep,
	useLendingTransaction,
} from "@/hooks/use-lending-transaction";
import { formatBN, ZERO_BN } from "@/utils/common";

interface TransactionFormProps {
	tokenBalance?: BN;
	tokenAllowance?: BN;
	maxWithdraw?: BN;
	maxBorrow?: BN;
	userPosition: UserPosition | null;
	tokenSymbol?: string;
	refetchAll: () => void;
	isLoading?: boolean;
}

const ACTION_DESCRIPTIONS: Record<
	string,
	{ title: string; description: string }
> = {
	supply: {
		title: "Supply",
		description:
			"Deposit tokens to earn interest and use as collateral for borrowing.",
	},
	withdraw: {
		title: "Withdraw",
		description:
			"Remove your supplied tokens. Limited by your collateral requirements.",
	},
	borrow: {
		title: "Borrow",
		description:
			"Borrow tokens against your collateral at the current borrow rate.",
	},
	repay: {
		title: "Repay",
		description: "Pay back your borrowed amount to improve your health factor.",
	},
};

const StepIndicator = ({
	step,
	activeTab,
}: {
	step: TransactionStep;
	activeTab: string;
}) => {
	const needsApproval = activeTab === "supply" || activeTab === "repay";

	const getStepStatus = (targetStep: "approve" | "confirm" | "complete") => {
		if (step === "idle") return "pending";
		if (step === "error") return "error";

		if (targetStep === "approve") {
			if (step === "approving") return "active";
			if (["confirming", "waiting", "success"].includes(step))
				return "complete";
			return "pending";
		}
		if (targetStep === "confirm") {
			if (step === "confirming" || step === "waiting") return "active";
			if (step === "success") return "complete";
			return "pending";
		}
		if (targetStep === "complete") {
			if (step === "success") return "complete";
			return "pending";
		}
		return "pending";
	};

	const StepIcon = ({ status }: { status: string }) => {
		if (status === "complete")
			return <CheckCircle2 className="h-4 w-4 text-green-500" />;
		if (status === "active")
			return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
		return <Circle className="h-4 w-4 text-muted-foreground" />;
	};

	if (step === "idle") return null;

	return (
		<div className="flex items-center justify-center gap-2 py-3 text-xs">
			{needsApproval && (
				<>
					<div className="flex items-center gap-1">
						<StepIcon status={getStepStatus("approve")} />
						<span
							className={
								getStepStatus("approve") === "active"
									? "text-primary font-medium"
									: "text-muted-foreground"
							}
						>
							Approve
						</span>
					</div>
					<div className="w-4 h-px bg-muted-foreground/30" />
				</>
			)}
			<div className="flex items-center gap-1">
				<StepIcon status={getStepStatus("confirm")} />
				<span
					className={
						getStepStatus("confirm") === "active"
							? "text-primary font-medium"
							: "text-muted-foreground"
					}
				>
					Confirm
				</span>
			</div>
			<div className="w-4 h-px bg-muted-foreground/30" />
			<div className="flex items-center gap-1">
				<StepIcon status={getStepStatus("complete")} />
				<span
					className={
						getStepStatus("complete") === "complete"
							? "text-green-500 font-medium"
							: "text-muted-foreground"
					}
				>
					Complete
				</span>
			</div>
		</div>
	);
};

export const TransactionForm = ({
	tokenBalance,
	tokenAllowance,
	maxWithdraw,
	maxBorrow,
	userPosition,
	tokenSymbol,
	refetchAll,
	isLoading,
}: TransactionFormProps) => {
	const {
		approve,
		supply,
		withdraw,
		borrow,
		repay,
		isLoading: isTxLoading,
		txStep,
		resetTxState,
	} = useLendingTransaction(refetchAll);

	const [amount, setAmount] = useState("");
	const [activeTab, setActiveTab] = useState("supply");
	const [validationError, setValidationError] = useState<string | null>(null);

	// Clear validation error when tab changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setValidationError(null);
	}, [activeTab]);

	const validateAmount = (value: string) => {
		if (!value || value === "0") {
			setValidationError(null);
			return;
		}

		try {
			// BN does not support decimals in constructor.
			// Format: "1.234" -> 1.234 * 10^18
			// Ethers parseUnits returns bigint. Convert to BN.
			const parsedBigInt = parseUnits(value, 18);
			const parsedAmount = new BN(parsedBigInt.toString());

			if (parsedAmount.lte(ZERO_BN)) {
				setValidationError("Amount must be greater than 0");
				return;
			}

			let maxLimit = ZERO_BN;
			let errorMsg = "";

			switch (activeTab) {
				case "supply":
					maxLimit = tokenBalance || ZERO_BN;
					errorMsg = "Amount exceeds wallet balance";
					break;
				case "withdraw":
					maxLimit = maxWithdraw || ZERO_BN;
					errorMsg = "Amount exceeds max withdrawable limit";
					break;
				case "borrow":
					maxLimit = maxBorrow || ZERO_BN;
					errorMsg = "Amount exceeds max borrowable limit";
					break;
				case "repay": {
					const debt = userPosition?.borrowed || ZERO_BN;
					const balance = tokenBalance || ZERO_BN;
					// Check against debt
					if (parsedAmount.gt(debt)) {
						setValidationError("Amount exceeds borrowed balance");
						return;
					}
					// Check against wallet balance
					if (parsedAmount.gt(balance)) {
						setValidationError("Amount exceeds wallet balance");
						return;
					}
					setValidationError(null);
					return;
				}
			}

			if (parsedAmount.gt(maxLimit)) {
				setValidationError(errorMsg);
			} else {
				setValidationError(null);
			}
		} catch {
			setValidationError("Invalid amount");
		}
	};

	const formatValue = (value?: BN) => {
		if (!value) return "0.00";
		const formatted = formatBN(value, 18, 4);
		return parseFloat(formatted).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const handleSetMax = () => {
		if (activeTab === "supply") {
			setAmount(tokenBalance ? formatBN(tokenBalance) : "0");
		} else if (activeTab === "withdraw") {
			setAmount(maxWithdraw ? formatBN(maxWithdraw) : "0");
		} else if (activeTab === "borrow") {
			setAmount(maxBorrow ? formatBN(maxBorrow) : "0");
		} else if (activeTab === "repay") {
			const debt = userPosition?.borrowed || ZERO_BN;
			const balance = tokenBalance || ZERO_BN;
			const maxRepay = debt.lt(balance) ? debt : balance;
			setAmount(formatBN(maxRepay));
			setValidationError(null); // Max amount is always valid by definition logic
		}
		// Clear validation error for other tabs as setting max is valid
		if (activeTab !== "repay") {
			setValidationError(null);
		}
	};

	const isApprovalNeeded = useMemo(() => {
		if (activeTab !== "supply" && activeTab !== "repay") return false;
		if (!amount) return false;
		if (!tokenAllowance) return true;
		try {
			const parsedBigInt = parseUnits(amount, 18);
			const parsed = new BN(parsedBigInt.toString());
			return parsed.gt(tokenAllowance);
		} catch {
			return false;
		}
	}, [activeTab, amount, tokenAllowance]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount) return;

		try {
			if (isApprovalNeeded) {
				await approve(amount);
			} else {
				switch (activeTab) {
					case "supply":
						await supply(amount);
						break;
					case "withdraw":
						await withdraw(amount);
						break;
					case "borrow":
						await borrow(amount);
						break;
					case "repay":
						await repay(amount);
						break;
				}
				setAmount("");
			}
		} catch (error) {
			console.error("Transaction Error", error);
		}
	};

	const isValidAmount = () => {
		if (!amount || validationError) return false;
		try {
			const val = parseUnits(amount, 18);
			return val > BigInt(0);
		} catch {
			return false;
		}
	};

	const getMaxAmount = () => {
		switch (activeTab) {
			case "supply":
				return tokenBalance || ZERO_BN;
			case "withdraw":
				return maxWithdraw || ZERO_BN;
			case "borrow":
				return maxBorrow || ZERO_BN;
			case "repay": {
				const debt = userPosition?.borrowed || ZERO_BN;
				const balance = tokenBalance || ZERO_BN;
				return debt.lt(balance) ? debt : balance;
			}
		}
	};

	const currentAction = ACTION_DESCRIPTIONS[activeTab];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Manage Assets</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs
					value={activeTab}
					onValueChange={(val) => {
						setActiveTab(val);
						setAmount("");
						resetTxState();
					}}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="supply">Supply</TabsTrigger>
						<TabsTrigger value="withdraw">Withdraw</TabsTrigger>
						<TabsTrigger value="borrow">Borrow</TabsTrigger>
						<TabsTrigger value="repay">Repay</TabsTrigger>
					</TabsList>

					{/* Action Description */}
					<div className="mt-4 bg-info/20 p-3">
						<p className="text-sm text-info">{currentAction.description}</p>
					</div>

					{/* Step Progress Indicator */}
					<StepIndicator step={txStep} activeTab={activeTab} />

					<form onSubmit={handleSubmit} className="mt-4 space-y-4">
						<div className="space-y-2">
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">
									Amount ({tokenSymbol})
								</span>
								<button
									type="button"
									onClick={handleSetMax}
									disabled={isLoading}
									className="text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-0.5 cursor-pointer flex items-center gap-1 disabled:opacity-50"
								>
									Max:{" "}
									{isLoading ? (
										<Skeleton className="h-3 w-12" />
									) : (
										formatValue(getMaxAmount())
									)}
								</button>
							</div>
							<Input
								type="text"
								placeholder="0.00"
								value={amount}
								onChange={(e) => {
									const value = e.target.value;
									if (value === "" || /^\d*\.?\d*$/.test(value)) {
										setAmount(value);
										validateAmount(value);
									}
								}}
								disabled={isTxLoading}
								className={
									validationError
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
							/>
							{validationError && (
								<p className="text-xs text-red-500 mt-1">{validationError}</p>
							)}
						</div>

						<Button
							type="submit"
							className={`w-full ${
								isApprovalNeeded
									? "bg-amber-600 hover:bg-amber-700 text-white"
									: ""
							}`}
							disabled={isTxLoading || !isValidAmount()}
						>
							{isTxLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : isApprovalNeeded ? (
								`Approve ${tokenSymbol}`
							) : (
								currentAction.title
							)}
						</Button>
					</form>
				</Tabs>
			</CardContent>
		</Card>
	);
};
