"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signupSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounce } from "@uidotdev/usehooks";
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

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const router = useRouter();
  const debouncedCheckUsername = useDebounce(username, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("debouncedCheckUsername", debouncedCheckUsername);
    const checkUsername = async () => {
      if (debouncedCheckUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        await axios
          .get(`/api/check-username?username=${debouncedCheckUsername}`)
          .then((res) => {
            setUsernameMessage(res.data.message);
            console.log(res.data.message);
          })
          .catch((err) => {
            console.error(err);
            setUsernameMessage(err.response.data.message);
          })
          .finally(() => {
            setIsCheckingUsername(false);
          });
      }
    };

    checkUsername();
  }, [debouncedCheckUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await axios.post("/api/sign-up", data);
      toast.success(res.data.message);
      router.replace(`/verify/${username}`);
    } catch (error: any) {
      console.error("Error in SignupForm", error);
      toast.error(error.message);
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
            Create an Account
          </h2>
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  {...field}
                  id="username"
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                  placeholder="Enter username"
                />

                <FormMessage className="text-xs" />

                {isCheckingUsername && (
                  <FormDescription>
                    Checking username availability...
                  </FormDescription>
                )}
                {!isCheckingUsername &&
                  usernameMessage &&
                  (usernameMessage === "Username is available." ? (
                    <FormMessage className="text-green-500">
                      {usernameMessage}
                    </FormMessage>
                  ) : (
                    <FormMessage className="text-red-500">
                      {usernameMessage}
                    </FormMessage>
                  ))}
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Enter email"
                />
                <FormMessage className="text-xs" />
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
                  id="password"
                  type="password"
                  placeholder="Enter password"
                />
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting || isCheckingUsername}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <div className="">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
