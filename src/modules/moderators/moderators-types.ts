export interface Moderator {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  permissions: string[];
  status: "active" | "blocked";
}

export interface ModeratorsTableProps {
  data: Moderator[];
}
