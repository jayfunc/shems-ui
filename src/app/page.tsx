"use client";

import { routing } from "@/constants/routing";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`/${routing.household}/1`);
}
