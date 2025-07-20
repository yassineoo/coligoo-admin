export interface DeliveryMan {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  status: "active" | "inactive";
}

export type DeliveryManStatus = "active" | "inactive";
