import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    console.log(body);
    const {
      resourceId,
      pickupDate,
      offerPrice,
      additionalNotes,
      proId,
      recId,
    } = body;

    // Validate the required fields
    if (!resourceId || !pickupDate || !offerPrice) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check that offerPrice is a valid number
    const parsedPrice = parseFloat(offerPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { message: "Invalid price value" },
        { status: 400 }
      );
    }

    // Insert the new order into the database using Prisma
    const newOrder = await prisma.order.create({
      data: {
        resId: resourceId, // Assuming resourceId is a valid reference to a resource in your database
        pickupDate: new Date(pickupDate), // Ensure the date is properly formatted
        price: parsedPrice,
        note: additionalNotes || null, // Allow additionalNotes to be optional
        proId,
        recId,
        status: "In Progress",
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "An error occurred while placing the order" },
      { status: 500 }
    );
  }
}
