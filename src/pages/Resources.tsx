import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, GraduationCap, Youtube, BookOpen, TrendingUp, BarChart3, Calculator, Sparkles, Shield, Brain, Zap, Code, Terminal, FileSpreadsheet, Cpu, FileText, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportSearch } from "@/components/resources/ReportSearch";
import { ReportCard } from "@/components/resources/ReportCard";
import { AboutTab } from "@/components/resources/AboutTab";

const courses = [
  {
    name: "Financial Edge Training",
    url: "https://www.fe.training/",
    description: "Investment banking, private equity, and financial modeling courses",
    category: "IB/PE",
    free: false,
  },
  {
    name: "Wall Street Prep - Full Platform",
    url: "https://www.wallstreetprep.com/",
    description: "Financial modeling and valuation training for investment banking",
    category: "IB/PE",
    free: false,
  },
  {
    name: "WSP - LBO Modeling Course",
    url: "https://www.wallstreetprep.com/knowledge/lbo-model/",
    description: "Step-by-step LBO model tutorial - essential for PE interviews",
    category: "IB/PE",
    free: true,
    featured: true,
  },
  {
    name: "WSP - DCF Model Tutorial",
    url: "https://www.wallstreetprep.com/knowledge/dcf-model-training-free/",
    description: "Build a DCF from scratch - foundational valuation skill",
    category: "IB/PE",
    free: true,
  },
  {
    name: "WSP - M&A Model Tutorial",
    url: "https://www.wallstreetprep.com/knowledge/merger-model-ma-modeling/",
    description: "Accretion/dilution analysis and merger modeling basics",
    category: "IB/PE",
    free: true,
  },
  {
    name: "Corporate Finance Institute (CFI)",
    url: "https://corporatefinanceinstitute.com/",
    description: "Financial analyst certification and modeling courses",
    category: "Certification",
    free: true,
  },
  {
    name: "Breaking Into Wall Street",
    url: "https://breakingintowallstreet.com/",
    description: "Investment banking interview prep and financial modeling",
    category: "IB/PE",
    free: false,
  },
  {
    name: "Kaplan Schweser CFA",
    url: "https://www.schweser.com/cfa",
    description: "CFA exam preparation materials and study guides",
    category: "CFA",
    free: false,
  },
  {
    name: "AnalystPrep",
    url: "https://analystprep.com/",
    description: "CFA, FRM, and actuarial exam preparation",
    category: "CFA",
    free: true,
  },
  {
    name: "DataCamp",
    url: "https://www.datacamp.com/",
    description: "Python, R, SQL for data analytics in finance",
    category: "Data",
    free: true,
  },
  {
    name: "365 Data Science",
    url: "https://365datascience.com/",
    description: "Data science and analytics career training",
    category: "Data",
    free: false,
  },
  {
    name: "Coursera - Financial Markets (Yale)",
    url: "https://www.coursera.org/learn/financial-markets-global",
    description: "Robert Shiller's famous course on financial markets",
    category: "Foundation",
    free: true,
  },
  {
    name: "edX - Finance Fundamentals (MIT)",
    url: "https://www.edx.org/learn/finance",
    description: "MIT's foundational finance courses",
    category: "Foundation",
    free: true,
  },
];

const youtubeChannels = [
  {
    name: "Mergers & Inquisitions",
    url: "https://www.youtube.com/@MergersInquisitions",
    description: "Investment banking careers, technical interviews, and industry insights",
    category: "IB/PE",
    subscribers: "100K+",
  },
  {
    name: "The Plain Bagel",
    url: "https://www.youtube.com/@ThePlainBagel",
    description: "Clear explanations of investing concepts and market analysis",
    category: "Investing",
    subscribers: "700K+",
  },
  {
    name: "Patrick Boyle",
    url: "https://www.youtube.com/@PBoyle",
    description: "Hedge fund manager explaining quant finance and market events",
    category: "Quant/HF",
    subscribers: "500K+",
  },
  {
    name: "Aswath Damodaran",
    url: "https://www.youtube.com/@AswathDamodaranonValuation",
    description: "NYU Stern professor, the dean of valuation",
    category: "Valuation",
    subscribers: "300K+",
  },
  {
    name: "IB Insights",
    url: "https://www.youtube.com/@IBInsights",
    description: "Day-in-the-life content and IB career advice",
    category: "IB/PE",
    subscribers: "50K+",
  },
  {
    name: "Salt",
    url: "https://www.youtube.com/@SaltFinance",
    description: "CFA exam prep and financial analysis tutorials",
    category: "CFA",
    subscribers: "200K+",
  },
  {
    name: "Mark Meldrum",
    url: "https://www.youtube.com/@MarkMeldrum",
    description: "Comprehensive CFA curriculum coverage",
    category: "CFA",
    subscribers: "400K+",
  },
  {
    name: "Ken Jee",
    url: "https://www.youtube.com/@KenJee_ds",
    description: "Data science career advice and projects",
    category: "Data",
    subscribers: "250K+",
  },
  {
    name: "Alex The Analyst",
    url: "https://www.youtube.com/@AlexTheAnalyst",
    description: "SQL, Excel, Tableau for data analytics careers",
    category: "Data",
    subscribers: "500K+",
  },
  {
    name: "QuantPy",
    url: "https://www.youtube.com/@QuantPy",
    description: "Python for quantitative finance and algorithmic trading",
    category: "Quant/HF",
    subscribers: "100K+",
  },
];

