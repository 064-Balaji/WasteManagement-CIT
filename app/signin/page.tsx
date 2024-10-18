import SigninBtn from "./SigninBtn";
import SigninComp from "./SigninComp";
import SignupComp from "./SignupComp";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "server-only";
import { Separator } from "@/components/ui/separator";

const Signin = async () => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="flex flex-col gap-4 py-8 items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Waste Management</h1>
      <p className="text-lg text-muted-foreground">
        Turn your useless products into valuable resource for someone
      </p>

      <div className="w-full max-w-md md:max-w-lg mx-5 flex flex-col justify-center">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="w-full flex justify-center">
            <TabsTrigger value="signin" className="w-1/2">
              Signin
            </TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SigninComp />
          </TabsContent>
          <TabsContent value="signup">
            <SignupComp />
          </TabsContent>
        </Tabs>

        {/* Separator from ShadCN */}
        <Separator className="my-4" />

        {/* Signin button */}
        <SigninBtn />
      </div>
    </div>
  );
};

export default Signin;
