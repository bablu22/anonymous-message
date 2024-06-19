import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string({
      required_error: "Please enter a message.",
    })
    .min(10, { message: "Content must be at least 10 characters." })
    .max(300, { message: "Content must not be longer than 300 characters." }),
});
