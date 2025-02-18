"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApiUriBuilder, { ApiService } from "@/services/api";
import { motion } from "motion/react";
import { toast } from "react-toastify";

export default function Page() {
  function sendNormalSignal() {
    new ApiService<boolean>().fetch(ApiUriBuilder.buildPostMainGridCfgNormalSignalUri()).then((res: boolean) => {
      if (res) {
        toast("Normal signal sent", {
          type: "success",
        });
      } else {
        toast("Failed to send normal signal", {
          type: "error",
        });
      }
    });
  }

  function sendPeakShaveSignal() {
    new ApiService<boolean>().fetch(ApiUriBuilder.buildPostMainGridCfgPeakShaveSignalUri()).then((res: boolean) => {
      if (res) {
        toast("Peak shave signal sent", {
          type: "success",
        });
      } else {
        toast("Failed to send peak shave signal", {
          type: "error",
        });
      }
    });
  }

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Main grid</CardTitle>
          <CardDescription>Control the main grid</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-2">
          <Button onClick={sendNormalSignal}>Send normal signal</Button>
          <Button variant="destructive" onClick={sendPeakShaveSignal}>
            Send peak shave signal
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
