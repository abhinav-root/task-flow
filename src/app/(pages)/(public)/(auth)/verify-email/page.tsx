"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  SendVerificationCodeSchema,
  SubmitCodeSchema,
  sendVerificationCodeSchema,
  submitCodeSchema,
} from "./_schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendVerificationCodeAction, verifyCodeAction } from "./_actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const form = useForm<SendVerificationCodeSchema>({
    resolver: zodResolver(sendVerificationCodeSchema),
    defaultValues: {
      email: email ?? "",
    },
  });

  async function onSubmit(values: SendVerificationCodeSchema) {
    const response = await sendVerificationCodeAction(values);
    if (!response.success) {
      const message = response.errors.root ?? "Some error occured";
      toast.error(message, { position: "bottom-center" });
      return;
    }
    setIsCodeSent(true);
    toast.success("Verification Code Sent", { position: "bottom-center" });
  }

  return (
    <div>
      <main>
        <div className="max-w-96 mx-auto border rounded-md shadow-md px-6 py-10 dark:border-gray-500 dark:shadow-gray-500 dark:shadow-md">
          <h1 className="text-center font-bold text-2xl text-gray-700 mb-2 dark:text-gray-100">
            Verify your email address
          </h1>
          {!isCodeSent ? (
            <div>
              <div className="mb-10">
                <p className="text-gray-600 text-sm text-center dark:text-gray-300">
                  To continue using Task Flow, please verify your email address
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your registered email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Send Verification Code
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <EnterVerificationCode email={form.getValues("email")} />
          )}
        </div>
      </main>
    </div>
  );
}

function EnterVerificationCode({ email }: { email: string }) {
  const TIMER = 30;
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(TIMER);
  const form = useForm<SubmitCodeSchema>({
    resolver: zodResolver(submitCodeSchema),
    defaultValues: {
      code: "",
    },
  });
  const { watch } = form;
  const enteredCode = watch("code");

  async function onSubmit(values: SubmitCodeSchema) {
    const response = await verifyCodeAction(values, email);
    if (!response.success) {
      toast.error(response.errors.root, { position: "bottom-center" });
      return;
    }
    toast.success(response.message, { position: "bottom-center" });
    router.replace("/projects");
  }

  async function resendVerificationCode() {
    const response = await sendVerificationCodeAction({ email });
    if (!response.success) {
      const message = response.errors.root ?? "Some error occured";
      toast.error(message, { position: "bottom-center" });
      return;
    }
    form.reset();
    setDisabled(true);
    setCountdown(TIMER);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setDisabled(false);
        }
        return prevCountdown - 1;
      });
    }, 1000);
    toast.success("Verification Code Sent", { position: "bottom-center" });
  }

  useEffect(() => {
    if (countdown === 0) {
      setDisabled(false);
    }
  }, [countdown]);

  return (
    <div>
      <p className="text-sm font-bold text-center mt-10 text-gray-600 mb-10 dark:text-gray-200">
        A verification code has been sent to {email}
      </p>
      <div className="w-full">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Please check your inbox and enter the verification code below to
          verify your email address. This code will expire in 15 minutes
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>One-Time Password</FormLabel> */}
                  <FormControl>
                    <InputOTP maxLength={8} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="dark:text-gray-300">
                    Please enter the 8 digit code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                !(enteredCode.length === 8) || form.formState.isSubmitting
              }
            >
              Continue
            </Button>
          </form>
        </Form>
        <form action={resendVerificationCode}>
          <div className="flex items-center">
            <Button
              variant="link"
              className="my-2"
              type="submit"
              disabled={disabled}
            >
              Resend
            </Button>
            {disabled && (
              <span className="text-sm text-gray-700">
                in <span className="font-bold px-1">{countdown}</span>seconds
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
