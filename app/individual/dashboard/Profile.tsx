"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Profile = ({ individual }: { individual: any }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="h-12 w-12 cursor-pointer">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${individual.name}`}
          />
          <AvatarFallback>{individual.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        <div className="space-y-2">
          <h2 className="font-semibold">{individual.name}</h2>
          <p className="text-sm text-muted-foreground">{individual.email}</p>
          <p className="text-sm text-muted-foreground">{individual.phoneNo}</p>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
