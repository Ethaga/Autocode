import { SupportedLanguage, AnalysisResult, AnalysisIssue } from "@shared/schema";
import { randomUUID } from "crypto";

export class CodeAnalyzer {
  async analyze(code: string, language: SupportedLanguage, filename: string): Promise<AnalysisResult> {
    const startTime = Date.now();
    const issues: AnalysisIssue[] = [];

    try {
      switch (language) {
        case "javascript":
          issues.push(...await this.analyzeJavaScript(code));
          break;
        case "python":
          issues.push(...await this.analyzePython(code));
          break;
        case "solidity":
          issues.push(...await this.analyzeSolidity(code));
          break;
      }

      // Add common pattern-based issues
      issues.push(...this.analyzeCommonPatterns(code, language));

      const analysisTime = Date.now() - startTime;
      const linesOfCode = code.split('\n').length;

      return {
        issues,
        summary: this.calculateSummary(issues),
        analysisTime,
        linesOfCode
      };
    } catch (error) {
      console.error("Analysis error:", error);
      return {
        issues: [{
          id: randomUUID(),
          severity: "high",
          title: "Analysis Error",
          description: "Failed to analyze code due to parsing error",
          line: 1,
          ruleId: "analysis-error",
          suggestion: "Check code syntax and try again"
        }],
        summary: { critical: 0, high: 1, medium: 0, low: 0, total: 1 },
        analysisTime: Date.now() - startTime,
        linesOfCode: code.split('\n').length
      };
    }
  }

  private async analyzeJavaScript(code: string): Promise<AnalysisIssue[]> {
    const issues: AnalysisIssue[] = [];

    // Check for common JavaScript issues
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for console.log statements
      if (line.includes('console.log')) {
        issues.push({
          id: randomUUID(),
          severity: "low",
          title: "Console Statement",
          description: "Console statements should be removed in production code",
          line: lineNumber,
          ruleId: "no-console",
          suggestion: "Remove console.log statements or use a proper logging library"
        });
      }

      // Check for var usage
      if (line.trim().startsWith('var ')) {
        issues.push({
          id: randomUUID(),
          severity: "medium",
          title: "Use of var",
          description: "Use 'let' or 'const' instead of 'var' for better scoping",
          line: lineNumber,
          ruleId: "no-var",
          suggestion: "Replace 'var' with 'let' or 'const'"
        });
      }

      // Check for == instead of ===
      if (line.includes('==') && !line.includes('===') && !line.includes('!==')) {
        issues.push({
          id: randomUUID(),
          severity: "medium",
          title: "Loose Equality",
          description: "Use strict equality (===) instead of loose equality (==)",
          line: lineNumber,
          ruleId: "eqeqeq",
          suggestion: "Replace '==' with '===' and '!=' with '!=='"
        });
      }
    });

    return issues;
  }

  private async analyzePython(code: string): Promise<AnalysisIssue[]> {
    const issues: AnalysisIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for bare except clauses
      if (line.trim() === 'except:') {
        issues.push({
          id: randomUUID(),
          severity: "high",
          title: "Bare Except Clause",
          description: "Catching all exceptions with bare 'except:' can hide errors",
          line: lineNumber,
          ruleId: "bare-except",
          suggestion: "Specify the exception type: except SpecificException:"
        });
      }

      // Check for eval usage
      if (line.includes('eval(')) {
        issues.push({
          id: randomUUID(),
          severity: "critical",
          title: "Use of eval()",
          description: "eval() can execute arbitrary code and is a security risk",
          line: lineNumber,
          ruleId: "no-eval",
          suggestion: "Avoid using eval(). Consider safer alternatives like ast.literal_eval()"
        });
      }

      // Check for global variables
      if (line.trim().startsWith('global ')) {
        issues.push({
          id: randomUUID(),
          severity: "medium",
          title: "Global Variable Usage",
          description: "Global variables can make code harder to maintain and test",
          line: lineNumber,
          ruleId: "global-variable",
          suggestion: "Consider using function parameters or class attributes instead"
        });
      }
    });

    return issues;
  }

  private async analyzeSolidity(code: string): Promise<AnalysisIssue[]> {
    const issues: AnalysisIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for reentrancy vulnerabilities
      if (line.includes('.call(') || line.includes('.send(')) {
        issues.push({
          id: randomUUID(),
          severity: "critical",
          title: "Potential Reentrancy Vulnerability",
          description: "External calls can lead to reentrancy attacks",
          line: lineNumber,
          ruleId: "reentrancy",
          suggestion: "Use the checks-effects-interactions pattern or ReentrancyGuard"
        });
      }

      // Check for tx.origin usage
      if (line.includes('tx.origin')) {
        issues.push({
          id: randomUUID(),
          severity: "high",
          title: "tx.origin Usage",
          description: "Using tx.origin for authorization can be unsafe",
          line: lineNumber,
          ruleId: "tx-origin",
          suggestion: "Use msg.sender instead of tx.origin for authentication"
        });
      }

      // Check for unchecked external calls
      if ((line.includes('.call(') || line.includes('.send(')) && !line.includes('require(')) {
        issues.push({
          id: randomUUID(),
          severity: "high",
          title: "Unchecked External Call",
          description: "External call return value is not checked",
          line: lineNumber,
          ruleId: "unchecked-call",
          suggestion: "Check return value of external calls or use transfer() instead of send()"
        });
      }

      // Check for pragma version
      if (line.includes('pragma solidity') && !line.includes('^0.8')) {
        issues.push({
          id: randomUUID(),
          severity: "medium",
          title: "Outdated Solidity Version",
          description: "Using an older Solidity version may miss security improvements",
          line: lineNumber,
          ruleId: "solidity-version",
          suggestion: "Consider upgrading to Solidity ^0.8.0 for built-in overflow protection"
        });
      }
    });

    return issues;
  }

  private analyzeCommonPatterns(code: string, language: SupportedLanguage): AnalysisIssue[] {
    const issues: AnalysisIssue[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for TODO/FIXME comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          id: randomUUID(),
          severity: "low",
          title: "TODO/FIXME Comment",
          description: "Code contains TODO or FIXME comment",
          line: lineNumber,
          ruleId: "todo-fixme",
          suggestion: "Address the TODO/FIXME or create a ticket to track the work"
        });
      }

      // Check for hardcoded secrets/passwords
      const secretPatterns = [/password\s*=\s*["']/, /api_key\s*=\s*["']/, /secret\s*=\s*["']/i];
      if (secretPatterns.some(pattern => pattern.test(line))) {
        issues.push({
          id: randomUUID(),
          severity: "critical",
          title: "Hardcoded Secret",
          description: "Potential hardcoded password or API key found",
          line: lineNumber,
          ruleId: "hardcoded-secret",
          suggestion: "Move secrets to environment variables or secure configuration"
        });
      }
    });

    return issues;
  }

  private calculateSummary(issues: AnalysisIssue[]) {
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: issues.length
    };

    issues.forEach(issue => {
      summary[issue.severity]++;
    });

    return summary;
  }
}

export const codeAnalyzer = new CodeAnalyzer();
