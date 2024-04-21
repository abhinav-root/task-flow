import { ErrorResponse, SuccessResponse } from "@/types";

export type LoginActionSuccess = SuccessResponse;

export type LoginActionError = Omit<ErrorResponse, "errors"> & {
  errors: {
    email?: string;
    password?: string;
    root?: string;
  };
};

export type LoginActionReturnType = LoginActionSuccess | LoginActionError;
