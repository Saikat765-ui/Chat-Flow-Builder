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
      
      // Validation logic: Check if there are more than one nodes and more than one node has empty target handles
      if (nodes.length > 1) {
        const nodesWithoutTargets = nodes.filter((node: any) => {
          const incomingEdges = edges.filter((edge: any) => edge.target === node.id);
          return incomingEdges.length === 0;
        });
        
        if (nodesWithoutTargets.length > 1) {
          return res.status(400).json({ 
            message: "Cannot save Flow", 
            error: "More than one node has empty target handles" 
          });
        }
      }
      
      res.json({ valid: true, message: "Flow is valid" });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate flow" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
