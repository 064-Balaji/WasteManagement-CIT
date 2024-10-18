import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const buiss = await prisma.business.findUnique({
    where: { email: session?.user.email! },
  });
  if (!buiss) redirect("/");
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Welcome, Business User!</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <p className="text-lg font-medium mb-2">Company Name: {buiss.name}</p>
        <p className="text-lg font-medium mb-2">Email: {buiss.email}</p>
        <p className="text-lg font-medium mb-2">Phone: {buiss.phoneNo}</p>
        <p className="text-lg font-medium mb-2">Address: {buiss.address}</p>
        <p className="text-lg font-medium mb-2">City: {buiss.city}</p>
        <p className="text-lg font-medium mb-2">Pincode: {buiss.pinCode}</p>
        <p className="text-lg font-medium mb-2">
          Type of Product: {buiss.typeofProduct}
        </p>
      </div>
    </div>
  );
};

export default page;
