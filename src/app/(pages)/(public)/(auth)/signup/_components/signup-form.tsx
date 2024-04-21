"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

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
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { signupSchema, SignupSchema } from "../_schemas";
import { signupAction } from "../_actions";
import LinkToVerifyEmail from "./link-to-verify-email";

export default function SignupForm() {
  const [registeredEmail, setRegisteredEmail] = useState("");
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const {
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = form;

  async function onSubmit(values: SignupSchema) {
    const response = await signupAction(values);
    if (!response.success) {
      const { username, email, root, password } = response.errors;
      username && setError("username", { message: username });
      email && setError("email", { message: email });
      password && setError("password", { message: password });
      root && setError("root", { message: root });
    } else {
      reset();
      setRegisteredEmail(response.data.email);
      toast.success("Your account has been created successfully", {
        position: "bottom-center",
      });
    }
  }

  if (registeredEmail) {
    return <LinkToVerifyEmail registeredEmail={registeredEmail} />;
  }

  return (
    <>
      <h1 className="text-center text-2xl font-semibold mb-10 dark:text-gray-200">
        Create your account here
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 dark:text-gray-200">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Username should contain alphabets only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.root && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>{errors.root?.message}</AlertTitle>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </form>
      </Form>
    </>
  );
}
