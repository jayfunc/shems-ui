"use client";

import { ApiService } from "@/services/api";
import { SWRConfig } from "swr";

export default function SwrConfig({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig value={{
			refreshInterval: 5000,
			revalidateOnMount: true,
			fetcher: async (resource, init) => new ApiService<unknown>().fetch(resource, init),
			onError: (error, key) => {
				if (error.status !== 403 && error.status !== 404) {
					// toast(
					// 	<div>
					// 		<div className="font-bold">{error.message}</div>
					// 		<div className="text-sm">{error.cause}</div>
					// 	</div>, {
					// 	type: 'error',
					// });
				}
			},
		}}>
			{children}
		</SWRConfig>
	);
}