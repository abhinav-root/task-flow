import Link from "next/link";

import { Button } from "@/components/ui/button";

type LinkToVerifyEmailProps = {
  registeredEmail: string;
};

export default function LinkToVerifyEmail({
  registeredEmail,
}: LinkToVerifyEmailProps) {
  return (
    <div className="text-center py-2">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-10">
        Please verify your email
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 px-4">
        In order to complete your registration, you need to verify your email
        address
      </p>
      <Button asChild className="w-full">
        <Link href={`/verify-email?email=${registeredEmail}`}>
          Verify Email
        </Link>
      </Button>
    </div>
  );
}
