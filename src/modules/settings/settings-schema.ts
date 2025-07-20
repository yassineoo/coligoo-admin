import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  emailAddress: z.string().email("Please enter a valid email address"),
});

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const profileImageSchema = z.object({
  profileImage: z.instanceof(File).optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type ProfileImageFormData = z.infer<typeof profileImageSchema>;
