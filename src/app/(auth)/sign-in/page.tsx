"use client";

import { signInSchema } from "@/schemas/signinSchema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(response);
    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("Signed in successfully");
    }

    if (response?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Sign In to Your Account
          </h2>
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="identifier">Email or Username</FormLabel>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter email or username"
                />
                <FormMessage {...field} />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter password"
                />
                <FormMessage {...field} />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div>
            <p className="text-sm text-center">
              Do not have an account?{" "}
              <Link href="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
