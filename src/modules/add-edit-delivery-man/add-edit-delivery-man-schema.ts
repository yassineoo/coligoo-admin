import { z } from "zod";

export type DeliveryManData = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  dateOfBirth: string;
};

const baseDeliveryManSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-()]+$/, "Invalid phone number format"),
  emailAddress: z
    .string()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const addEditDeliveryManSchema = baseDeliveryManSchema
  .extend({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AddEditDeliveryManFormData = z.infer<
  typeof addEditDeliveryManSchema
>;
