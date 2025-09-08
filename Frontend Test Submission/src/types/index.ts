// Type definitions for the URL Shortener application

export interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
  customShortCode?: string;
  validityMinutes?: number;
}

export interface ClickData {
  id: string;
  shortCode: string;
  timestamp: Date;
  source: string;
  location: string;
  userAgent: string;
}

export interface URLFormData {
  originalUrl: string;
  customShortCode?: string;
  validityMinutes?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock API response types (since we don't have a real backend)
export interface CreateShortURLResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt: string;
}

export interface GetStatsResponse {
  shortCode: string;
  clickCount: number;
  clicks: ClickData[];
}
