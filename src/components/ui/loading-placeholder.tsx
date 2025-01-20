'use client';

import React from 'react';
import { useRouteChangeEvents } from 'nextjs-router-events';
import { motion } from 'motion/react';
import SettingsService from '@/app/services/settings';

export function LoadingPlaceholder({ children }: { children: React.ReactNode }) {
	const [isVisible, setIsVisible] = React.useState(false);
	SettingsService.initDarkMode();

	// Bad performance on commtented lines,
	// and error may occur when using them
	useRouteChangeEvents({
		onRouteChangeStart: () => {
			// setIsVisible(true);
		},
		onRouteChangeComplete: () => {
			// setIsVisible(false);
		},
	});

	return (
		isVisible ?
			<motion.div className="animate-pulse grid grid-cols-3 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<div className="aspect-video rounded-xl bg-muted" />
				<div className="aspect-video rounded-xl bg-muted" />
				<div className="aspect-video rounded-xl bg-muted" />
				<div className="w-full min-h-[50vh] rounded-xl bg-muted col-span-full" />
			</motion.div> : children
	);
}