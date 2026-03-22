export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://127.0.0.1:8000/api/v1";

const AUTH_STORAGE_KEY = "pomegrid-connect-auth";

export type AccountType = "farmer" | "importer";

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

interface ApiEnvelope<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
  meta?: PaginationMeta;
}

interface BackendUser {
  id: number;
  username?: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  user_type: string;
  is_admin: number;
  is_verified: boolean;
  address?: string | null;
  profile_image_url?: string | null;
  avatar?: string | null;
  date_of_birth?: string | null;
}

export interface ConnectProfile {
  id: number;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  role: AccountType | null;
  account_type: AccountType | null;
  company: string;
  country: string;
  bio: string;
  avatar: string | null;
  profile_image_url: string | null;
  is_verified: boolean;
  min_order_qty: string;
  response_time: string;
  established: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthUser {
  id: number;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  backendRole: string;
  role: AccountType | null;
  accountType: AccountType | null;
  company: string;
  country: string;
  bio: string;
  avatar: string | null;
  profileImageUrl: string | null;
  address: string;
  dateOfBirth: string | null;
  isVerified: boolean;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
  helpText: string;
}

export interface DashboardOverview {
  accountType: AccountType;
  stats: DashboardStat[];
  chart: {
    label: string;
    data: { month: string; value: number }[];
  };
  distribution: {
    label: string;
    data: { name: string; value: number }[];
  };
  recent: {
    label: string;
    items: {
      id: string;
      title: string;
      subtitle: string;
      detail: string;
      time: string;
    }[];
  };
}

export interface Listing {
  id: number;
  name: string;
  title: string;
  category: string;
  price: number;
  formatted_price: string;
  unit: string;
  quantity: number;
  formatted_quantity: string;
  origin: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradePartner {
  id: number;
  name: string;
  company: string;
  type: AccountType;
  country: string;
  products: string[];
  verified: boolean;
  avatar?: string | null;
  bio: string;
  phone: string;
  email: string;
  established: string;
  certifications: string[];
  minOrderQty: string;
  shippingMethods: string[];
  languages: string[];
  rating: number;
  totalDeals: number;
  responseTime: string;
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderSummary {
  id: number;
  reference: string;
  scope: "buyer" | "seller";
  product: string;
  counterparty_name: string;
  counterparty_company: string;
  counterparty_country: string;
  quantity: string;
  price: string;
  total_value: number;
  status: string;
  date: string;
  created_at: string;
  items: OrderItem[];
}

export interface SupportConversation {
  id: string;
  user_id: number | null;
  admin_id: number | null;
  user_name: string | null;
  user_email: string | null;
  last_message_at: string | null;
  unread_count: number;
  latest_message: string | null;
  last_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SupportMessage {
  id: number;
  conversation_id: string;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name: string | null;
  receiver_name: string | null;
}

interface StoredAuthSession {
  accessToken: string;
  csrfToken?: string | null;
  user?: AuthUser | null;
}

interface LoginResponse {
  access_token: string;
  csrf_token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
}

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? (options.body !== undefined ? "POST" : "GET"),
    headers,
    credentials: "include",
    cache: "no-store",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

async function requestEnvelope<T>(path: string, options: RequestOptions = {}) {
  return requestJson<ApiEnvelope<T>>(path, options);
}

function toAuthUser(
  user: BackendUser,
  profile: ConnectProfile | null,
): AuthUser {
  const accountType = profile?.account_type ?? null;
  return {
    id: user.id,
    name: user.full_name,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone ?? "",
    backendRole: user.role ?? user.user_type ?? "user",
    role: accountType,
    accountType,
    company: profile?.company ?? "",
    country: profile?.country ?? "",
    bio: profile?.bio ?? "",
    avatar: profile?.avatar ?? user.avatar ?? user.profile_image_url ?? null,
    profileImageUrl:
      profile?.profile_image_url ??
      user.profile_image_url ??
      user.avatar ??
      null,
    address: user.address ?? "",
    dateOfBirth: user.date_of_birth ?? null,
    isVerified: Boolean(profile?.is_verified ?? user.is_verified),
  };
}

function buildUsername(fullName: string, email: string) {
  const base = (fullName || email.split("@")[0] || "pomegrid-user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return `${base || "pomegrid-user"}-${Date.now().toString().slice(-6)}`;
}

export function loadAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveAuthSession(session: StoredAuthSession) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function loginUser(input: { email: string; password: string }) {
  const response = await requestEnvelope<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
  });

  return {
    accessToken: response.data.access_token,
    csrfToken: response.data.csrf_token,
  };
}

export async function registerUser(input: {
  accountType: AccountType;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  country: string;
}) {
  return requestJson("/auth/register", {
    method: "POST",
    body: {
      username: buildUsername(input.fullName, input.email),
      password: input.password,
      email: input.email,
      full_name: input.fullName,
      phone: input.phone,
      user_type: "user",
      date_of_birth: input.dateOfBirth,
      address: input.country,
    },
  });
}

export async function logoutUser(token: string) {
  return requestJson("/auth/logout", {
    method: "POST",
    token,
  });
}

export async function fetchConnectProfile(token: string) {
  try {
    const response = await requestEnvelope<ConnectProfile>("/connect/profile", {
      token,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchCurrentUser(token: string) {
  const [userResponse, connectProfile] = await Promise.all([
    requestEnvelope<BackendUser>("/users/me", { token }),
    fetchConnectProfile(token),
  ]);

  return toAuthUser(userResponse.data, connectProfile);
}

export async function updateCoreUser(
  token: string,
  payload: {
    full_name: string;
    phone: string;
    address?: string;
  },
) {
  return requestEnvelope<BackendUser>("/users/me", {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function updateConnectProfile(
  token: string,
  payload: {
    account_type?: AccountType;
    company: string;
    country: string;
    bio: string;
  },
) {
  const response = await requestEnvelope<ConnectProfile>("/connect/profile", {
    method: "PUT",
    token,
    body: payload,
  });
  return response.data;
}

export async function fetchPartners() {
  const response = await requestEnvelope<TradePartner[]>("/connect/partners");
  return response.data;
}

export async function fetchDashboardOverview(token: string) {
  const response = await requestEnvelope<DashboardOverview>(
    "/connect/dashboard/overview",
    { token },
  );
  return response.data;
}

export async function fetchListings(token: string) {
  const response = await requestEnvelope<Listing[]>("/connect/listings", {
    token,
  });
  return response.data;
}

export async function createListing(
  token: string,
  payload: {
    title: string;
    category: string;
    price: number;
    quantity: number;
    description: string;
    image_url?: string;
  },
) {
  const response = await requestEnvelope<Listing>("/connect/listings", {
    method: "POST",
    token,
    body: payload,
  });
  return response.data;
}

export async function updateListing(
  token: string,
  listingId: number,
  payload: {
    title: string;
    category: string;
    price: number;
    quantity: number;
    description: string;
    image_url?: string;
  },
) {
  const response = await requestEnvelope<Listing>(
    `/connect/listings/${listingId}`,
    {
      method: "PUT",
      token,
      body: payload,
    },
  );
  return response.data;
}

export async function deleteListing(token: string, listingId: number) {
  return requestEnvelope<{ id: number }>(`/connect/listings/${listingId}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchOrders(token: string, scope?: "buyer" | "seller") {
  const search = scope ? `?scope=${scope}` : "";
  const response = await requestEnvelope<OrderSummary[]>(
    `/connect/orders${search}`,
    {
      token,
    },
  );
  return response.data;
}

export async function fetchSupportConversation(token: string) {
  const response = await requestJson<{
    conversation: SupportConversation | null;
  }>("/user/messages/support/conversation", { token });
  return response.conversation ?? null;
}

export async function fetchSupportMessages(token: string) {
  const response = await requestJson<{
    messages: SupportMessage[];
    meta?: PaginationMeta;
  }>("/user/messages/support/conversation/messages", { token });
  return response.messages ?? [];
}

export async function sendSupportMessage(token: string, content: string) {
  const response = await requestJson<{
    message: SupportMessage;
  }>("/user/messages/support/conversation/messages", {
    method: "POST",
    token,
    body: { content },
  });
  return response.message;
}

export async function markSupportMessagesRead(token: string) {
  return requestJson("/user/messages/support/conversation/read", {
    method: "POST",
    token,
  });
}
