import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { codeAnalyzer } from "./services/analyzer";
import { insertCodeAnalysisSchema, supportedLanguages, SupportedLanguage } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow text files and common code file extensions
    const allowedTypes = /\.(js|py|sol|txt|ts|jsx|tsx)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only code files are allowed'));
    }
  }
});

const analyzeCodeSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: z.enum(supportedLanguages),
  filename: z.string().min(1, "Filename is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get analysis statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getAnalysisStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get recent analyses
  app.get("/api/analyses/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const analyses = await storage.getRecentAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent analyses" });
    }
  });

  // Get all analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Get specific analysis
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Analyze code (text input)
  app.post("/api/analyze", async (req, res) => {
    try {
      const validation = analyzeCodeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input",
          errors: validation.error.errors 
        });
      }

      const { code, language, filename } = validation.data;

      // Create analysis record
      const analysis = await storage.createAnalysis({
        code,
        language,
        filename,
        status: "pending"
      });

      // Start analysis in background
      setImmediate(async () => {
        try {
          const results = await codeAnalyzer.analyze(code, language as SupportedLanguage, filename);
          await storage.updateAnalysis(analysis.id, {
            status: "completed",
            results,
            duration: results.analysisTime
          });
        } catch (error) {
          await storage.updateAnalysis(analysis.id, {
            status: "failed"
          });
        }
      });

      res.status(201).json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to start analysis" });
    }
  });

  // Analyze uploaded file
  app.post("/api/analyze/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const code = req.file.buffer.toString('utf-8');
      const filename = req.file.originalname;
      
      // Detect language from file extension
      let language: SupportedLanguage = "javascript";
      if (filename.endsWith('.py')) language = "python";
      else if (filename.endsWith('.sol')) language = "solidity";
      else if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
        language = "javascript";
      }

      // Create analysis record
      const analysis = await storage.createAnalysis({
        code,
        language,
        filename,
        status: "pending"
      });

      // Start analysis in background
      setImmediate(async () => {
        try {
          const results = await codeAnalyzer.analyze(code, language, filename);
          await storage.updateAnalysis(analysis.id, {
            status: "completed",
            results,
            duration: results.analysisTime
          });
        } catch (error) {
          await storage.updateAnalysis(analysis.id, {
            status: "failed"
          });
        }
      });

      res.status(201).json(analysis);
    } catch (error) {
      console.error("File analysis error:", error);
      res.status(500).json({ message: "Failed to analyze file" });
    }
  });

  // Get supported languages
  app.get("/api/languages", (req, res) => {
    res.json(supportedLanguages);
  });

  const httpServer = createServer(app);
  return httpServer;
}
