import {
  pgTable,
  unique,
  check,
  serial,
  varchar,
  text,
  boolean,
  date,
  foreignKey,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: text().notNull(),
    userName: varchar("user_name", { length: 20 }).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    userNameChangedAt: date("userName_changed_at")
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    emailChangedAt: date("email_changed_at")
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    passwordChangedAt: date("password_changed_at")
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
  },
  (table) => [
    unique("users_email_key").on(table.email),
    unique("users_username_key").on(table.userName),
    check("users_username_check", sql`char_length((user_name)::text) >= 3`),
  ]
);

export const expenses = pgTable(
  "expenses",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    category: varchar({ length: 25 }).notNull(),
    description: varchar({ length: 50 }),
    amount: numeric({ precision: 10, scale: 2, mode: "number" }).notNull(),
    date: date().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "expenses_user_id_fkey",
    }).onDelete("cascade"),
    check("expenses_amount_check", sql`amount >= (0)::numeric`),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    refreshToken: text("refresh_token").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_fkey",
    }).onDelete("cascade"),
    unique("sessions_refresh_token_key").on(table.refreshToken),
  ]
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    token: text().notNull(),
    expiresAt: date("expires_at").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "email_verification_tokens_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const budgets = pgTable(
  "budgets",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    month: integer().notNull(),
    year: integer().notNull(),
    amount: numeric({ precision: 10, scale: 2, mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "budgets_user_id_fkey",
    }).onDelete("cascade"),
    check("budgets_amount_check", sql`amount >= (0)::numeric`),
    check("budgets_month_check", sql`(month >= 1) AND (month <= 12)`),
    check("budgets_year_check", sql`year >= 2000`),
  ]
);
