import { LoaderCircle } from "lucide-react";

export default function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
	return isLoading ? <LoaderCircle className="animate-spin text-muted-foreground size-4" /> : null;
}