"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios from "axios";
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

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code/`, {
        code: data.code,
        username: params.username,
      });

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
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
            Verify Account
          </h2>
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="code">Verification Code</FormLabel>
                <Input
                  {...field}
                  type="text"
                  id="code"
                  placeholder="Enter verification code"
                />
                <FormDescription>
                  Please check your email for the verification code.
                </FormDescription>
                <FormMessage {...field} />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting ? "Verifying..." : "Verify"}
          </Button>

          {/* Go back */}
          <Link href="/sign-in">
            <span className="text-sm text-center block mt-2">
              Go back to Sign In
            </span>
          </Link>
        </form>
      </Form>
    </div>
  );
}
