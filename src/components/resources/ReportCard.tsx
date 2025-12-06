import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tables } from "@/integrations/supabase/types";

interface ReportCardProps {
  report: Tables<"bank_reports">;
}

export function ReportCard({ report }: ReportCardProps) {
  const analysis = report.analysis as any;

  return (
    <Card className="bg-black border-2 border-foreground hover:border-primary transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="mono text-xs bg-primary text-black">
                {report.report_type}
              </Badge>
              <Badge variant="outline" className="mono text-xs">
                {report.report_year}
                {report.report_quarter && ` Q${report.report_quarter}`}
              </Badge>
            </div>
            <CardTitle className="mono text-lg">{report.bank_name}</CardTitle>
            <CardDescription className="mono text-xs mt-1">
              {report.report_title}
            </CardDescription>
          </div>
          <a
            href={report.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:opacity-80 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Executive Summary */}
        {analysis?.executive_summary && (
          <div className="p-3 bg-foreground/10 border border-foreground/20 rounded">
            <p className="mono text-sm leading-relaxed">{analysis.executive_summary}</p>
          </div>
        )}

        {/* Key Insights */}
        {report.key_insights && report.key_insights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h4 className="mono text-sm font-bold text-primary">KEY INSIGHTS</h4>
            </div>
            <ul className="space-y-1 pl-6">
              {report.key_insights.map((insight, i) => (
                <li key={i} className="mono text-xs list-disc opacity-90">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Metrics */}
        {analysis?.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="mono text-sm font-bold text-primary">KEY METRICS</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analysis.key_metrics).map(([key, value]) => (
                <div key={key} className="p-2 bg-foreground/5 border border-foreground/20 rounded">
                  <p className="mono text-xs opacity-70 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="mono text-xs font-bold mt-1">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Priorities */}
        {analysis?.strategic_priorities && analysis.strategic_priorities.length > 0 && (
          <div>
            <h4 className="mono text-sm font-bold text-primary mb-2">STRATEGIC PRIORITIES</h4>
            <ul className="space-y-1 pl-6">
              {analysis.strategic_priorities.map((priority: string, i: number) => (
                <li key={i} className="mono text-xs list-disc opacity-90">
                  {priority}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks & Opportunities */}
        {analysis?.risks_opportunities && (
          <div className="grid grid-cols-2 gap-4">
            {analysis.risks_opportunities.risks && analysis.risks_opportunities.risks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h4 className="mono text-xs font-bold">RISKS</h4>
                </div>
                <ul className="space-y-1 pl-4">
                  {analysis.risks_opportunities.risks.map((risk: string, i: number) => (
                    <li key={i} className="mono text-xs list-disc opacity-80">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.risks_opportunities.opportunities && analysis.risks_opportunities.opportunities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <h4 className="mono text-xs font-bold">OPPORTUNITIES</h4>
                </div>
                <ul className="space-y-1 pl-4">
                  {analysis.risks_opportunities.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="mono text-xs list-disc opacity-80">
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Market Position */}
        {analysis?.market_position && (
          <div className="p-3 bg-foreground/5 border border-foreground/20 rounded">
            <h4 className="mono text-xs font-bold mb-1">MARKET POSITION</h4>
            <p className="mono text-xs opacity-90">{analysis.market_position}</p>
          </div>
        )}

        {/* Student Takeaways */}
        {analysis?.student_takeaways && analysis.student_takeaways.length > 0 && (
          <div className="p-3 bg-primary/10 border border-primary rounded">
            <h4 className="mono text-xs font-bold text-primary mb-2">📚 STUDENT TAKEAWAYS</h4>
            <ul className="space-y-1 pl-4">
              {analysis.student_takeaways.map((takeaway: string, i: number) => (
                <li key={i} className="mono text-xs list-disc">
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}