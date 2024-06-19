import Navbar from "@/components/Navbar";
import React, { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
