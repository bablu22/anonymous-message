import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string({
    required_error: "Please provide an email or username",
    invalid_type_error: "Email or username must be a string",
  }),
  password: z
    .string({
      required_error: "Please provide a password",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters"),
});
