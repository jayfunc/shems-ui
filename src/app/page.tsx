"use client";

import { routing } from "@/constants/constants";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`/${routing.login}`);
}
