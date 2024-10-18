import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const resourcesList = await prisma.resource.findMany({
    where: { providerEmail: session?.user.email! },
  });

  if (!resourcesList) return null;

  return NextResponse.json(resourcesList);
}

type FormData = {
  resourceName: string;
  description: string;
  productType: string;
  quantity: number;
  imageUrl: string;
  providerEmail: string;
};

export async function POST(req: NextRequest) {
  const session = await auth();
  const {
    description,
    imageUrl,
    resourceName,
    productType,
    quantity,
  }: FormData = await req.json();
  console.log(resourceName, description);
  const res = await prisma.resource.create({
    data: {
      name: resourceName,
      description,
      productType,
      quantity: Number(quantity),
      image: imageUrl,
      providerEmail: session?.user.email!,
      status: "pending",
    },
  });
  console.log(res);
  return NextResponse.json(res);
}
