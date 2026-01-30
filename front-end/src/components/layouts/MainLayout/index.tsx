"use client";

import { useState } from "react";
import type { FCC } from "@/types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

const MainLayout: FCC = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const closeSidebar = () => setIsSidebarOpen(false);

	return (
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
	);
};

export default MainLayout;
