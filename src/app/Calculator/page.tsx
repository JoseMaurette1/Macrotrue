import React from "react";
import Calculator from "../components/Calculator";
import MemberHeader from "../components/MemberHeader";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <MemberHeader />
      <Calculator />
    </div>
  );
};

export default page;
