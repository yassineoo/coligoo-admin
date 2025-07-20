export interface Hub {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  fullAddress: string;
  status: "active" | "inactive";
}

export type HubStatus = "active" | "inactive";
