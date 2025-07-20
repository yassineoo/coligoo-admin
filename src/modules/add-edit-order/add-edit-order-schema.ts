import { z } from "zod";

export type OrderData = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber01: string;
  phoneNumber02: string;
  commune: string;
  wilaya: string;
  fullAddress: string;
  product: string;
  note: string;
  orderType: "stopdesk" | "exchange";
  returnFees: number;
  deliveryCosts: number;
  subtotal: number;
  totalToCollect: number;
};

export const addEditOrderSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phoneNumber01: z
    .string()
    .min(1, "Phone number 01 is required")
    .regex(/^[+]?[\d\s\-()]+$/, "Invalid phone number format"),
  phoneNumber02: z.string().optional(),
  commune: z.string().min(1, "Commune is required"),
  wilaya: z.string().min(1, "Wilaya is required"),
  fullAddress: z
    .string()
    .min(1, "Full address is required")
    .min(10, "Address must be at least 10 characters"),
  product: z.string().min(1, "Product is required"),
  note: z.string().optional(),
  orderType: z.enum(["stopdesk", "exchange"], {
    required_error: "Order type is required",
  }),
  returnFees: z.number().min(0, "Return fees must be 0 or greater"),
  deliveryCosts: z.number().min(0, "Delivery costs must be 0 or greater"),
  subtotal: z.number().min(0, "Subtotal must be 0 or greater"),
  totalToCollect: z.number().min(0, "Total to collect must be 0 or greater"),
});

export type AddEditOrderFormData = z.infer<typeof addEditOrderSchema>;
