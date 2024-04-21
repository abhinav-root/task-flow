"use server";

import { generateRandomString, alphabet } from "oslo/crypto";
import { TimeSpan, createDate } from "oslo";

import {
  SendVerificationCodeSchema,
  sendVerificationCodeSchema,
} from "../_schemas";
import { SendVerificationCodeActionReturnType } from "../types";
import prisma from "@/helpers/db";
import { sendVerificationCodeLimiter } from "@/helpers/rate-limiter";
import { headers } from "next/headers";

export async function sendVerificationCodeAction(
  values: SendVerificationCodeSchema
): Promise<SendVerificationCodeActionReturnType> {
  try {
    const ip = IP();
    const { success } = await sendVerificationCodeLimiter.limit(ip);
    if (!success) {
      return {
        success: false,
        errors: {
          root: "You have attempted the verification code too many times. Please try again after some time.",
        },
      };
    }
    const validationResult = sendVerificationCodeSchema.safeParse(values);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return { success: false, errors: { email: fieldErrors?.email?.[0] } };
    }

    const user = await prisma.user.findUnique({
      where: { email: values.email },
    });
    if (user) {
      const code = await generateEmailVerificationCode(user.id);
      console.log({ code });
    }

    return { success: true, message: "Verification Code Sent" };
  } catch (err) {
    console.log(err);
    return { success: false, errors: { root: "Internal Server Error" } };
  }
}

async function generateEmailVerificationCode(userId: string): Promise<string> {
  const code = generateRandomString(8, alphabet("0-9"));
  await prisma.emailVerification.upsert({
    where: {
      userId,
    },
    update: {
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
    create: {
      userId,
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
  });
  return code;
}

function IP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
