import { z } from "zod";

export type ModeratorData = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  permissions: string[];
};

const baseModeratorSchema = z.object({
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
  permissions: z
    .array(z.string())
    .min(1, "At least one permission is required"),
});

export const addEditModeratorSchema = baseModeratorSchema
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

export type AddEditModeratorFormData = z.infer<typeof addEditModeratorSchema>;

// For editing, password fields are optional
export const editModeratorSchema = baseModeratorSchema
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type EditModeratorFormData = z.infer<typeof editModeratorSchema>;
