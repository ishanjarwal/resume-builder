import { SignIn } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <main className="flex h-screen items-start justify-center p-3 pt-8">
      <SignIn />
    </main>
  );
};

export default page;
