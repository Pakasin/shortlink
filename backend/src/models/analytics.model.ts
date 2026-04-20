// ============================================================
// Analytics Model — query ที่เกี่ยวกับ analytics table
// ============================================================
import { db } from "../config/database"
import type { Analytics } from "../types"

export const AnalyticsModel = {
  // บันทึกการ click
  record: (data: {
    link_id: number
    ip_address?: string
    user_agent?: string
    referer?: string
  }): void => {
    db.run(
      "INSERT INTO analytics (link_id, ip_address, user_agent, referer) VALUES (?, ?, ?, ?)",
      [data.link_id, data.ip_address ?? null, data.user_agent ?? null, data.referer ?? null]
    )
  },

  // นับจำนวน click ของแต่ละลิงก์
  getCountByLinkId: (linkId: number): number => {
    const result = db.query(
      "SELECT COUNT(*) as count FROM analytics WHERE link_id = ?"
    ).get(linkId) as { count: number }
    return result.count
  },

  // สรุปสถิติของ user (รวม click count ทุกลิงก์)
  getSummaryByUserId: (userId: number): any[] => {
    return db.query(`
      SELECT
        l.id, l.short_code, l.original_url, l.created_at,
        COUNT(a.id) as total_clicks,
        MAX(a.clicked_at) as last_clicked
      FROM links l
      LEFT JOIN analytics a ON l.id = a.link_id
      WHERE l.user_id = ?
      GROUP BY l.id
      ORDER BY total_clicks DESC
    `).all(userId)
  },

  // clicks รายวัน 30 วันย้อนหลัง
  getClicksByDate: (userId: number): any[] => {
    return db.query(`
      SELECT
        date(a.clicked_at) as date,
        COUNT(*) as clicks
      FROM analytics a
      JOIN links l ON a.link_id = l.id
      WHERE l.user_id = ?
      GROUP BY date(a.clicked_at)
      ORDER BY date DESC
      LIMIT 30
    `).all(userId)
  }
}