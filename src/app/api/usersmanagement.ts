import { AnyObj } from "./auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function request(path: string, init?: RequestInit) {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers ?? {});
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("app_token")
      : null;
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  if (init && init.body && !(init.body instanceof FormData)) {
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  const ct = res.headers.get("content-type") ?? "";
  let body;
  if (ct.includes("application/json")) {
    body = await res.json().catch(() => null);
  } else {
    const txt = await res.text().catch(() => null);
    body = txt;
  }
  if (!res.ok) throw { status: res.status, statusText: res.statusText, body };
  return body;
}

type UserRole =
  | "client"
  | "vendor"
  | "admin"
  | "hub_admin"
  | "moderator"
  | "hub_employee"
  | "deliveryman";

export interface CreateUserPayload extends AnyObj {
  email: string;
  password: string;
  nom?: string;
  prenom?: string;
  fullName?: string;
  role: UserRole;
  hubId?: number;
  permissions?: string[];
  phoneNumber?: string;
  imgUrl?: string;
  blocked?: boolean;
  deviceToken?: string;
}

export interface UpdateUserPayload extends AnyObj {
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
  fullName?: string;
  role?: UserRole;
  hubId?: number;
  permissions?: string[];
  phoneNumber?: string;
  imgUrl?: string;
  blocked?: boolean;
  deviceToken?: string;
}

export interface UserListParams extends AnyObj {
  search?: string;
  role?: string;
  blocked?: boolean;
  isEmailVerified?: boolean;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: "ASC" | "DESC";
}

export interface UserMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface User extends AnyObj {
  id: number;
  email: string;
  nom?: string | null;
  prenom?: string | null;
  fullName?: string;
  role: UserRole;
  hubId?: number | null;
  permissions?: string[] | null;
  phoneNumber?: string;
  imgUrl?: string | null;
  blocked: boolean;
  deviceToken?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  hubAdmin?: number | null;
}

export interface UserStatistics extends AnyObj {
  totalUsers: number;
  totalAdmins: number;
  totalVendors: number;
  totalClients: number;
  totalDeliverymen: number;
  activeUsers: number;
  blockedUsers: number;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  return request("/api/v1/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAllUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users?${query}`
    : "/api/v1/admin/users";
  return request(url);
}

export async function getAdminUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/admins?${query}`
    : "/api/v1/admin/users/admins";
  return request(url);
}

export async function getHubAdminUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/hub-admins?${query}`
    : "/api/v1/admin/users/hub-admins";
  return request(url);
}

export async function getModeratorUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/moderators?${query}`
    : "/api/v1/admin/users/moderators";
  return request(url);
}

export async function getVendorUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/vendors?${query}`
    : "/api/v1/admin/users/vendors";
  return request(url);
}

export async function getClientUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/clients?${query}`
    : "/api/v1/admin/users/clients";
  return request(url);
}

export async function getDeliverymanUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/deliverymen?${query}`
    : "/api/v1/admin/users/deliverymen";
  return request(url);
}

export async function getHubEmployeeUsers(
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/hub-employees?${query}`
    : "/api/v1/admin/users/hub-employees";
  return request(url);
}

export async function getHubEmployees(
  hubAdminId: string,
  params?: UserListParams
): Promise<{ data: User[]; meta: UserMeta }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.blocked !== undefined)
    query.set("blocked", params.blocked.toString());
  if (params?.isEmailVerified !== undefined)
    query.set("isEmailVerified", params.isEmailVerified.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.pageSize) query.set("pageSize", params.pageSize.toString());
  if (params?.orderBy) query.set("orderBy", params.orderBy);
  if (params?.order) query.set("order", params.order);
  const url = query.toString()
    ? `/api/v1/admin/users/hub/${hubAdminId}/employees?${query}`
    : `/api/v1/admin/users/hub/${hubAdminId}/employees`;
  return request(url);
}

export async function getUserStatistics(): Promise<UserStatistics> {
  return request("/api/v1/admin/users/statistics");
}

export async function getUserById(id: string): Promise<User> {
  return request(`/api/v1/admin/users/${id}`);
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<User> {
  return request(`/api/v1/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string): Promise<AnyObj> {
  return request(`/api/v1/admin/users/${id}`, { method: "DELETE" });
}

export async function bulkUpdateStatus(payload: {
  ids: string[];
  blocked: boolean;
}): Promise<AnyObj> {
  return request("/api/v1/admin/users/bulk/status", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function bulkDeleteUsers(ids: string[]): Promise<AnyObj> {
  return request("/api/v1/admin/users/bulk/delete", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
}

export default {
  createUser,
  getAllUsers,
  getAdminUsers,
  getHubAdminUsers,
  getModeratorUsers,
  getVendorUsers,
  getClientUsers,
  getDeliverymanUsers,
  getHubEmployeeUsers,
  getHubEmployees,
  getUserStatistics,
  getUserById,
  updateUser,
  deleteUser,
  bulkUpdateStatus,
  bulkDeleteUsers,
};
