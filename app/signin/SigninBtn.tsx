"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SigninBtn = () => {
  return (
    <div className="flex justify-center gap-4">
      <Button variant="outline" color="gray" onClick={() => signIn("google")}>
        <FcGoogle />
      </Button>
      <Button variant="outline" color="gray" onClick={() => signIn("github")}>
        <FaGithub size={28} />
      </Button>
    </div>
  );
};

export default SigninBtn;
