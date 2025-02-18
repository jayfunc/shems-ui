import LoadingIndicator from "./loading-indicator";
import { CardTitle } from "./ui/card";

export default function CardTitleWithLoadingIndicator({ isLoading = true, title }: { isLoading?: boolean, title: string }) {
	return (
		<CardTitle className="flex flex-row gap-2 items-center">
			{title}
			<LoadingIndicator isLoading={isLoading} />
		</CardTitle>
	);
}