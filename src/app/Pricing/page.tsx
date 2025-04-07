import React from "react";
import MemberHeader from "../components/MemberHeader";
import Pricing from "../components/Pricing";
const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <MemberHeader />
      <Pricing />
    </div>
  );
};

export default page;
