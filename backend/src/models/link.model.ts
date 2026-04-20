// ============================================================
// Link Model — query ที่เกี่ยวกับ links table
// ============================================================
import { db } from "../config/database"
import type { Link } from "../types"

// สร้าง short code แบบ random 6 ตัวอักษร
const generateShortCode = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// สร้าง unique short code
const createUniqueCode = (): string => {
  let code = generateShortCode()
  while (db.query("SELECT id FROM links WHERE short_code = ?").get(code)) {
    code = generateShortCode()
  }
  return code
}

export const LinkModel = {
  // หาจาก short code
  findByShortCode: (shortCode: string): Link | null => {
    return db.query(
      "SELECT * FROM links WHERE short_code = ?"
    ).get(shortCode) as Link | null
  },

  // หาลิงก์ของ user
  findByUserId: (userId: number): Link[] => {
    return db.query(
      "SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC"
    ).all(userId) as Link[]
  },

  // หาลิงก์ของ anonymous session
  findBySessionId: (sessionId: string): Link[] => {
    return db.query(
      "SELECT * FROM links WHERE session_id = ? ORDER BY created_at DESC"
    ).all(sessionId) as Link[]
  },

  // สร้างลิงก์ใหม่
  create: (data: {
    original_url: string
    user_id?: number | null
    session_id?: string | null
  }): Link => {
    const shortCode = createUniqueCode()
    return db.query(
      `INSERT INTO links (short_code, original_url, user_id, session_id)
       VALUES (?, ?, ?, ?) RETURNING *`
    ).get(
      shortCode,
      data.original_url,
      data.user_id ?? null,
      data.session_id ?? null
    ) as Link
  },

  // ✅ อัปเดต original_url (เฉพาะเจ้าของ) — shortCode ยังเดิม
  update: (id: number, userId: number, newUrl: string): Link | null => {
    return db.query(
      `UPDATE links
       SET original_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?
       RETURNING *`
    ).get(newUrl, id, userId) as Link | null
  },

  // ลบลิงก์ (เฉพาะเจ้าของ)
  delete: (id: number, userId: number): boolean => {
    const result = db.run(
      "DELETE FROM links WHERE id = ? AND user_id = ?", [id, userId]
    )
    return result.changes > 0
  }
}
