import { routing } from "@/constants/constants";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(`/${routing.admin}/${routing.dashboard}`);
}
