"use client";

import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <Button onClick={() => signOut()} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <Link href="/sign-in">
                <Button>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
