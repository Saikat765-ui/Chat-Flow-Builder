import { flows, flowNodes, type Flow, type InsertFlow, type FlowNode, type InsertFlowNode, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Flow methods
  getFlow(id: string): Promise<Flow | undefined>;
  createFlow(flow: InsertFlow): Promise<Flow>;
  updateFlow(id: string, flow: Partial<InsertFlow>): Promise<Flow>;
  deleteFlow(id: string): Promise<void>;
  getAllFlows(): Promise<Flow[]>;
  
  // Flow node methods
  getFlowNodes(flowId: string): Promise<FlowNode[]>;
  createFlowNode(node: InsertFlowNode): Promise<FlowNode>;
  updateFlowNode(id: string, node: Partial<InsertFlowNode>): Promise<FlowNode>;
  deleteFlowNode(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // User functionality not implemented for this flow builder
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined; // Not implemented for this flow builder
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    return user;
  }

  async getFlow(id: string): Promise<Flow | undefined> {
    const [flow] = await db.select().from(flows).where(eq(flows.id, id));
    return flow || undefined;
  }

  async createFlow(insertFlow: InsertFlow): Promise<Flow> {
    const [flow] = await db
      .insert(flows)
      .values(insertFlow)
      .returning();
    return flow;
  }

  async updateFlow(id: string, updateFlow: Partial<InsertFlow>): Promise<Flow> {
    const [flow] = await db
      .update(flows)
      .set({ ...updateFlow, updatedAt: new Date() })
      .where(eq(flows.id, id))
      .returning();
    return flow;
  }

  async deleteFlow(id: string): Promise<void> {
    await db.delete(flows).where(eq(flows.id, id));
  }

  async getAllFlows(): Promise<Flow[]> {
    return await db.select().from(flows);
  }

  async getFlowNodes(flowId: string): Promise<FlowNode[]> {
    return await db.select().from(flowNodes).where(eq(flowNodes.flowId, flowId));
  }

  async createFlowNode(insertNode: InsertFlowNode): Promise<FlowNode> {
    const [node] = await db
      .insert(flowNodes)
      .values(insertNode)
      .returning();
    return node;
  }

  async updateFlowNode(id: string, updateNode: Partial<InsertFlowNode>): Promise<FlowNode> {
    const [node] = await db
      .update(flowNodes)
      .set(updateNode)
      .where(eq(flowNodes.id, id))
      .returning();
    return node;
  }

  async deleteFlowNode(id: string): Promise<void> {
    await db.delete(flowNodes).where(eq(flowNodes.id, id));
  }
}

export const storage = new DatabaseStorage();
