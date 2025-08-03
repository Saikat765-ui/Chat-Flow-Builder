import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const flows = pgTable("flows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nodes: json("nodes").notNull().default([]),
  edges: json("edges").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flowsRelations = relations(flows, ({ many }) => ({
  nodes: many(flowNodes),
}));

export const flowNodes = pgTable("flow_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flowId: varchar("flow_id").notNull().references(() => flows.id, { onDelete: "cascade" }),
  nodeId: text("node_id").notNull(),
  type: text("type").notNull(),
  data: json("data").notNull(),
  position: json("position").notNull(),
});

export const flowNodesRelations = relations(flowNodes, ({ one }) => ({
  flow: one(flows, {
    fields: [flowNodes.flowId],
    references: [flows.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFlowSchema = createInsertSchema(flows).pick({
  name: true,
  nodes: true,
  edges: true,
});

export const insertFlowNodeSchema = createInsertSchema(flowNodes).pick({
  flowId: true,
  nodeId: true,
  type: true,
  data: true,
  position: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFlow = z.infer<typeof insertFlowSchema>;
export type Flow = typeof flows.$inferSelect;
export type InsertFlowNode = z.infer<typeof insertFlowNodeSchema>;
export type FlowNode = typeof flowNodes.$inferSelect;