const readingList = [
  { name: "Investment Banking (Rosenbaum & Pearl)", category: "IB/PE", type: "Textbook" },
  { name: "Financial Modeling & Valuation (Pignataro)", category: "IB/PE", type: "Textbook" },
  { name: "The Intelligent Investor (Graham)", category: "Investing", type: "Classic" },
  { name: "Security Analysis (Graham & Dodd)", category: "Valuation", type: "Classic" },
  { name: "CFA Program Curriculum", category: "CFA", type: "Official" },
  { name: "Options, Futures & Derivatives (Hull)", category: "Quant/HF", type: "Textbook" },
  { name: "Python for Finance (Hilpisch)", category: "Data", type: "Technical" },
  { name: "Storytelling with Data (Knaflic)", category: "Data", type: "Technical" },
];

const aiSecurityResources = [
  {
    name: "Learn Prompting - Prompt Injection",
    url: "https://learnprompting.org/docs/prompt_hacking/injection",
    description: "Comprehensive guide to prompt injection techniques and defenses",
    category: "Core",
    icon: Zap,
    featured: true,
  },
  {
    name: "Arcanum AI Security Lab",
    url: "https://arcanum-sec.github.io/ai-sec-resources/",
    description: "Curated AI security resources, research papers, and tools",
    category: "Lab",
    icon: Shield,
    featured: true,
  },
  {
    name: "Learn Prompting - Full Course",
    url: "https://learnprompting.org/",
    description: "Free comprehensive prompt engineering course",
    category: "Foundation",
    icon: Brain,
  },
  {
    name: "OWASP LLM Top 10",
    url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    description: "Security risks for LLM applications - essential reading",
    category: "Security",
    icon: Shield,
  },
  {
    name: "Anthropic Prompt Engineering",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
    description: "Official Claude prompt engineering guide from Anthropic",
    category: "Foundation",
    icon: Brain,
  },
  {
    name: "OpenAI Prompt Engineering Guide",
    url: "https://platform.openai.com/docs/guides/prompt-engineering",
    description: "Best practices for prompting GPT models effectively",
    category: "Foundation",
    icon: Brain,
  },
];

