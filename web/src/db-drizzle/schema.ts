import {
  pgTable,
  integer,
  varchar,
  pgEnum,
  timestamp,
  serial,
  unique,
} from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";
export const userRole = pgEnum("userRole", ["admin", "user"]);

export const eventStatus = pgEnum("eventStatus", [
  "draft",
  "published",
  "closed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password").notNull(),
  role: userRole("userRole").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
  total_sections: integer("total_sections").notNull(),
  sectionLimit: integer("section_limit").notNull(),
  status: eventStatus("status").notNull().default("draft"),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  capacity: integer("capacity").notNull(),
});

export const preferences = pgTable(
  "preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    sectionId: integer("section_id")
      .notNull()
      .references(() => sections.id),
    preferenceOrder: integer("preference_order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    {
      uniquePreference: unique("unique_preference").on(
        table.userId,
        table.sectionId
      ),
      uniqueOrder: unique("unique_order").on(
        table.userId,
        table.eventId,
        table.preferenceOrder
      ),
    },
  ]
);

export const allocations = pgTable(
  "allocations",
  {
    id: serial("id").primaryKey(),
    sectionId: integer("section_id")
      .notNull()
      .references(() => sections.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    allocatedAt: timestamp("allocated_at").defaultNow().notNull(),
    allocatedBy: integer("allocated_by")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    {
      uniqueAllocation: unique("unique_allocation").on(
        table.userId,
        table.eventId
      ),
    },
  ]
);

export type NewUser = InferInsertModel<typeof users>;
