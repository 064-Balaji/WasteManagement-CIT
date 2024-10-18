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
  name: string;
  description: string;
  productType: string;
  quantity: number;
  image: string[];
  providerEmail: string;
};

export async function POST(req: NextRequest) {
  const {
    description,
    image,
    name,
    productType,
    providerEmail,
    quantity,
  }: FormData = await req.json();
  const res = await prisma.resource
    .create({
      data: {
        name,
        description,
        productType,
        quantity,
        image,
        providerEmail,
        status: "pending",
      },
    })
    .then(() => console.log("Listed Successfully"));

  console.log(res);
}
