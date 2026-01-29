"use client";

import { LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{
		title: "Token Interaction",
		href: "/token-interaction",
		icon: LayoutGrid,
	},
	{
		title: "Lending Protocol Dashboard",
		href: "/lending-protocol",
		icon: LayoutGrid,
	},
];

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const pathname = usePathname();

	const handleLinkClick = () => {
		// Close sidebar on mobile when a link is clicked
		onClose();
	};

	return (
		<>
			{/* Backdrop overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-border border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{/* Header with close button on mobile */}
				<div className="flex items-center justify-between px-6 py-6">
					<span className="font-medium text-base text-foreground">
						Asignment App
					</span>
					<button
						onClick={onClose}
						className="rounded-lg p-1 transition-colors hover:bg-white/5 lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<div className="py-4">
					<Separator />
				</div>

				<nav className="flex flex-1 flex-col gap-1 px-3">
					{NAV_ITEMS.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={handleLinkClick}
								className={cn(
									"flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-colors",
									isActive
										? "border border-[#67B2F44D] bg-[#67B2F41A] text-foreground"
										: "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
								)}
							>
								<item.icon className="h-4 w-4" />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</aside>
		</>
	);
};
