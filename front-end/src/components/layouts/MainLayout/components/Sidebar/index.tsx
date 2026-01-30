"use client";

import { motion } from "framer-motion";
import { Banknote, Hexagon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

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
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{/* Background Gradient Spot */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
					<div className="absolute top-[-20%] left-[-20%] w-[80%] h-[30%] bg-primary/10 rounded-full blur-3xl opacity-50" />
					<div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
				</div>

				{/* Header */}
				<div className="flex items-center justify-between px-6 py-6 h-20">
					<div className="flex items-center gap-3">
						<div className="flex flex-col">
							<span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-lg font-bold text-transparent">
								Lending Protocol
							</span>
							<span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase opacity-80">
								De-Fi Lending Application
							</span>
						</div>
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex flex-1 flex-col gap-2 px-4 py-8">
					<div className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
						Menu
					</div>
					{NAV_ITEMS.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={handleLinkClick}
								className="group relative flex items-center gap-3 px-4 py-2 font-medium text-sm transition-colors outline-none"
							>
								{isActive ? (
									<motion.span
										layoutId="sidebar-active-indicator"
										className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/10 border border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.15)]"
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
									/>
								) : (
									<span className="absolute inset-0 bg-transparent transition-colors group-hover:bg-white/5" />
								)}

								<span
									className={cn(
										"relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300",
										isActive
											? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/25"
											: "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground",
									)}
								>
									<item.icon className="h-4 w-4" />
								</span>

								<span
									className={cn(
										"relative z-10 transition-colors duration-300",
										isActive
											? "text-foreground font-semibold"
											: "text-muted-foreground group-hover:text-foreground",
									)}
								>
									{item.title}
								</span>

								{isActive && (
									<motion.div
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
										className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(var(--primary),0.5)]"
									/>
								)}
							</Link>
						);
					})}
				</nav>
			</aside>
		</>
	);
};
