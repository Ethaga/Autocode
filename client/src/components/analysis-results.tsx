import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeAnalysis, AnalysisIssue } from "@shared/schema";
import { Search, Download, AlertTriangle, Bug, Shield, Lightbulb, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  analysis: CodeAnalysis;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4" />;
    case "high":
      return <Bug className="h-4 w-4" />;
    case "medium":
      return <Shield className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-warning text-warning-foreground";
    case "medium":
      return "bg-yellow-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getSeverityBgColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 border-destructive/20";
    case "high":
      return "bg-warning/10 border-warning/20";
    case "medium":
      return "bg-yellow-500/10 border-yellow-500/20";
    default:
      return "bg-muted/10 border-muted/20";
  }
};

function IssueCard({ issue }: { issue: AnalysisIssue }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={cn("border", getSeverityBgColor(issue.severity))}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Badge className={getSeverityColor(issue.severity)}>
              {getSeverityIcon(issue.severity)}
              <span className="ml-1 font-medium">{issue.severity.toUpperCase()}</span>
            </Badge>
            <h4 className="font-medium text-foreground">{issue.title}</h4>
          </div>
          <span className="text-sm text-muted-foreground" data-testid={`issue-line-${issue.id}`}>
            Line {issue.line}{issue.endLine && issue.endLine !== issue.line ? `-${issue.endLine}` : ""}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>

        {issue.codeSnippet && (
          <div className="bg-muted rounded-lg p-4 mb-3 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{issue.codeSnippet}</pre>
          </div>
        )}

        {issue.suggestion && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <h5 className="font-medium text-success-foreground mb-1 flex items-center">
              <Lightbulb className="mr-1 h-4 w-4" />
              Rekomendasi Perbaikan
            </h5>
            <p className="text-sm text-success-foreground/80">{issue.suggestion}</p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Rule: {issue.ruleId}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            data-testid={`button-toggle-details-${issue.id}`}
          >
            {showDetails ? "Sembunyikan" : "Detail"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const handleExport = () => {
    const results = {
      filename: analysis.filename,
      language: analysis.language,
      timestamp: analysis.createdAt,
      summary: analysis.results?.summary,
      issues: analysis.results?.issues,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${analysis.filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analysis.results) {
    return null;
  }

  const { results } = analysis;
  const duration = analysis.duration ? (analysis.duration / 1000).toFixed(1) : "0.0";

  return (
    <Card className="mt-8 surface" data-testid="analysis-results">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Search className="text-primary mr-2" />
            Hasil Analisis
          </CardTitle>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground" data-testid="text-analysis-duration">
              Selesai dalam {duration} detik
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              data-testid="button-export-results"
            >
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Analysis Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="text-2xl font-bold text-destructive" data-testid="text-critical-count">
              {results.summary.critical}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="text-2xl font-bold text-warning" data-testid="text-high-count">
              {results.summary.high}
            </div>
            <div className="text-sm text-muted-foreground">High</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-medium-count">
              {results.summary.medium}
            </div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </div>
          <div className="text-center p-4 bg-muted/10 rounded-lg border border-muted/20">
            <div className="text-2xl font-bold text-muted-foreground" data-testid="text-low-count">
              {results.summary.low}
            </div>
            <div className="text-sm text-muted-foreground">Low</div>
          </div>
        </div>

        <Separator />

        {/* Issues List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Masalah yang Ditemukan</h3>
            <span className="text-sm text-muted-foreground" data-testid="text-total-issues">
              {results.issues.length} total issues
            </span>
          </div>

          {results.issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
              <p>Tidak ada masalah yang ditemukan! 🎉</p>
              <p className="text-sm">Kode Anda terlihat bersih dan aman.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.issues
                .sort((a, b) => {
                  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                  return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
                })
                .map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">File:</span>
            <span className="ml-2 text-muted-foreground" data-testid="text-analyzed-filename">
              {analysis.filename}
            </span>
          </div>
          <div>
            <span className="font-medium text-foreground">Language:</span>
            <span className="ml-2 text-muted-foreground capitalize" data-testid="text-analyzed-language">
              {analysis.language}
            </span>
          </div>
          <div>
            <span className="font-medium text-foreground">Lines of Code:</span>
            <span className="ml-2 text-muted-foreground" data-testid="text-lines-of-code">
              {results.linesOfCode}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
