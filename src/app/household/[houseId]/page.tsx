import routing from "@/constants/routing";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ houseId: number }>;
}) {
  const houseId = (await params).houseId;

  redirect(`/${routing.household}/${houseId}/${routing.dashboard}`);
}
