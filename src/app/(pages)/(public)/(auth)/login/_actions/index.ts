"use server";

import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";

import prisma from "@/helpers/db";
import { LoginActionReturnType } from "../_types";
import { LoginSchema, loginSchema } from "../_schemas";
import { lucia } from "@/lucia";

export async function loginAction(
  values: LoginSchema
): Promise<LoginActionReturnType> {
  const validationResult = loginSchema.safeParse(values);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        email: fieldErrors?.email?.[0],
        password: fieldErrors?.password?.[0],
      },
    };
  }

  const { email, password } = validationResult.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, isEmailVerified: true },
  });
  if (!user) {
    return { success: false, errors: { root: "Invalid email or password" } };
  }

  if (!user.isEmailVerified) {
    return {
      success: false,
      errors: { root: "Please verify your email address to continue" },
    };
  }

  const isPasswordCorrect = await new Argon2id().verify(
    user.password,
    password
  );
  if (!isPasswordCorrect) {
    return { success: false, errors: { root: "Invalid email or password" } };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { success: true, message: "Logged in" };
}
