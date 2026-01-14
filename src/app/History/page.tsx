import React from "react";
import MemberHeader from "../components/MemberHeader";
import WorkoutHistory from "../components/WorkoutHistory";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center pt-16">
      <MemberHeader />
      <WorkoutHistory />
    </div>
  );
};

export default page