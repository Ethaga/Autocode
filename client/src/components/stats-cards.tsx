import { Card, CardContent } from "@/components/ui/card";
import { Code, Bug, Shield, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalAnalyses: number;
    bugsFound: number;
    vulnerabilities: number;
    fixed: number;
  };
}

const defaultStats = {
  totalAnalyses: 0,
  bugsFound: 0,
  vulnerabilities: 0,
  fixed: 0,
};

export default function StatsCards({ stats = defaultStats }: StatsCardsProps) {
  const statsData = [
    {
      icon: <Code className="text-primary text-xl" />,
      label: "Total Analisis",
      value: stats.totalAnalyses,
      testId: "stat-total-analyses"
    },
    {
      icon: <Bug className="text-destructive text-xl" />,
      label: "Bug Ditemukan",
      value: stats.bugsFound,
      testId: "stat-bugs-found"
    },
    {
      icon: <Shield className="text-warning text-xl" />,
      label: "Kerentanan",
      value: stats.vulnerabilities,
      testId: "stat-vulnerabilities"
    },
    {
      icon: <CheckCircle className="text-success text-xl" />,
      label: "Diperbaiki",
      value: stats.fixed,
      testId: "stat-fixed"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="surface border border-border">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p 
                  className="text-2xl font-bold text-foreground" 
                  data-testid={stat.testId}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
