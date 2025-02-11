import { routing } from "@/constants/constants";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ hhId: number }>;
}) {
  const hhId = (await params).hhId;

  redirect(`/${routing.household}/${hhId}/${routing.dashboard}`);
}
