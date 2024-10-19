import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import ListResource from "./ListResource";
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
import { CalendarDays, MapPin, Phone, Mail, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IndividualDashboard = async () => {
  const session = await auth();
  const individual = await prisma.individual.findUnique({
    where: { email: session?.user.email! },
    include: {
      resource: true,
    },
  });

  if (!individual) redirect("/");

  const listedResources = individual.resource || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {individual.name}!</h1>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${individual.name}`}
          />
          <AvatarFallback>{individual.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span>{individual.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span>{individual.phoneNo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 opacity-70" />
              <span>
                {individual.address}, {individual.city}, {individual.pinCode}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recycling Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Total Resources Listed</span>
              <Badge>{listedResources.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Collection</span>
              <Badge variant="secondary">
                {listedResources.filter((r) => r.status === "Pending").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Successfully Recycled</span>
              <Badge variant="secondary">
                {listedResources.filter((r) => r.status === "Collected").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ListResource />
            <Button variant="outline" className="w-full">
              View Recycling Tips
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listed" className="w-full">
        <TabsList>
          <TabsTrigger value="listed">Listed Resources</TabsTrigger>
          <TabsTrigger value="history">Recycling History</TabsTrigger>
        </TabsList>
        <TabsContent value="listed">
          <Card>
            <CardHeader>
              <CardTitle>Your Listed Resources</CardTitle>
              <CardDescription>
                Overview of resources you've listed for recycling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Name
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Type
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Quantity
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listedResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 border-b border-gray-300">
                        <Link href={`/resource?rId=${resource.id}`} passHref>
                          {resource.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-300">
                        {resource.productType}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-300">
                        {resource.quantity}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-300">
                        <Badge
                          variant={
                            resource.status === "Collected"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {resource.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recycling History</CardTitle>
              <CardDescription>
                Your contribution to a greener planet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listedResources
                  .filter((r) => r.status === "Collected")
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center space-x-4"
                    >
                      <Recycle className="h-6 w-6 opacity-70" />
                      <div>
                        <p className="font-medium">
                          {resource.name} ({resource.quantity} items)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Collected on {new Date().toLocaleDateString()}
                        </p>
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

export default IndividualDashboard;
