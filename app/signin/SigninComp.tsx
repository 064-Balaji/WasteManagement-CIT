import { Button } from "@/components/ui/button";
import React from "react";
import { FaKey } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { MdOutlineAlternateEmail } from "react-icons/md";

const SigninComp = () => {
  return (
    <div className="flex flex-col gap-4 my-8">
      {/* Email Input */}
      <div className="flex items-center gap-2 border border-input rounded-md p-2">
        <MdOutlineAlternateEmail size={18} />
        <input
          type="email"
          placeholder="sample@gmail.com"
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

      {/* Password Input */}
      <div className="flex items-center gap-2 border border-input rounded-md p-2">
        <FaKey size={18} />
        <input
          type="password"
          placeholder="*******"
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

      {/* Sign-in Button */}
      <Button variant="default" className="mt-4 flex items-center gap-2">
        Signin
        <GoSignIn />
      </Button>
    </div>
  );
};

export default SigninComp;
