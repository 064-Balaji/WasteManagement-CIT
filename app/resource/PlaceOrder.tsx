"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Update the import based on your project structure
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PlaceOrder = ({
  resourceId,
  proId,
  recId,
}: {
  resourceId: string;
  proId: string;
  recId: string;
}) => {
  // State variables to capture form input
  const [pickupDate, setPickupDate] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/orders", {
        resourceId,
        pickupDate,
        offerPrice,
        additionalNotes,
        proId,
        recId,
      });

      // Reset form and show success message
      setSuccessMessage("Order placed successfully!");
      setErrorMessage("");
      setPickupDate("");
      setOfferPrice("");
      setAdditionalNotes("");
    } catch (error) {
      setErrorMessage("Error placing order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Place Order</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Place Your Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && <p className="text-green-600">{successMessage}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <div>
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input
              id="pickupDate"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="offerPrice">Offer Price</Label>
            <Input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any extra details (optional)"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Place Order"}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceOrder;
