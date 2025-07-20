export type Vendor = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  storeName: string;
  hub: string;
  status: "active" | "inactive" | "pending";
};
