import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const indi = await prisma.individual.findUnique({
    where: { email: session?.user.email! },
  });
  if (!indi) redirect("/");
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Welcome, Individual User!</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <p className="text-lg font-medium mb-2">Name: {indi.name}</p>
        <p className="text-lg font-medium mb-2">Email: {indi.email}</p>
        <p className="text-lg font-medium mb-2">Phone: {indi.phoneNo}</p>
        <p className="text-lg font-medium mb-2">Address: {indi.address}</p>
        <p className="text-lg font-medium mb-2">City: {indi.city}</p>
        <p className="text-lg font-medium mb-2">Pincode: {indi.pinCode}</p>
      </div>
    </div>
  );
};

export default page;
