import { sql } from "../config/database";
import type { Link, CreateLinkRequest, UpdateLinkRequest } from "shortlink-shared";

const API_URL = process.env.API_URL || "http://localhost:3000";

export class LinkService {
  private generateShortCode(length: number = 6): string {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createLink(data: CreateLinkRequest, userId?: number): Promise<Link> {
    const shortCode = data.customAlias || this.generateShortCode();
    const isAnonymous = !userId;

    // Check collision
    const existing = await sql`
      SELECT id FROM links WHERE short_code = ${shortCode}
    `;
    if (existing.length > 0) throw new Error("Short code already exists");

    // Validate URL
    try {
      new URL(data.url);
    } catch {
      throw new Error("Invalid URL format");
    }

    const [row] = await sql`
      INSERT INTO links (user_id, original_url, short_code, custom_alias, is_anonymous, session_id)
      VALUES (
        ${userId || null},
        ${data.url},
        ${shortCode},
        ${data.customAlias || null},
        ${isAnonymous},
        ${data.sessionId || null}
      )
      RETURNING *
    `;

    return this.mapToLink(row);
  }

  async getLinkById(id: number): Promise<Link> {
    const [row] = await sql`
      SELECT * FROM links WHERE id = ${id}
    `;
    return this.mapToLink(row);
  }

  async getLinkByShortCode(shortCode: string): Promise<Link | null> {
    const [row] = await sql`
      SELECT * FROM links WHERE short_code = ${shortCode}
    `;
    return row ? this.mapToLink(row) : null;
  }

  async getUserLinks(userId: number): Promise<Link[]> {
    const rows = await sql`
      SELECT * FROM links
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return rows.map((r) => this.mapToLink(r));
  }

  async getAnonymousLinks(sessionId: string): Promise<Link[]> {
    const rows = await sql`
      SELECT * FROM links
      WHERE session_id = ${sessionId}
      AND is_anonymous = true
      ORDER BY created_at DESC
    `;
    return rows.map((r) => this.mapToLink(r));
  }

  async incrementClicks(id: number): Promise<void> {
    await sql`
      UPDATE links SET clicks = clicks + 1 WHERE id = ${id}
    `;
  }

  // ✅ อัปเดต URL ปลายทาง — shortCode ยังเดิม
  async updateLink(
    id: number,
    userId: number,
    updates: UpdateLinkRequest
  ): Promise<Link | null> {
    const fields: Record<string, any> = {};

    if (updates.url !== undefined) {
      try {
        new URL(updates.url);
      } catch {
        throw new Error("Invalid URL format");
      }
      fields.original_url = updates.url;
    }

    if (updates.customAlias !== undefined) {
      const [existing] = await sql`
        SELECT id
        FROM links
        WHERE short_code = ${updates.customAlias}
        AND id <> ${id}
      `;

      if (existing) {
        throw new Error("Custom alias already exists");
      }

      fields.custom_alias = updates.customAlias;
      fields.short_code = updates.customAlias;
    }

    if (updates.isActive !== undefined) {
      fields.is_active = updates.isActive;
    }

    if (Object.keys(fields).length === 0) {
      return null;
    }

    const [row] = await sql`
      UPDATE links
      SET ${sql(fields)}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    return row ? this.mapToLink(row) : null;
  }

  async deleteLink(id: number, userId: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM links WHERE id = ${id} AND user_id = ${userId}
    `;
    return result.count > 0;
  }

  private mapToLink(row: any): Link {
    return {
      id: row.id,
      userId: row.user_id,
      originalUrl: row.original_url,
      shortCode: row.short_code,
      customAlias: row.custom_alias,
      qrCodeData: row.qr_code_data,
      clicks: row.clicks,
      isActive: row.is_active,
      expiresAt: row.expires_at,
      isAnonymous: row.is_anonymous,
      sessionId: row.session_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      shortUrl: `${API_URL}/${row.short_code}`,
    };
  }
}
