export type SuccessResponse = {
  success: true;
  message: string;
  data?: any;
};

export type ErrorResponse = {
  success: false;
  errors: any;
};
