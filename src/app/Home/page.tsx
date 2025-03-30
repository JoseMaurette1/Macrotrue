"use client";
import React from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import MemberHeader from "../components/MemberHeader";
import { useUser } from "@clerk/nextjs";

const HomePage = () => {
  const { user, isLoaded } = useUser();

  const welcomeTitle = isLoaded && user
    ? `Welcome, ${user.firstName || user.username || "Friend"}!`
    : "Greetings";

  return (
    <div className="p-4 relative">
      <MemberHeader />
      <BackgroundPaths title={welcomeTitle} />
    </div>
  );
};

export default HomePage;
