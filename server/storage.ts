import { type CodeAnalysis, type InsertCodeAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAnalysis(id: string): Promise<CodeAnalysis | undefined>;
  getAllAnalyses(): Promise<CodeAnalysis[]>;
  createAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  updateAnalysis(id: string, updates: Partial<CodeAnalysis>): Promise<CodeAnalysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<CodeAnalysis[]>;
  getAnalysisStats(): Promise<{
    totalAnalyses: number;
    bugsFound: number;
    vulnerabilities: number;
    fixed: number;
  }>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, CodeAnalysis>;

  constructor() {
    this.analyses = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some sample analyses for demo purposes
    const sampleAnalyses: CodeAnalysis[] = [
      {
        id: "1",
        filename: "SomniaToken.sol",
        language: "solidity",
        code: "contract SomniaToken { ... }",
        status: "completed",
        duration: 1200,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        results: {
          issues: [],
          summary: { critical: 2, high: 1, medium: 3, low: 1, total: 7 },
          analysisTime: 1200,
          linesOfCode: 45
        }
      },
      {
        id: "2",
        filename: "GameLogic.js",
        language: "javascript",
        code: "function gameLoop() { ... }",
        status: "completed",
        duration: 850,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        results: {
          issues: [],
          summary: { critical: 0, high: 2, medium: 4, low: 2, total: 8 },
          analysisTime: 850,
          linesOfCode: 123
        }
      },
      {
        id: "3",
        filename: "DataProcessor.py",
        language: "python",
        code: "def process_data(): ...",
        status: "completed",
        duration: 650,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        results: {
          issues: [],
          summary: { critical: 0, high: 0, medium: 1, low: 4, total: 5 },
          analysisTime: 650,
          linesOfCode: 89
        }
      }
    ];

    sampleAnalyses.forEach(analysis => {
      this.analyses.set(analysis.id, analysis);
    });
  }

  async getAnalysis(id: string): Promise<CodeAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAllAnalyses(): Promise<CodeAnalysis[]> {
    return Array.from(this.analyses.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createAnalysis(insertAnalysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const id = randomUUID();
    const analysis: CodeAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async updateAnalysis(id: string, updates: Partial<CodeAnalysis>): Promise<CodeAnalysis | undefined> {
    const existing = this.analyses.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.analyses.set(id, updated);
    return updated;
  }

  async getRecentAnalyses(limit = 5): Promise<CodeAnalysis[]> {
    const all = await this.getAllAnalyses();
    return all.slice(0, limit);
  }

  async getAnalysisStats(): Promise<{
    totalAnalyses: number;
    bugsFound: number;
    vulnerabilities: number;
    fixed: number;
  }> {
    const analyses = Array.from(this.analyses.values());
    const completed = analyses.filter(a => a.status === "completed" && a.results);
    
    const totalBugs = completed.reduce((sum, a) => sum + (a.results?.summary.total || 0), 0);
    const vulnerabilities = completed.reduce((sum, a) => sum + (a.results?.summary.critical || 0) + (a.results?.summary.high || 0), 0);
    
    return {
      totalAnalyses: analyses.length,
      bugsFound: totalBugs,
      vulnerabilities,
      fixed: Math.floor(totalBugs * 0.7) // Simulate 70% fixed rate
    };
  }
}

export const storage = new MemStorage();
