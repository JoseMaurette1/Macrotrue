"use client";

import { useAuth } from "@clerk/nextjs";

const AuthTest = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Authentication Status</h2>
      <div className="space-y-1">
        <p>User ID: {userId || "Not signed in"}</p>
        <p>Is Signed In: {isSignedIn ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default AuthTest;
