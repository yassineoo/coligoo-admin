import { z } from "zod";

export const developmentSchema = z.object({
  secretApiKeys: z.object({
    liveEnvironment: z
      .string()
      .min(1, "Live environment secret key is required"),
    testEnvironment: z
      .string()
      .min(1, "Test environment secret key is required"),
  }),
  publishableApiKeys: z.object({
    liveEnvironment: z
      .string()
      .min(1, "Live environment publishable key is required"),
    testEnvironment: z
      .string()
      .min(1, "Test environment publishable key is required"),
  }),
});

export type DevelopmentFormData = z.infer<typeof developmentSchema>;
