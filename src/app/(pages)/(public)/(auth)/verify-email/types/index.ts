import { ErrorResponse, SuccessResponse } from "@/types";

type SendVerificationCodeSuccess = SuccessResponse;

type SendVerificationCodeError = Omit<ErrorResponse, "errors"> & {
  errors: {
    email?: string;
    root?: string;
  };
};

export type SendVerificationCodeActionReturnType =
  | SendVerificationCodeSuccess
  | SendVerificationCodeError;
