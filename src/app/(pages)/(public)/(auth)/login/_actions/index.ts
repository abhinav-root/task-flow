"use server";

import { Argon2id } from "oslo/password";

import prisma from "@/helpers/db";

export async function loginAction() {
  const user = await prisma.user.findUnique({
    where: { email: "" },
    select: { id: true, email: true, password: true, isEmailVerified: true },
  });
  if (!user) {
    // "inalid email or password"
    return "";
  }

  const isCorrectPassword = await new Argon2id().verify("", user.password);
  if (!user.isEmailVerified) {
    return "";
  }
}
