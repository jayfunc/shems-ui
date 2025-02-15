"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminPassword, adminUsername, routing, userPassword } from "@/constants/constants";
import ApiService from "@/services/api";
import PrivacyPolicyText from "../login/privacy-policy";
import AuroraGradient from "@/animations/aurora-gradient";
import { motion } from "motion/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ScrollableDialog from "@/components/scrollable-dialog";
import Link from "next/link";
import TermOfServiceText from "./term-of-service";

const formSchema = z.object({
  username: z.string().min(1).max(10),
  pwd: z.string().min(1).max(20),
});

export default function Page() {
  const router = useRouter();
  const toast = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: undefined,
      pwd: undefined,
    },
  });

  function showErrorUsernameMsg() {
    form.setError("username", {
      type: "manual",
      message: "Username not found",
    });
  }

  function showErrorPwdMsg() {
    form.setError("pwd", {
      type: "manual",
      message: "Incorrect password",
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username === adminUsername) {
      if (values.pwd === adminPassword) {
        router.push(routing.admin);
      } else {
        showErrorPwdMsg();
      }
    } else if (isNaN(Number(values.username))) {
      showErrorUsernameMsg();
    } else if (values.pwd !== userPassword) {
      showErrorPwdMsg();
    } else {
      ApiService.getHse(parseInt(values.username)).then((ret) => {
        if (ret !== undefined) {
          if (ret.data === null) {
            showErrorUsernameMsg();
          } else {
            router.push(`${routing.household}/${values.username}`);
          }
        } else {
          form.setError("root", {
            type: "manual",
            message: "Network error",
          });
        }
      }).catch((err) => {
        toast.toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        })
      });
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuroraGradient className="min-h-screen text-white place-content-center flex place-items-center">
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Log in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pwd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-4">Submit</Button>
                <Label className="text-muted-foreground">
                  By clicking log in, you agree to our <ScrollableDialog
                    trigger={
                      <Link href="" className="underline">
                        Term of Service
                      </Link>
                    }
                    title="Term of Service"
                    desc="Please read our terms of service before using our services."
                    content={
                      TermOfServiceText()
                    }
                  /> and{" "}
                  <ScrollableDialog
                    trigger={
                      <Link href="" className="underline">
                        Privacy Policy
                      </Link>
                    }
                    title="Privacy policy"
                    desc="Please read our privacy policy before sharing your information."
                    content={
                      PrivacyPolicyText()
                    }
                  />.
                </Label>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AuroraGradient>
    </motion.div>
  );
}
