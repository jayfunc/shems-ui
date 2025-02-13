"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
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
import { routing } from "@/constants/constants";
import Hse from "@/models/hse";
import ApiService from "@/services/api";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrivacyPolicyButton } from "../login/privacy-policy";
import { TermOfUseButton } from "../login/term-of-use";
import { Fade } from "react-awesome-reveal";
import AuroraGradient from "@/animations/aurora-gradient";
import { motion } from "motion/react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
  const [hses, setHses] = useState<Hse[]>([]);
  const [hseId, setHseId] = useState<number>();

  function onHHSelected(hseId: number) {
    setHseId(hseId);
  }

  useEffect(() => {
    ApiService.getAllHses().then((res) => {
      setHses(res.data);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuroraGradient className="min-h-screen text-white place-content-center flex place-items-center">
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Log in to your household account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Label>Account</Label>
            <Select onValueChange={(value) => onHHSelected(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a account" />
              </SelectTrigger>
              <SelectContent>
                {hses.map((value) => {
                  return (
                    <SelectItem value={value.id.toString()} key={value.id}>
                      {value.householdName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div />
            <Label htmlFor="pwd" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="pwd"
              type="password"
              defaultValue="mockpassword"
              disabled
            />
          </CardContent>
          <CardFooter className="grid space-y-2">
            <Link href={`/${routing.household}/${hseId}`}>
              <Button className="w-full" disabled={hseId === undefined}>Log in</Button>
            </Link>
            <Label className="text-muted-foreground">
              By clicking log in, you agree to our <TermOfUseButton /> and{" "}
              <PrivacyPolicyButton />.
            </Label>
          </CardFooter>
        </Card>
      </AuroraGradient>
    </motion.div>
  );
}
