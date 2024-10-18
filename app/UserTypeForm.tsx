"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const UserTypeForm = ({
  handleSubmit,
}: {
  handleSubmit: (formData: any) => void;
}) => {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    address: "",
    email: "",
    city: "",
    pinCode: "",
    typeofProduct: "",
    companyName: "",
    companyEmail: "",
    companyPhoneNo: "",
    companyAddress: "",
    companyCity: "",
    companyPinCode: "",
    businessProductType: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ ...formData, userType });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-8 py-6 bg-gray-50 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Complete Your Profile
      </h2>

      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <Label htmlFor="userType" className="font-medium text-gray-700">
            Select the User Type
          </Label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="mt-2 w-full border-gray-300">
              <SelectValue placeholder="Select a User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userType === "Individual" && (
          <>
            <div>
              <Label htmlFor="name" className="font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNo" className="font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                type="text"
                placeholder="Your Phone Number"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="address" className="font-medium text-gray-700">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="city" className="font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="pinCode" className="font-medium text-gray-700">
                Pin Code
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                type="text"
                placeholder="Pin Code"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
          </>
        )}

        {userType === "Business" && (
          <>
            <div>
              <Label
                htmlFor="companyName"
                className="font-medium text-gray-700"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Your Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="companyPhoneNo"
                className="font-medium text-gray-700"
              >
                Company Phone Number
              </Label>
              <Input
                id="companyPhoneNo"
                name="companyPhoneNo"
                type="text"
                placeholder="Company Phone Number"
                value={formData.companyPhoneNo}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="companyAddress"
                className="font-medium text-gray-700"
              >
                Company Address
              </Label>
              <Input
                id="companyAddress"
                name="companyAddress"
                type="text"
                placeholder="Company Address"
                value={formData.companyAddress}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="companyCity"
                className="font-medium text-gray-700"
              >
                Company City
              </Label>
              <Input
                id="companyCity"
                name="companyCity"
                type="text"
                placeholder="Company City"
                value={formData.companyCity}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="companyPinCode"
                className="font-medium text-gray-700"
              >
                Company Pin Code
              </Label>
              <Input
                id="companyPinCode"
                name="companyPinCode"
                type="text"
                placeholder="Company Pin Code"
                value={formData.companyPinCode}
                onChange={handleInputChange}
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="businessProductType"
                className="font-medium text-gray-700"
              >
                Type of Product
              </Label>
              <Select
                name="businessProductType"
                value={formData.businessProductType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessProductType: value,
                  }))
                }
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
          </>
        )}

        <Button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UserTypeForm;
