"use server";

import { Argon2id } from "oslo/password";

import prisma from "@/helpers/db";
import { SignupSchema, signupSchema } from "../_schemas";
import { SignupActionError, SignupActionSuccess } from "../types";

type SignupActionReturnType = SignupActionSuccess | SignupActionError;

export async function signupAction(
  values: SignupSchema
): Promise<SignupActionReturnType> {
  try {
    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const { email, password, username } = result.error.flatten().fieldErrors;
      return {
        success: false,
        errors: {
          username: username?.[0],
          email: email?.[0],
          password: password?.[0],
        },
      };
    }

    const { username, email, password } = result.data;
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return {
        success: false,
        errors: {
          root: "This email is already registered. Please use a different email to sign up.",
        },
      };
    }

    const hashedPassword = await new Argon2id().hash(password);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
      select: { id: true, username: true, email: true },
    });

    return {
      success: true,
      data: user,
      message: "Account Created Successfully",
    };
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      errors: { root: err?.message ?? "Internal Server Error" },
    };
  }
}
