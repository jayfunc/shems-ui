"use client";

import { autoRefreshInterval } from "@/constants/constants";
import { ApiService } from "@/services/api";
import { toast } from "react-toastify";
import { SWRConfig } from "swr";

export default function SwrConfig({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig value={{
			refreshInterval: autoRefreshInterval,
			revalidateOnMount: true,
			fetcher: async (resource, init) => new ApiService<unknown>().fetch(resource, init),
			onError: (error, key) => {
				if (error.status !== 403 && error.status !== 404) {
					toast(<div>
						<div className="font-bold">{error.message}</div>
						<div className="text-sm">{error.cause}</div>
					</div>, {
						type: 'error',
					});
				}
			},
		}}>
			{children}
		</SWRConfig>
	);
}