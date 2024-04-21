import { ErrorResponse, SuccessResponse } from "@/types";
import { z } from "zod";

export const sendVerificationCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email")
    .max(255, "Email cannot be more than 255 characters"),
});

export type SendVerificationCodeSchema = z.infer<
  typeof sendVerificationCodeSchema
>;

export const submitCodeSchema = z.object({
  code: z.string().length(8, "Verification code should be 8 digits"),
});

export type SubmitCodeSchema = z.infer<typeof submitCodeSchema>;

type VerifyCodeActionError = Omit<ErrorResponse, "errors"> & {
  errors: {
    root?: string;
  };
};

export type VerifyCodeActionReturnType =
  | SuccessResponse
  | VerifyCodeActionError;
