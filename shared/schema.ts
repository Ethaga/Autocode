import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const codeAnalyses = pgTable("code_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  results: json("results").$type<AnalysisResult>(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  duration: integer("duration"), // in milliseconds
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type CodeAnalysis = typeof codeAnalyses.$inferSelect;

// Analysis result types
export interface AnalysisIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  line: number;
  endLine?: number;
  column?: number;
  endColumn?: number;
  ruleId: string;
  suggestion?: string;
  codeSnippet?: string;
}

export interface AnalysisResult {
  issues: AnalysisIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  analysisTime: number;
  linesOfCode: number;
}

export const supportedLanguages = ["javascript", "python", "solidity"] as const;
export type SupportedLanguage = typeof supportedLanguages[number];
