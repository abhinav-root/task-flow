"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema, loginSchema } from "../_schemas";
import { loginAction } from "../_actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginWithEmail = () => {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = form;

  const email = watch("email");

  async function onSubmit(values: LoginSchema) {
    clearErrors();
    const response = await loginAction(values);
    if (!response.success) {
      const { email, password, root } = response.errors;
      email && setError("email", { message: email });
      password && setError("password", { message: password });
      root && setError("root", { message: root });
      return;
    }
    toast.success(response.message, { position: "bottom-center" });
    router.replace("/projects");
  }

  return (
    <Form {...form}>
      <h1 className="text-2xl text-center font-bold text-gray-700 dark:text-gray-200">
        Login here
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 dark:text-gray-200"
      >
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
        {errors?.root?.message && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>{errors.root?.message}</AlertTitle>
            {errors?.root?.message?.includes("verify your email") && (
              <AlertDescription>
                <Link
                  href={`/verify-email?email=${email}`}
                  className="underline"
                >
                  Click here to verify email
                </Link>
              </AlertDescription>
            )}
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
        <p className="text-center text-gray-600 text-sm dark:text-gray-300">Don&apos;t have an account? <Link href="/signup" className="hover:underline text-blue-500">Signup</Link></p>
      </form>
    </Form>
  );
};

export default LoginWithEmail;
