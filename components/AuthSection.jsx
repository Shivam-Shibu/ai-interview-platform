"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import CreditButton from "./CreditButton";
import { CalendarDays, Users } from "lucide-react";

export default function AuthSection({ user }) {
  return (
    <div className="flex items-center gap-3">

      {!user ? (
        <SignInButton mode="modal">
          <Button variant="gold">Get started →</Button>
        </SignInButton>
      ) : (
        <>
          {user.role === "INTERVIEWER" && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user.role === "INTERVIEWEE" && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/explore">
                  <Users size={16} />
                  Explore
                </Link>
              </Button>

              <Button variant="default" asChild>
                <Link href="/appointments">
                  <CalendarDays size={16} />
                  My Appointments
                </Link>
              </Button>
            </>
          )}

          <CreditButton
            role={user.role}
            credits={
              user.role === "INTERVIEWER"
                ? user.creditBalance ?? 0
                : user.credits ?? 0
            }
          />

          <UserButton />
        </>
      )}
    </div>
  );
}