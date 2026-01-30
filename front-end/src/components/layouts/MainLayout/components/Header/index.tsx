"use client";

import { Menu, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { EVM_CHAINS, TARGET_CHAIN } from "@/lib/const";
import { WalletDropdown } from "./WalletDropdown";

interface HeaderProps {
	onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
	const { address, connect, disconnect, chainId } = useWallet();

	return (
		<header className="relative flex h-16 w-full items-center justify-between px-4 md:px-8 overflow-hidden">
			{/* Glassmorphism background */}
			<div className="absolute inset-0 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl" />

			{/* Animated gradient border at bottom */}
			<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />

			{/* Subtle glow effect */}
			<div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-20 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

			{/* Left side - Menu button (mobile) */}
			<div className="relative flex items-center gap-3 z-10">
				<button
					onClick={onMenuClick}
					className="p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 lg:hidden group"
				>
					<Menu className="h-5 w-5 text-gray-400 transition-colors group-hover:text-primary" />
				</button>
			</div>

			{/* Right side - Network badge and Wallet */}
			<div className="relative flex items-center gap-3 md:gap-4 z-10">
				{/* Network Badge with glow */}
				{address && chainId && (
					<div className="hidden md:flex items-center gap-2 relative group">
						{/* Glow effect on hover */}
						<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<div className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-1.5 border border-primary/20 backdrop-blur-sm">
							<div className="relative">
								<Zap className="h-3.5 w-3.5 text-primary" />
								<div className="absolute inset-0 animate-ping">
									<Zap className="h-3.5 w-3.5 text-primary opacity-50" />
								</div>
							</div>
							<span className="font-medium text-primary text-xs">
								{(() => {
									const initialChainId = TARGET_CHAIN.id;
									const chain = EVM_CHAINS.find(
										(c) => c.id === (chainId || initialChainId),
									);
									return chain?.name || "Unknown Network";
								})()}
							</span>
						</div>
					</div>
				)}

				{/* Connect/Wallet Button */}
				{!address ? (
					<Button
						onClick={() => connect()}
						className="relative group overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
					>
						{/* Shimmer effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
						<Wallet className="mr-2 h-4 w-4" />
						<span className="relative">Connect Wallet</span>
					</Button>
				) : (
					<WalletDropdown />
				)}
			</div>
		</header>
	);
};
