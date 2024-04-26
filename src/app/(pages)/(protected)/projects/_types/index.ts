import { ErrorResponse, SuccessResponse } from "@/types";

type CreateProjectSuccess = SuccessResponse;

type CreateProjectError = Omit<ErrorResponse, "errors"> & {
  errors: {
    projectName?: string;
    boardName?: string;
    root?: string;
  };
};

export type CreateProjectReturnType = CreateProjectSuccess | CreateProjectError;
