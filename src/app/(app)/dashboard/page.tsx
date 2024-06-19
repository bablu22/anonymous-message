/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response?.data?.data || []);
      if (refresh) {
        toast.success("Messages refreshed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
    }
  }, [session, fetchMessages]);

  if (!session) return null;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      <div className="space-y-2">
        {isLoading
          ? [...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-full h-10 mt-2" />
            ))
          : messages?.map((message: any) => (
              <div
                key={message._id}
                className="p-2 border border-gray-300 rounded"
              >
                {message.content}
              </div>
            ))}
      </div>
    </div>
  );
}
