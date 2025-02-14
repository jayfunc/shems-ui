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
import { routing } from "@/constants/constants";
import ApiService from "@/services/api";
import { PrivacyPolicyButton } from "../login/privacy-policy";
import { TermOfUseButton } from "../login/term-of-use";
import AuroraGradient from "@/animations/aurora-gradient";
import { motion } from "motion/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.coerce.number().min(1).max(50),
  pwd: z.string().min(8).max(50),
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
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    ApiService.getHse(values.username).then((ret) => {
      if (ret !== undefined) {
        if (ret.data === null) {
          form.setError("username", {
            type: "manual",
            message: "Username not found",
          });
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
                  By clicking log in, you agree to our <TermOfUseButton /> and{" "}
                  <PrivacyPolicyButton />.
                </Label>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AuroraGradient>
    </motion.div>
  );
}
