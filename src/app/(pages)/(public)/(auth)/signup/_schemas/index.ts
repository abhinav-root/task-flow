import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(RegExp(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/), "Invalid username")
    .min(3, "Username must be minimum 3 characters long")
    .max(50, "Username can be maximum 50 characters long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email")
    .max(255, "Email cannot be more than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be minimum 8 characters long")
    .max(50, "Password can be maximum 50 characters long")
    .refine(
      (password) => !(password.startsWith(" ") || password.endsWith(" ")),
      { message: "Password cannot have any leading or trailing spaces" }
    ),
});

export type SignupSchema = z.infer<typeof signupSchema>;
