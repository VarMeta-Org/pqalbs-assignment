"use client";

import { useEffect, useState } from "react";
import type { FCC } from "@/types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

const MainLayout: FCC = ({ children }) => {
	const [isInitializing, setIsInitializing] = useState(true);
	const [ready, setReady] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	useEffect(() => {
		if (ready) {
			setTimeout(() => setIsInitializing(false), 2000);
		}
	}, [ready]);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const closeSidebar = () => setIsSidebarOpen(false);

	return (
		<>
			{isInitializing ? (
				<div className="relative flex h-screen w-screen items-center justify-center bg-initialization bg-no-repeat px-4 text-center font-medium font-tomorrow text-2xl uppercase sm:text-4xl md:text-5xl">
					ArchDAO Admin Dashboard is Launching
					<div className="fixed bottom-0 flex h-2/5 w-screen animate-grid items-center justify-center bg-infinite-grid"></div>
				</div>
			) : (
				<div className="flex h-screen w-full bg-background">
					<Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
					<div className="flex w-full flex-1 flex-col">
						<Header onMenuClick={toggleSidebar} />
						<main
							className="flex w-full flex-col overflow-y-auto bg-background p-4 md:p-6"
							style={{ height: "calc(100vh - 4rem)" }}
						>
							{children}
						</main>
					</div>
				</div>
			)}
		</>
	);
};

export default MainLayout;
