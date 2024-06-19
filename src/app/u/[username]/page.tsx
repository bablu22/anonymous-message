"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import Link from "next/link";
import { Send, Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useCompletion } from "ai/react";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function PublicPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-message",
    initialCompletion: initialMessageString,
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const res = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });
      toast.success(res.data.message);
      form.reset({
        ...form.getValues(),
        content: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
    min-h-screen "
    >
      <div className="w-full lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg ">
          <h1 className="text-2xl font-bold mb-4">
            Send Anonymous Message to @{username}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="content"
                control={form.control}
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel htmlFor="content">Your Message</FormLabel>
                    <Textarea
                      id="content"
                      {...field}
                      className="resize-none h-32"
                      placeholder="Write your message here"
                    />
                    <FormMessage>
                      {formState.errors.content?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader className="mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" /> Send
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="space-y-4 my-8">
            <div className="space-y-2">
              <Button
                onClick={fetchSuggestedMessages}
                className="my-4"
                disabled={isSuggestLoading}
              >
                Suggest Messages
              </Button>
              <p>Click on any message below to select it.</p>
            </div>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {error ? (
                  <p className="text-red-500">{error.message}</p>
                ) : (
                  parseStringMessages(completion).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          <Separator className="my-6" />
          <div className="text-center">
            <div className="mb-4">Get Your Message Board</div>
            <Link href={"/sign-up"}>
              <Button>Create Your Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
