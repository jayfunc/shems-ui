"use client";

import { useTheme } from "next-themes";
import { Slide, ToastContainer } from "react-toastify";

export default function ThemedToastContainer() {
	const { theme } = useTheme();

	return (
		<ToastContainer transition={Slide} position="bottom-right" theme={theme} hideProgressBar stacked />
	);
}