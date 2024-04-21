import { ErrorResponse, SuccessResponse } from "@/types";

export type SignupActionSuccess = Omit<SuccessResponse, "data"> & {
  data: { id: string; username: string; email: string };
};

export type SignupActionError = Omit<ErrorResponse, "errors"> & {
  errors: {
    username?: string;
    email?: string;
    password?: string;
    root?: string;
  };
};
