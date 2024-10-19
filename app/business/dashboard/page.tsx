import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BusinessDashboard = async () => {
  const session = await auth();
  const business = await prisma.business.findUnique({
    where: { email: session?.user.email! },
  });

  if (!business) redirect("/");

  // Fetch listed products and orders from the database
  const listedProducts = await prisma.resource.findMany({
    where: { productType: business.typeofProduct },
  });

  const orders = await prisma.order.findMany({
    where: { recId: session?.user.email! },
    include: { resource: true },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {business.name}!</h1>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${business.name}`}
          />
          <AvatarFallback>{business.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span>{business.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span>{business.phoneNo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 opacity-70" />
              <span>
                {business.address}, {business.city}, {business.pinCode}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 opacity-70" />
              <span>Product Type: {business.typeofProduct}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Available Resources</span>
              <Badge>{listedProducts.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Orders</span>
              <Badge variant="secondary">
                {
                  orders.filter((order) => order.status === "In Progress")
                    .length
                }
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Completed Orders</span>
              <Badge variant="secondary">
                {orders.filter((order) => order.status === "Completed").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={"/resource"}>
              <Button variant="outline" className="w-full">
                Browse Available Resources
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              View Pending Orders
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Resources</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Recyclable Resources</CardTitle>
              <CardDescription>
                Resources matching your product type that are available for
                ordering
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                                <Badge variant="secondary">
                                  {product.status}
                                </Badge>
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track the orders you've placed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <Package className="h-6 w-6 opacity-70" />
                    <div className="flex-1">
                      <p>Product Title: {order.resource.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {order.status} | Pickup on{" "}
                        {new Date(order.pickupDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price: {order.price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Note: {order.note}
                      </p>
                    </div>
                    <div>
                      <img
                        src={order.resource.image || ""}
                        className="w-24 h-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;
