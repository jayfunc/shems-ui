import routing from "@/constants/routing";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(`/${routing.admin}/${routing.dashboard}`);
}
