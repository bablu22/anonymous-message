"use client";

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import message from "public/message.json";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 0">
      <div className=" p-8 rounded-lg text-center max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Anonymous Feedback
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Share and receive anonymous feedback with ease. Create your unique
          link, share it, and let others provide you with honest feedback.
        </p>
        <div className="flex justify-center mb-4">
          <Player
            autoplay
            loop
            src={message}
            style={{ height: "300px", width: "300px" }}
          />
        </div>
      </div>
    </div>
  );
}
