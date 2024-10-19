import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/prisma/prisma";
import { Mail, MapPin, Package, Phone, Recycle, User } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import PlaceOrder from "./PlaceOrder";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ResourceDetailsPage = async ({
  searchParams,
}: {
  searchParams: { rId: string };
}) => {
  const resourceId = searchParams.rId;
  const session = await auth();

  if (!resourceId) {
    const business = await prisma.business.findUnique({
      where: { email: session?.user.email! },
    });
    const listedProducts = await prisma.resource.findMany({
      where: { productType: business?.typeofProduct },
    });

    return (
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Type</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Status</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {listedProducts
            .filter((p) => p.status === "pending")
            .map((product) => (
              <tr key={product.id}>
                <td colSpan={5} className="p-0">
                  <Link
                    href={`/resource?rId=${product.id}`}
                    className="block hover:bg-gray-100 transition-colors"
                  >
                    <div className="py-2 px-4 grid grid-cols-5 items-center">
                      <span>{product.name}</span>
                      <span>{product.productType}</span>
                      <span>{product.quantity}</span>
                      <span>
                        <Badge variant="secondary">{product.status}</Badge>
                      </span>
                      <span>
                        <Button size="sm">View Details</Button>
                      </span>
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { individual: true },
  });

  if (!resource) {
    notFound();
  }

  const indi = await prisma.individual.findUnique({
    where: { email: session?.user.email! },
  });

  const buis = await prisma.business.findUnique({
    where: { email: session?.user.email! },
  });

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

      {buis && (
        <PlaceOrder
          resourceId={resourceId}
          proId={resource.providerEmail}
          recId={session?.user.email!}
        />
      )}
    </div>
  );
};

export default ResourceDetailsPage;
