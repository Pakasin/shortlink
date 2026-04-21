import bcrypt from "bcryptjs";
import { sql } from "../config/database";
import type { User, RegisterRequest, LoginRequest } from "shortlink-shared";

const SALT_ROUNDS = 10;

export class AuthService {
  // ═══ CHECK EMAIL EXISTS ═══
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await sql`
      SELECT id, email, name, created_at FROM users WHERE email = ${email}
    `;
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      createdAt: user.created_at,
    };
  }

  // ═══ REGISTER ═══
  async register(data: RegisterRequest): Promise<Omit<User, "passwordHash">> {
    // Check duplicate email
    const existing = await sql`
      SELECT id FROM users WHERE email = ${data.email}
    `;
    if (existing.length > 0) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const [user] = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${data.email}, ${hashedPassword}, ${data.name || null})
      RETURNING id, email, name, created_at
    `;

    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      createdAt: user.created_at,
    };
  }

  // ═══ VALIDATE USER (Login) ═══
  async validateUser(data: LoginRequest): Promise<User | null> {
    if (!data.email || !data.password) return null;

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${data.email}
    `;
    if (!user) return null;

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      createdAt: user.created_at,
    };
  }

  // ═══ GET USER BY ID ═══
  async getUserById(id: number): Promise<User | null> {
    const [user] = await sql`
      SELECT id, email, name, created_at
      FROM users WHERE id = ${id}
    `;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      createdAt: user.created_at,
    };
  }

  // ═══ FIND OR CREATE OAUTH USER ═══
  async findOrCreateOAuthUser(
    psuId: string,
    email: string,
    name: string
  ): Promise<User> {
    const [existing] = await sql`
      SELECT id, email, name, created_at FROM users 
      WHERE psu_id = ${psuId} OR email = ${email}
    `;

    if (existing) {
      await sql`
        UPDATE users SET psu_id = ${psuId}, provider = 'psu' WHERE id = ${existing.id}
      `;
      return {
        id: existing.id,
        email: existing.email,
        name: existing.name || null,
        createdAt: existing.created_at,
      };
    }

    const [user] = await sql`
      INSERT INTO users (email, name, psu_id, provider)
      VALUES (${email}, ${name}, ${psuId}, 'psu')
      RETURNING id, email, name, created_at
    `;

    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      createdAt: user.created_at,
    };
  }
}
