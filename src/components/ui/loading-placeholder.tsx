'use client';

import React from 'react';
import { motion } from 'motion/react';

export function LoadingPlaceholder() {
	// Bad performance on commtented lines,
	// and error may occur when using them
	// useRouteChangeEvents({
	// 	onRouteChangeStart: () => {
	// 	},
	// 	onRouteChangeComplete: () => {
	// 	},
	// });

	return (
		<motion.div className="animate-pulse grid grid-cols-3 gap-4 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
			<div className="aspect-video rounded-xl bg-muted" />
			<div className="aspect-video rounded-xl bg-muted" />
			<div className="aspect-video rounded-xl bg-muted" />
			<div className="w-full min-h-[50vh] rounded-xl bg-muted col-span-full" />
		</motion.div>
	);
}