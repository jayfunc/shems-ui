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
import {
  adminPassword,
  adminUsername,
  routing,
  userPassword,
} from "@/constants/constants";
import ApiUriBuilder from "@/services/api";
import PrivacyPolicyText from "../login/privacy-policy";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ScrollableDialog from "@/components/scrollable-dialog";
import Link from "next/link";
import TermOfServiceText from "./term-of-service";
import { motion } from "motion/react";

const formSchema = z.object({
  username: z.string().min(1).max(10),
  pwd: z.string().min(1).max(20),
});

export default function Page() {
  const router = useRouter();

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
      router.push(`${routing.household}/${values.username}`);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Login with your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4">
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By clicking continue, you agree to our
            <br />
            <ScrollableDialog
              trigger={
                <Link href="" className="underline">
                  Term of Service
                </Link>
              }
              title="Term of Service"
              desc="Please read our terms of service before using our services."
              content={TermOfServiceText()}
            />{" "}
            and{" "}
            <ScrollableDialog
              trigger={
                <Link href="" className="underline">
                  Privacy Policy
                </Link>
              }
              title="Privacy policy"
              desc="Please read our privacy policy before sharing your information."
              content={PrivacyPolicyText()}
            />
            .
          </div>
        </div>
      </div>
    </motion.div>
  );
}
