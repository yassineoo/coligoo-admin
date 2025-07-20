export interface Transaction {
  id: string;
  date: string;
  hour: string;
  transactionType: TransactionType;
  amount: number;
  initiator: string;
  beneficiary: string;
  description: string;
  status: TransactionStatus;
}

export type TransactionType =
  | "client-order-payment"
  | "platform-commission"
  | "seller-payout"
  | "hub-delivery-payment";

export type TransactionStatus = "successful" | "failure" | "in-progress";
