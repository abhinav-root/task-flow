"use server";

import { headers } from "next/headers";

import prisma from "./db";

export async function IP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}
