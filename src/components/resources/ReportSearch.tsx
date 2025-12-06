import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BANKS = [
  "JPMorgan Chase",
  "Goldman Sachs",
  "Morgan Stanley",
  "Bank of America",
  "Citigroup",
  "Wells Fargo",
];

const REPORT_TYPES = [
  { value: "10-K", label: "10-K (Annual Report)" },
  { value: "10-Q", label: "10-Q (Quarterly Report)" },
  { value: "Annual Report", label: "Annual Report" },
  { value: "Investor Presentation", label: "Investor Presentation" },
  { value: "Earnings Release", label: "Earnings Release" },
];

interface ReportSearchProps {
  onReportAdded: () => void;
}

export function ReportSearch({ onReportAdded }: ReportSearchProps) {
  const [bank, setBank] = useState<string>("");
  const [reportType, setReportType] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [quarter, setQuarter] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleAnalyze = async () => {
    if (!bank || !reportType || !year) {
      toast({
        title: "Missing Information",
        description: "Please select bank, report type, and year",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-report", {
        body: {
          bank_name: bank,
          report_type: reportType,
          report_year: parseInt(year),
          report_quarter: quarter || null,
        },
      });

      if (error) throw error;

      toast({
        title: "Report Analyzed",
        description: `Successfully analyzed ${bank} ${reportType} ${year}${quarter ? ` Q${quarter}` : ''}`,
      });

      onReportAdded();
      
      // Reset form
      setBank("");
      setReportType("");
      setQuarter("");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze report",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-black border-2 border-foreground p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="mono text-lg font-bold text-primary">ANALYZE NEW REPORT</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={bank} onValueChange={setBank}>
          <SelectTrigger className="mono bg-black border-foreground">
            <SelectValue placeholder="Select Bank" />
          </SelectTrigger>
          <SelectContent>
            {BANKS.map((b) => (
              <SelectItem key={b} value={b} className="mono">
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="mono bg-black border-foreground">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map((rt) => (
              <SelectItem key={rt.value} value={rt.value} className="mono">
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="mono bg-black border-foreground">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()} className="mono">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={quarter} onValueChange={setQuarter}>
          <SelectTrigger className="mono bg-black border-foreground">
            <SelectValue placeholder="Quarter (Optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className="mono">All Year</SelectItem>
            <SelectItem value="1" className="mono">Q1</SelectItem>
            <SelectItem value="2" className="mono">Q2</SelectItem>
            <SelectItem value="3" className="mono">Q3</SelectItem>
            <SelectItem value="4" className="mono">Q4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !bank || !reportType || !year}
        className="w-full mono bg-primary text-black hover:bg-primary/90"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ANALYZING...
          </>
        ) : (
          "ANALYZE REPORT"
        )}
      </Button>

      <p className="mono text-xs opacity-70 text-center">
        AI will search for the official report and provide detailed analysis
      </p>
    </div>
  );
}