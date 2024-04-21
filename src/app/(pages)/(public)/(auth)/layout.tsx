import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Fragment } from "react";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <div className="px-4 max-w-7xl mx-auto">
        <div className="pt-2 text-right">
          <ThemeSwitcher />
        </div>
        <div className="mb-1 dark:text-gray-200">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="font-semibold">Home</span>
            </Link>
          </Button>
        </div>
      </div>
      {children}
    </Fragment>
  );
}
