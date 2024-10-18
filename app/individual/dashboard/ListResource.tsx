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
import axios from "axios";

type FormData = {
  resourceName: string;
  description: string;
  quantity: number;
  productType: string;
  imageUrl: string | null;
};

export default function ListResource() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    resourceName: "",
    description: "",
    quantity: 1,
    productType: "",
    imageUrl: null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change for product type
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productType: value }));
  };

  // Handle file input change and show preview
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

  // Upload image to Supabase storage and get public URL
  const handleImageUpload = async () => {
    if (!selectedImage) return null;

    setIsUploading(true);
    const fileName = `${Date.now()}_${selectedImage.name}`;
    const { data: uploadData, error } = await supabase.storage
      .from("test")
      .upload(fileName, selectedImage);

    if (error) {
      setNotification({ type: "error", message: "Error uploading image." });
      setIsUploading(false);
      return null;
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("test")
      .getPublicUrl(fileName);

    setIsUploading(false);

    console.log(publicUrlData?.publicUrl);
    return publicUrlData?.publicUrl || null;
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload the image first, if any
    const imageUrl = await handleImageUpload();

    // Ensure that the image URL is captured before proceeding
    if (!imageUrl) {
      setNotification({ type: "error", message: "Image upload failed." });
      return;
    }

    // Prepare the form data with the new imageUrl
    const updatedFormData = { ...formData, imageUrl };

    // Submit updated form data
    try {
      await axios.post("/api/resource", updatedFormData);
      setNotification({
        type: "success",
        message: "Resource listed successfully.",
      });
      resetForm();
    } catch (error) {
      setNotification({ type: "error", message: "Error listing resource." });
    }
  };

  // Reset form data and image
  const resetForm = () => {
    setFormData({
      resourceName: "",
      description: "",
      quantity: 1,
      productType: "",
      imageUrl: null,
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
            {/* Resource Name */}
            <FormField
              label="Resource Name/Title"
              id="resourceName"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleInputChange}
              placeholder="Enter resource name"
              required
            />

            {/* Description */}
            <FormField
              label="Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter resource description"
              required
              isTextarea
            />

            {/* Quantity */}
            <FormField
              label="Quantity (No, Kg)"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              required
              type="number"
            />

            {/* Product Type */}
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

            {/* Image Upload */}
            <ImageUploader
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              onFileChange={handleFileChange}
              onRemove={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              fileInputRef={fileInputRef}
              isUploading={isUploading}
            />

            {/* Form Buttons */}
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

      {/* Notification */}
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

// Form Field Component
function FormField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  isTextarea = false,
}: {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  isTextarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextarea ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <Input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          required={required}
        />
      )}
    </div>
  );
}

// Image Uploader Component
function ImageUploader({
  selectedImage,
  imagePreview,
  onFileChange,
  onRemove,
  fileInputRef,
  isUploading,
}: {
  selectedImage: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>Image Upload</Label>
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Selected image"
            className="w-full h-32 object-cover rounded-md"
          />
          <Button
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
      )}
    </div>
  );
}
