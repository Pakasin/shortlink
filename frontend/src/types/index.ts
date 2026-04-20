// ============================================================
// Type Definitions — ใช้ร่วมกันทั้ง project
// ============================================================

export interface User {
  id: number
  email: string
  password_hash: string
  created_at: string
}

export interface Link {
  id: number
  short_code: string
  original_url: string
  user_id: number | null
  session_id: string | null
  created_at: string
  expires_at: string | null
}

export interface Analytics {
  id: number
  link_id: number
  ip_address: string | null
  user_agent: string | null
  referer: string | null
  clicked_at: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface CreateLinkDto {
  original_url: string
  session_id?: string
  userId?: number
}

export interface JwtPayload {
  userId: number
  email: string
}