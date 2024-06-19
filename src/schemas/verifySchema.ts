import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string({
      required_error: "Please enter the verification code",
      invalid_type_error: "Invalid verification code",
    })
    .length(6, "Verification code must be 6 digits"),
});
