"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import React from "react";

const OrderHistory = ({
  orders,
  handleUpdate,
}: {
  orders: any;
  handleUpdate: (oId: string) => void;
}) => {
  return (
    <TabsContent value="orders">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Track the orders you've placed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order: any) => (
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
                  <img src={order.resource.image || ""} className="w-24 h-24" />
                </div>
                <Button
                  onClick={() => handleUpdate(order.id)}
                  disabled={order.status !== "Accepted"} // Disable if already accepted
                >
                  {(order.status === "Accepted" && "Pickup Done") ||
                    (order.status === "Completed" && "Completed") ||
                    "Not yet Accepted"}
                  {}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default OrderHistory;
