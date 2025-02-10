"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routing } from "@/constants/routing";
import Hse from "@/models/hse";
import ApiService from "@/services/api";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrivacyPolicyButton } from "../login/privacy-policy";
import { TermOfUseButton } from "../login/term-of-use";

export default function Page() {
  const [hses, setHses] = useState<Hse[]>([]);
  const [hse, setHse] = useState<Hse>();

  function onHHSelected(hse: Hse) {
    setHse(hse);
  }

  useEffect(() => {
    ApiService.getAllHses().then((res) => {
      setHses(res.data);
    });
  }, []);

  return (
    <motion.div
      className="min-h-screen grid grid-cols-2 place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="col-span-1 p-20 font-serif w-full h-full place-content-end space-y-2
			bg-gradient-to-br
			text-neutral-700 from-lime-100 to-lime-50
			dark:text-neutral-50 dark:from-teal-500 dark:to-teal-800"
      >
        <div className="text-xl">
          "In the end, we will conserve only what we love; we will love only
          what we understand; and we will understand only what we are taught."
        </div>
        <div>- Baba Dioum</div>
      </div>
      <div className="col-span-1">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Log in to your household account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1 flex flex-col">
            <Label>Account</Label>
            <div className="relative">
              <Input value={hse?.householdName ?? "Choose account"} disabled />
              <div className="absolute right-0 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="min-w-[415px]"
                  >
                    {hses.map((value) => {
                      return (
                        <DropdownMenuItem
                          onClick={() => onHHSelected(value)}
                          key={value.id}
                        >
                          {value.householdName}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="pwd" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="pwd"
              type="password"
              defaultValue="mockpassword"
              disabled
            />
          </div>
        </CardContent>
        <CardFooter className="grid space-y-2">
          <Button disabled={hse === undefined}>
            <Link href={`/${routing.household}/${hse?.id}`}>Log in</Link>
          </Button>
          <Label className="text-muted-foreground">
            By clicking log in, you agree to our <TermOfUseButton /> and{" "}
            <PrivacyPolicyButton />.
          </Label>
        </CardFooter>
      </div>
    </motion.div>
  );
}
