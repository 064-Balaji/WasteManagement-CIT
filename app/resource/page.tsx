import React from "react";
import { prisma } from "@/prisma/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recycle, Package, User, Phone, Mail, MapPin } from "lucide-react";

const ResourceDetailsPage = async ({
  searchParams,
}: {
  searchParams: { rId: string };
}) => {
  const resourceId = searchParams.rId;

  if (!resourceId) {
    notFound();
  }

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { individual: true },
  });

  if (!resource) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{resource.name}</CardTitle>
          <CardDescription>Resource Details</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square relative">
              <Image
                src={resource.image || "/placeholder-image.jpg"}
                alt={resource.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{resource.productType}</Badge>
              <Badge
                variant={
                  resource.status === "Pending" ? "secondary" : "success"
                }
              >
                {resource.status}
              </Badge>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p>{resource.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Quantity: {resource.quantity}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5" />
              <span>Recyclable: {"Yes"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{resource?.individual?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>{resource?.individual?.phoneNo}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>{resource?.individual?.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>
              {resource?.individual?.address}, {resource?.individual?.city},{" "}
              {resource?.individual?.pinCode}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Contact Provider</Button>
        <Button>Place Order</Button>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;