const codeLabResources = [
  {
    name: "Didier's Newsletter",
    url: "https://didierlopes.beehiiv.com/",
    description: "OpenBB CEO on AI, finance, open source - essential reading for next-gen finance",
    category: "Newsletter",
    icon: Brain,
    featured: true,
  },
  {
    name: "OpenBB Terminal",
    url: "https://openbb.co/",
    description: "Free AI-powered financial terminal - the Bloomberg killer",
    category: "Platform",
    icon: Terminal,
    featured: true,
  },
  {
    name: "OpenBB SDK Documentation",
    url: "https://docs.openbb.co/",
    description: "Python SDK for financial data - build your own terminal",
    category: "Python",
    icon: Code,
  },
  {
    name: "xlwings - Python in Excel",
    url: "https://www.xlwings.org/",
    description: "Run Python directly in Excel - replace VBA with modern code",
    category: "Excel",
    icon: FileSpreadsheet,
    featured: true,
  },
  {
    name: "PyXLL - Python Excel Add-in",
    url: "https://www.pyxll.com/",
    description: "Enterprise-grade Python-Excel integration for finance",
    category: "Excel",
    icon: FileSpreadsheet,
  },
  {
    name: "pandas - Data Analysis",
    url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
    description: "The foundation of financial data analysis in Python",
    category: "Python",
    icon: Code,
  },
  {
    name: "yfinance - Market Data",
    url: "https://github.com/ranaroussi/yfinance",
    description: "Free Yahoo Finance API wrapper - quick market data access",
    category: "Python",
    icon: Code,
  },
  {
    name: "QuantLib Python",
    url: "https://www.quantlib.org/",
    description: "Open-source library for quantitative finance - derivatives pricing",
    category: "Quant",
    icon: Cpu,
  },
  {
    name: "Zipline - Backtesting",
    url: "https://zipline.ml4trading.io/",
    description: "Pythonic algorithmic trading library used by Quantopian",
    category: "Quant",
    icon: Cpu,
  },
  {
    name: "Financial Modeling Prep API",
    url: "https://site.financialmodelingprep.com/developer/docs",
    description: "Free financial data API - fundamentals, statements, ratios",
    category: "API",
    icon: Terminal,
  },
  {
    name: "Streamlit for Finance",
    url: "https://streamlit.io/",
    description: "Build interactive financial dashboards in pure Python",
    category: "Python",
    icon: Code,
  },
  {
    name: "Python for Finance (Yves Hilpisch)",
    url: "https://home.tpq.io/books/py4fi/",
    description: "The definitive book on Python for quantitative finance",
    category: "Learning",
    icon: BookOpen,
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "IB/PE": return <TrendingUp className="w-4 h-4" />;
    case "CFA": return <Calculator className="w-4 h-4" />;
    case "Data": return <BarChart3 className="w-4 h-4" />;
    case "Quant/HF": return <BarChart3 className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

export default function Resources() {
  const { data: reports, refetch: refetchReports } = useQuery({
    queryKey: ["bank-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bank_reports")
        .select("*")
        .order("report_year", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <h1 className="text-2xl mono text-primary">&gt; RESOURCES</h1>
        <p className="text-sm mono mt-2 opacity-70">Curated learning materials for finance careers</p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-black border-2 border-foreground">
          <TabsTrigger value="courses" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <GraduationCap className="w-3 h-3 mr-1" />
            COURSES
          </TabsTrigger>
          <TabsTrigger value="youtube" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <Youtube className="w-3 h-3 mr-1" />
            YOUTUBE
          </TabsTrigger>
          <TabsTrigger value="codelab" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <Code className="w-3 h-3 mr-1" />
            CODE LAB
          </TabsTrigger>
          <TabsTrigger value="reports" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <FileText className="w-3 h-3 mr-1" />
            REPORTS
          </TabsTrigger>
          <TabsTrigger value="books" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <BookOpen className="w-3 h-3 mr-1" />
            BOOKS
          </TabsTrigger>
          <TabsTrigger value="curious" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <Sparkles className="w-3 h-3 mr-1" />
            CURIOUS?
          </TabsTrigger>
          <TabsTrigger value="about" className="mono text-xs data-[state=active]:bg-primary data-[state=active]:text-black">
            <Heart className="w-3 h-3 mr-1" />
            ABOUT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <a
                  key={course.name}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${(course as any).featured ? 'border-primary' : 'border-foreground'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(course.category)}
                          <span className="mono text-xs px-2 py-1 bg-foreground/20">{course.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(course as any).featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">TOP PICK</span>}
                          {course.free && <span className="mono text-xs text-primary">FREE</span>}
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                      </div>
                      <CardTitle className="mono text-lg mt-2">{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mono text-sm">{course.description}</CardDescription>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="youtube" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4 md:grid-cols-2">
              {youtubeChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="bg-black border-2 border-foreground hover:border-red-500 transition-colors h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-red-500" />
                          <span className="mono text-xs px-2 py-1 bg-foreground/20">{channel.category}</span>
                        </div>
                        <span className="mono text-xs opacity-50">{channel.subscribers}</span>
                      </div>
                      <CardTitle className="mono text-lg mt-2">{channel.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mono text-sm">{channel.description}</CardDescription>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-6">
              <ReportSearch onReportAdded={() => refetchReports()} />
              
              <div className="grid gap-6 md:grid-cols-2">
                {reports && reports.length > 0 ? (
                  reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 border-2 border-dashed border-foreground/30">
                    <FileText className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
                    <p className="mono text-sm opacity-70">No reports analyzed yet</p>
                    <p className="mono text-xs opacity-50 mt-1">Use the form above to analyze your first report</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="books" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {readingList.map((book) => (
                <div
                  key={book.name}
                  className="flex items-center justify-between p-4 border-2 border-foreground hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <p className="mono font-bold">{book.name}</p>
                      <p className="mono text-xs opacity-70">{book.type}</p>
                    </div>
                  </div>
                  <span className="mono text-xs px-2 py-1 bg-foreground/20">{book.category}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="curious" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="mb-6 p-4 border-2 border-primary bg-primary/10">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="mono font-bold text-primary mb-2">AI + FINANCE: THE NEW FRONTIER</h3>
                  <p className="mono text-sm mb-3">
                    Prompt injection and AI security aren't just for hackers. Understanding these techniques 
                    is becoming essential for finance professionals who want to leverage AI responsibly 
                    and build robust financial systems.
                  </p>
                  <p className="mono text-sm opacity-80">
                    <span className="text-primary">The opportunity:</span> Use knowledge of prompt engineering 
                    and AI vulnerabilities to build better financial AI tools, create more secure trading 
                    algorithms, and develop AI-powered due diligence systems that can't be easily manipulated.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {aiSecurityResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${resource.featured ? 'border-primary' : 'border-foreground'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="mono text-xs px-2 py-1 bg-foreground/20">{resource.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">START HERE</span>}
                            <ExternalLink className="w-4 h-4 opacity-50" />
                          </div>
                        </div>
                        <CardTitle className="mono text-lg mt-2">{resource.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mono text-sm">{resource.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 p-4 border-2 border-foreground">
              <h4 className="mono font-bold mb-2">WHY THIS MATTERS FOR FINANCE:</h4>
              <ul className="mono text-sm space-y-2 opacity-80">
                <li>• <span className="text-primary">Risk Management:</span> Identify AI vulnerabilities in trading systems</li>
                <li>• <span className="text-primary">Due Diligence:</span> Build AI tools that can't be fooled by manipulated data</li>
                <li>• <span className="text-primary">Competitive Edge:</span> Prompt engineering = better AI financial analysis</li>
                <li>• <span className="text-primary">Compliance:</span> Understand AI risks before regulators mandate it</li>
              </ul>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="codelab" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="mb-6 p-4 border-2 border-primary bg-primary/10">
              <div className="flex items-start gap-3">
                <Terminal className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="mono font-bold text-primary mb-2">NEXT-GEN FINANCE TOOLS</h3>
                  <p className="mono text-sm mb-3">
                    VBA is dying. Excel alone won't cut it anymore. The future of finance is Python, 
                    open-source tools, and AI-powered terminals. Start here to stay ahead.
                  </p>
                  <p className="mono text-sm opacity-80">
                    <span className="text-primary">Inspired by:</span> Didier Lopes (OpenBB CEO) and the 
                    open-source finance revolution. His newsletter is essential reading for anyone 
                    building the future of financial technology.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {codeLabResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${resource.featured ? 'border-primary' : 'border-foreground'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="mono text-xs px-2 py-1 bg-foreground/20">{resource.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">ESSENTIAL</span>}
                            <ExternalLink className="w-4 h-4 opacity-50" />
                          </div>
                        </div>
                        <CardTitle className="mono text-lg mt-2">{resource.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mono text-sm">{resource.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 p-4 border-2 border-foreground">
              <h4 className="mono font-bold mb-2">THE MODERN FINANCE STACK:</h4>
              <ul className="mono text-sm space-y-2 opacity-80">
                <li>• <span className="text-primary">Python + pandas:</span> Replace 90% of your Excel work with cleaner, reproducible code</li>
                <li>• <span className="text-primary">xlwings:</span> When you must use Excel, automate it with Python instead of VBA</li>
                <li>• <span className="text-primary">OpenBB:</span> Free alternative to Bloomberg Terminal with AI capabilities</li>
                <li>• <span className="text-primary">Streamlit:</span> Turn your Python analysis into shareable web dashboards</li>
                <li>• <span className="text-primary">Git:</span> Version control your models - no more "DCF_v3_final_FINAL.xlsx"</li>
              </ul>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AboutTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
