import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, ArrowRight } from "lucide-react";
import { CodeAnalysis } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface RecentAnalysesProps {
  analyses?: CodeAnalysis[];
}

const getSeverityColor = (critical: number, high: number) => {
  if (critical > 0) return "bg-destructive text-destructive-foreground";
  if (high > 0) return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

const getSeverityLabel = (critical: number, high: number, medium: number, low: number) => {
  if (critical > 0) return "Critical";
  if (high > 0) return "High";
  if (medium > 0) return "Medium";
  if (low > 0) return "Low";
  return "Clean";
};

export default function RecentAnalyses({ analyses = [] }: RecentAnalysesProps) {
  const formatTimeAgo = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card className="surface" data-testid="card-recent-analyses">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="text-primary mr-2" />
          Analisis Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada analisis</p>
            <p className="text-xs">Mulai analisis pertama Anda!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => {
              const summary = analysis.results?.summary;
              const severityColor = summary ? getSeverityColor(summary.critical, summary.high) : "bg-muted text-muted-foreground";
              const severityLabel = summary ? getSeverityLabel(summary.critical, summary.high, summary.medium, summary.low) : "Pending";

              return (
                <div 
                  key={analysis.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`recent-analysis-${analysis.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate" data-testid={`filename-${analysis.id}`}>
                      {analysis.filename}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground capitalize">
                        {analysis.language}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground" data-testid={`timestamp-${analysis.id}`}>
                        {analysis.createdAt ? formatTimeAgo(analysis.createdAt) : "Recently"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {summary && (
                      <span className="text-xs text-muted-foreground" data-testid={`total-issues-${analysis.id}`}>
                        {summary.total} issues
                      </span>
                    )}
                    <Badge className={`text-xs ${severityColor}`} data-testid={`severity-${analysis.id}`}>
                      {severityLabel}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {analyses.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-primary hover:text-primary/80" 
            size="sm"
            data-testid="button-view-all-history"
          >
            Lihat Semua Riwayat 
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
