"use client";

import { motion } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
			{children}
		</motion.div>
	);
}