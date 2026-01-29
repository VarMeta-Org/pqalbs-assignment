"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/contexts/WalletContext";
import { EVM_CHAINS, TARGET_CHAIN } from "@/lib/const";
import { formatAddress } from "@/utils/common";

interface HeaderProps {
	onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
	const { address, connect, disconnect, chainId } = useWallet();

	return (
		<header className="flex h-16 w-full items-center justify-between border-border border-b bg-card/50 px-4 backdrop-blur md:px-8">
			{/* Left side - Menu button (mobile) and Dashboard title */}
			<div className="flex items-center gap-3">
				<button
					onClick={onMenuClick}
					className="rounded-lg p-2 transition-colors hover:bg-white/5 lg:hidden"
				>
					<Menu className="h-5 w-5 text-gray-400" />
				</button>
				<h1 className="font-medium text-base text-white md:text-lg">
					Assignment App
				</h1>
			</div>

			{/* Right side - Notification, User, and Wallet */}
			<div className="flex items-center gap-2 md:gap-4">
				{address && chainId && (
					<div className="hidden rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs md:block">
						{(() => {
							const initialChainId = TARGET_CHAIN.id;
							console.log("🚀 ~ Header ~ initialChainId:", initialChainId);
							console.log("🚀 ~ Header ~ EVM_CHAINS:", EVM_CHAINS);
							const chain = EVM_CHAINS.find(
								(c) => c.id === (chainId || initialChainId),
							);
							console.log("🚀 ~ Header ~ chain:", chain);
							return chain?.name || "Unknown Network";
						})()}
					</div>
				)}
				{!address ? (
					<Button onClick={() => connect()}>Connect Wallet</Button>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">{formatAddress(address)}</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={disconnect}
								className="text-destructive focus:text-destructive cursor-pointer"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Disconnect
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
};
