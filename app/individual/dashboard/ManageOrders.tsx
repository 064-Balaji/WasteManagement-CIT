"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

const ManageOrders = ({
  orders,
  handleAccept,
}: {
  orders: any;
  handleAccept: (oId: string) => void;
}) => {
  return (
    <TabsContent value="orders">
      <Card>
        <CardHeader>Manage your orders</CardHeader>
        <CardContent>
          {orders.map((order: any) => (
            <div key={order.id} className="flex justify-between px-8">
              <div className="flex flex-col">
                <p>Receiver Name: {order.receiver.name}</p>
                <p>
                  Pickup Date: {new Date(order.pickupDate).toLocaleDateString()}
                </p>
                <p>Quantity: {order.resource.quantity}</p>
              </div>
              <img src={order.resource.image || ""} className="h-20 w-20" />
              <Button
                onClick={() => handleAccept(order.id)}
                disabled={order.status === "Accepted"} // Disable if already accepted
              >
                {order.status === "Accepted" ? "Accepted" : "Accept Order"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ManageOrders;
