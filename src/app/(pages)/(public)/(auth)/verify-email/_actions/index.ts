"use server";

import { generateRandomString, alphabet } from "oslo/crypto";
import { TimeSpan, createDate } from "oslo";
import { renderAsync, render } from "@react-email/render";

import {
  SendVerificationCodeSchema,
  SubmitCodeSchema,
  VerifyCodeActionReturnType,
  sendVerificationCodeSchema,
  submitCodeSchema,
} from "../_schemas";
import { SendVerificationCodeActionReturnType } from "../types";
import prisma from "@/helpers/db";
import { sendVerificationCodeLimiter } from "@/helpers/rate-limiter";
import { IP, findUserByEmail } from "@/helpers/actions";
import { lucia } from "@/lucia";
import { cookies } from "next/headers";
import transport from "@/helpers/mailer";
import {
  getEmailVerificationHtml,
  getEmailVerificationText,
} from "@/emails/email-verification";

// Send Verification Code
export async function sendVerificationCodeAction(
  values: SendVerificationCodeSchema
): Promise<SendVerificationCodeActionReturnType> {
  try {
    const ip = await IP();
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
      if (user.isEmailVerified) {
        return {
          success: false,
          errors: {
            root: "Your email is already verified. Please login to continue.",
          },
        };
      }
      const code = await generateEmailVerificationCode(user.id);
      // Send Verification Code to user

      try {
        await sendVerificationCodeViaEmail(user.username, user.email, code);
      } catch (err) {
        return {
          success: false,
          errors: { root: "Failed to send verification code" },
        };
      }
    }

    return { success: true, message: "Verification Code Sent" };
  } catch (err) {
    console.log(err);
    return { success: false, errors: { root: "Internal Server Error" } };
  }
}

// Verify Code
export async function verifyCodeAction(
  values: SubmitCodeSchema,
  email: string
): Promise<VerifyCodeActionReturnType> {
  const validationResult = submitCodeSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      success: false,
      errors: { root: "Verfication Code should be 8 digit numeric code" },
    };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return {
      success: false,
      errors: {
        root: "The code is invalid or expired. Resend the code and try again",
      },
    };
  }

  const emailVerification = await prisma.emailVerification.findUnique({
    where: { userId: user.id },
  });
  if (!emailVerification) {
    return {
      success: false,
      errors: {
        root: "The code is invalid or expired. Resend the code and try again",
      },
    };
  }
  const currentTime = new Date();
  const codeExpirtyTime = new Date(emailVerification.expiresAt);
  const isCodeExpired = currentTime > codeExpirtyTime;
  const isCorrectCode = emailVerification.code === values.code;

  if (isCodeExpired || !isCorrectCode) {
    return {
      success: false,
      errors: {
        root: "The code is invalid or expired. Resend the code and try again",
      },
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true },
  });
  await prisma.emailVerification.delete({ where: { userId: user.id } });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return { success: true, message: "Email verified successfully" };
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

async function sendVerificationCodeViaEmail(
  username: string,
  email: string,
  code: string
) {
  const html = await getEmailVerificationHtml(username, code);
  const text = await getEmailVerificationText(username, code);

  const message = {
    to: email,
    subject: "Task Flow Email Verification Code",
    text,
    html,
  };

  await transport.sendMail(message);
}
