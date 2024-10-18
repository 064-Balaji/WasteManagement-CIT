"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import supabase from "@/app/_components/supabase";

export default function ListResource() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    resourceName: "",
    description: "",
    resourceLink: 1,
    productType: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, productType: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setNotification({
          type: "error",
          message: "Please upload a valid image file.",
        });
      }
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;
    setIsUploading(true);
    const { data: uploadData, error } = await supabase.storage
      .from("test")
      .upload(`${selectedImage.name}`, selectedImage);
    setIsUploading(false);
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    return uploadData?.path || null;
  };

  const resetForm = () => {
    setFormData({
      resourceName: "",
      description: "",
      resourceLink: 1,
      productType: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setNotification(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Resource
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>
              Fill in the details below to list a new resource.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resourceName">Resource Name/Title</Label>
              <Input
                id="resourceName"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleInputChange}
                placeholder="Enter resource name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter resource description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity (No, Kg)</Label>
              <Input
                id="resourceLink"
                name="resourceLink"
                value={formData.resourceLink}
                onChange={handleInputChange}
                placeholder="Enter Quantity"
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select
                name="productType"
                onValueChange={handleSelectChange}
                value={formData.productType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="e-waste">E-Waste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Add Image"}
                </Button>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {notification && (
        <Alert
          variant={notification.type === "success" ? "default" : "destructive"}
          className="mt-4"
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {notification.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
