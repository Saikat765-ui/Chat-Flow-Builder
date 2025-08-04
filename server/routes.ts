import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFlowSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all flows
  app.get("/api/flows", async (req, res) => {
    try {
      const flows = await storage.getAllFlows();
      res.json(flows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flows" });
    }
  });

  // Get a specific flow
  app.get("/api/flows/:id", async (req, res) => {
    try {
      const flow = await storage.getFlow(req.params.id);
      if (!flow) {
        return res.status(404).json({ message: "Flow not found" });
      }
      res.json(flow);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flow" });
    }
  });

  // Create a new flow
  app.post("/api/flows", async (req, res) => {
    try {
      const validatedData = insertFlowSchema.parse(req.body);
      const flow = await storage.createFlow(validatedData);
      res.status(201).json(flow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create flow", error: (error as Error).message });
    }
  });

  // Update a flow
  app.put("/api/flows/:id", async (req, res) => {
    try {
      const validatedData = insertFlowSchema.partial().parse(req.body);
      const flow = await storage.updateFlow(req.params.id, validatedData);
      res.json(flow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update flow" });
    }
  });

  // Delete a flow
  app.delete("/api/flows/:id", async (req, res) => {
    try {
      await storage.deleteFlow(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete flow" });
    }
  });

  // Validate flow before saving
  app.post("/api/flows/validate", async (req, res) => {
    try {
      const { nodes, edges } = req.body;
      
      // Basic validation checks
      if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        return res.status(400).json({
          message: "Invalid flow structure",
          error: "Nodes and edges must be arrays"
        });
      }

      // Check for duplicate node IDs
      const nodeIds = new Set();
      for (const node of nodes) {
        if (nodeIds.has(node.id)) {
          return res.status(400).json({
            message: "Invalid flow structure",
            error: "Duplicate node IDs found"
          });
        }
        nodeIds.add(node.id);
      }

      // Validate edge connections
      for (const edge of edges) {
        // Check if source and target nodes exist
        if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
          return res.status(400).json({
            message: "Invalid flow structure",
            error: "Edge references non-existent node"
          });
        }

        // Check for self-referencing edges
        if (edge.source === edge.target) {
          return res.status(400).json({
            message: "Invalid flow structure",
            error: "Self-referencing edges are not allowed"
          });
        }
      }

      // Check for disconnected nodes (warning only)
      const disconnectedNodes = nodes.filter((node: any) => {
        const hasIncoming = edges.some((edge: any) => edge.target === node.id);
        const hasOutgoing = edges.some((edge: any) => edge.source === node.id);
        return !hasIncoming && !hasOutgoing;
      });

      if (disconnectedNodes.length > 0) {
        console.warn(`Warning: Flow contains ${disconnectedNodes.length} disconnected nodes`);
      }
      
      res.json({ valid: true, message: "Flow is valid" });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate flow" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
