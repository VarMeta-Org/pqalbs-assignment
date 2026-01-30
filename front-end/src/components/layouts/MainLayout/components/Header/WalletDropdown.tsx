"use client";

import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/contexts/WalletContext";
import { formatAddress } from "@/utils/common";

export const WalletDropdown = () => {
	const { address, disconnect } = useWallet();

	if (!address) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="relative group overflow-hidden border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
				>
					{/* Subtle shimmer on hover */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
					<div className="relative w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
					<span className="relative font-mono">{formatAddress(address)}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-64 border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-blue-500/10 p-2 rounded-2xl"
			>
				<div className="px-2 py-3 mb-2 bg-white/5 rounded-xl border border-white/5 mx-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
							<Wallet className="h-5 w-5 text-white" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Connected Wallet
							</span>
							<span className="font-mono text-sm font-bold text-white">
								{formatAddress(address)}
							</span>
						</div>
					</div>
				</div>

				<DropdownMenuItem
					className="cursor-pointer rounded-lg focus:bg-white/10 my-1 py-2.5"
					onClick={() => {
						navigator.clipboard.writeText(address);
					}}
				>
					<div className="bg-white/10 p-1.5 rounded-md mr-3 text-muted-foreground group-hover:text-white transition-colors">
						<Copy className="h-4 w-4" />
					</div>
					<span className="font-medium">Copy Address</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer rounded-lg focus:bg-white/10 my-1 py-2.5"
					onClick={() => {
						window.open(
							`https://sepolia.etherscan.io/address/${address}`,
							"_blank",
						);
					}}
				>
					<div className="bg-white/10 p-1.5 rounded-md mr-3 text-muted-foreground group-hover:text-white transition-colors">
						<ExternalLink className="h-4 w-4" />
					</div>
					<span className="font-medium">View on Explorer</span>
				</DropdownMenuItem>

				<div className="h-px bg-white/10 my-2 mx-1" />

				<DropdownMenuItem
					onClick={disconnect}
					className="cursor-pointer rounded-lg focus:bg-red-500/10 focus:text-red-500 text-red-400 py-2.5"
				>
					<div className="bg-red-500/10 p-1.5 rounded-md mr-3 transition-colors">
						<LogOut className="h-4 w-4" />
					</div>
					<span className="font-medium">Disconnect</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
