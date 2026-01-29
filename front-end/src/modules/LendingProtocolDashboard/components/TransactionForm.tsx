import { formatEther, parseUnits } from "ethers";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserPosition } from "@/hooks/useLendingDashboard";
import {
	type TransactionStep,
	useLendingTransaction,
} from "@/hooks/useLendingTransaction";

interface TransactionFormProps {
	tokenBalance?: bigint;
	maxWithdraw?: bigint;
	maxBorrow?: bigint;
	userPosition: UserPosition | null;
	refetchAll: () => void;
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
	maxWithdraw,
	maxBorrow,
	userPosition,
	refetchAll,
}: TransactionFormProps) => {
	const { supply, withdraw, borrow, repay, isLoading, txStep, resetTxState } =
		useLendingTransaction(refetchAll);

	const [amount, setAmount] = useState("");
	const [activeTab, setActiveTab] = useState("supply");

	const formatValue = (value?: bigint) => {
		if (value === undefined) return "0.00";
		return parseFloat(formatEther(value)).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const handleSetMax = () => {
		if (activeTab === "supply") {
			setAmount(tokenBalance ? formatEther(tokenBalance) : "0");
		} else if (activeTab === "withdraw") {
			setAmount(maxWithdraw ? formatEther(maxWithdraw) : "0");
		} else if (activeTab === "borrow") {
			setAmount(maxBorrow ? formatEther(maxBorrow) : "0");
		} else if (activeTab === "repay") {
			const debt = userPosition?.borrowed || BigInt(0);
			const balance = tokenBalance || BigInt(0);
			const maxRepay = debt < balance ? debt : balance;
			setAmount(formatEther(maxRepay));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount) return;

		try {
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
		} catch (error) {
			console.error("Transaction Error", error);
		}
	};

	const isValidAmount = () => {
		if (!amount) return false;
		try {
			const val = parseUnits(amount, 18);
			if (val <= BigInt(0)) return false;
			return true;
		} catch {
			return false;
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
					<div className="mt-4 rounded-lg bg-muted/50 p-3">
						<p className="text-sm text-muted-foreground">
							{currentAction.description}
						</p>
					</div>

					{/* Step Progress Indicator */}
					<StepIndicator step={txStep} activeTab={activeTab} />

					<form onSubmit={handleSubmit} className="mt-4 space-y-4">
						<div className="space-y-2">
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Amount (USD8)</span>
								<button
									type="button"
									onClick={handleSetMax}
									className="text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-0.5 rounded cursor-pointer"
								>
									Max:{" "}
									{activeTab === "supply"
										? formatValue(tokenBalance)
										: activeTab === "withdraw"
											? formatValue(maxWithdraw)
											: activeTab === "borrow"
												? formatValue(maxBorrow)
												: formatValue(userPosition?.borrowed)}
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
									}
								}}
								disabled={isLoading}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading || !isValidAmount()}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
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
