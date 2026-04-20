// User types
export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Link types
export interface Link {
  id: number;
  userId?: number;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  qrCodeData?: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: string;
  isAnonymous: boolean;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  shortUrl?: string;
}

export interface CreateLinkRequest {
  url: string;
  customAlias?: string;
  sessionId?: string;
}

export interface UpdateLinkRequest {
  url?: string;
  customAlias?: string;
  isActive?: boolean;
}

// Analytics types
export interface AnalyticsData {
  linkId: number;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  clickedAt: string;
}

export interface LinkAnalytics {
  totalClicks: number;
  uniqueVisitors: number;
  clicksByDay: { date: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// JWT Payload
export interface JWTPayload {
  id: number;
  email: string;
  exp?: number;
}
