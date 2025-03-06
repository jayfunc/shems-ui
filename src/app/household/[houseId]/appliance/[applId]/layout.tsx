"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const applId = usePathname().split("/").pop();
  return (
    <motion.div layoutId={`appl-${applId}`} className="grid gap-4">
      {children}
    </motion.div>
  );
}
