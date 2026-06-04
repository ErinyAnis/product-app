import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .trim()
    .min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;