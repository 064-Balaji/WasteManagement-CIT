import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import UserTypeForm from "./UserTypeForm";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const indi = await prisma.individual.findUnique({
    where: { email: session.user.email! },
  });

  const buss = await prisma.business.findUnique({
    where: { email: session.user.email! },
  });

  if (indi) redirect("/individual/dashboard");
  if (buss) redirect("/business/dashboard");

  const handleFormSubmit = async (formData: any) => {
    "use server";

    if (!formData) return "All fields are required";

    const { userType } = formData;

    if (userType === "Individual") {
      await prisma.individual.create({
        data: {
          name: formData.name,
          phoneNo: formData.phoneNo,
          address: formData.address,
          email: session.user.email!,
          city: formData.city,
          pinCode: formData.pinCode,
        },
      });
    }

    if (userType === "Business") {
      await prisma.business.create({
        data: {
          name: formData.companyName,
          email: session.user.email!,
          phoneNo: formData.companyPhoneNo,
          address: formData.companyAddress,
          city: formData.companyCity,
          pinCode: formData.companyPinCode,
          typeofProduct: formData.businessProductType,
        },
      });
    }

    redirect("/dashboard");
  };

  return <UserTypeForm handleSubmit={handleFormSubmit} />;
}
