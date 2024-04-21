import { validateRequest } from "@/lucia";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (user) {
    redirect(`/projects`);
  }
  return <>{children}</>;
}
