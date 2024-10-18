import { Button } from "@/components/ui/button";
import React from "react";
import { FaKey, FaRegUser } from "react-icons/fa";
import {
  MdDriveFileRenameOutline,
  MdOutlineAlternateEmail,
} from "react-icons/md";

const SignupComp = () => {
  return (
    <div className="flex flex-col gap-4 my-8">
      {/* Name Input */}
      <div className="flex items-center gap-2 border border-input rounded-md p-2">
        <MdDriveFileRenameOutline size={18} />
        <input
          type="text"
          placeholder="John Doe"
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

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
        <FaKey size={16} />
        <input
          type="password"
          placeholder="*******"
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

      {/* Signup Button */}
      <Button variant="default" className="mt-4 flex items-center gap-2">
        Signup
        <FaRegUser />
      </Button>
    </div>
  );
};

export default SignupComp;
