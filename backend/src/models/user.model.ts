// ============================================================
// User Model — query ที่เกี่ยวกับ users table
// ============================================================
import { db } from "../config/database"
import type { User } from "../types"

export const UserModel = {
  // หา user จาก email
  findByEmail: (email: string): User | null => {
    return db.query(
      "SELECT * FROM users WHERE email = ?"
    ).get(email) as User | null
  },

  // หา user จาก id
  findById: (id: number): User | null => {
    return db.query(
      "SELECT * FROM users WHERE id = ?"
    ).get(id) as User | null
  },

  // สร้าง user ใหม่
  create: (email: string, passwordHash: string): User => {
    return db.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING *"
    ).get(email, passwordHash) as User
  },

  // เช็คว่า email ซ้ำไหม
  exists: (email: string): boolean => {
    const user = db.query(
      "SELECT id FROM users WHERE email = ?"
    ).get(email)
    return !!user
  }
}