import { LendingProtocolDashboard } from "@/modules/LendingProtocolDashboard";
import { TokenInteraction } from "@/modules/TokenInteraction";

export default function MainPage() {
	return (
		<div className="container mx-auto p-4 lg:p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">DeFi Dashboard</h1>
				<p className="text-muted-foreground mt-2">
					Manage your assets, supply liquidity, and borrow against your
					collateral.
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-12 items-start">
				{/* Left Column: Assets & Faucet (4 cols) */}
				<div className="lg:col-span-4 space-y-6">
					<TokenInteraction />
				</div>

				{/* Right Column: Lending Protocol (8 cols) */}
				<div className="lg:col-span-8">
					<LendingProtocolDashboard />
				</div>
			</div>
		</div>
	);
}
