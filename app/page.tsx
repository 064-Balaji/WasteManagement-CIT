import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");
  return (
    <div>
      <Button>Hello</Button>
    </div>
  );
}
