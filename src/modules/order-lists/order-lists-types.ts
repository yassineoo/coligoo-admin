export interface Order {
  id: string;
  date: string;
  tracking: string;
  client: string;
  contact: string;
  wilaya: string;
  address: string;
  hub: string;
  order: string;
  totalPrice: string;
  delivery: string;
  procedure: string;
  condition: "delivered" | "pending" | "cancelled" | "processing";
}

export type OrderCondition =
  | "delivered"
  | "pending"
  | "cancelled"
  | "processing";
