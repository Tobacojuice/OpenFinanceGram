import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a senior investment banking analyst with expertise in financial statement analysis, regulatory filings, and corporate strategy. Your role is to analyze bank reports (10-K, 10-Q, annual reports, investor presentations) and extract actionable insights for finance students.

Guidelines:
1. Focus on key financial metrics: revenue breakdown, ROE, NIM, efficiency ratio, credit quality
2. Identify strategic priorities and business segment performance
3. Highlight regulatory impacts and market positioning
4. Extract year-over-year trends and management guidance
5. Explain complex concepts in accessible terms for students
6. Always cite specific page numbers or sections when referencing data
7. Structure insights in order of importance for IB recruiting prep

Format your analysis as JSON with these fields:
{
  "executive_summary": "2-3 sentence overview of the report",
  "key_metrics": {
    "revenue": "breakdown and YoY change",
    "profitability": "ROE, ROTCE, net income trends",
    "segments": "performance by business line",
    "credit_quality": "NPL ratio, reserves, charge-offs"
  },
  "strategic_priorities": ["list of 3-5 key strategic initiatives"],
  "market_position": "competitive standing and market share insights",
  "student_takeaways": ["3-5 actionable learning points for IB interviews"],
  "risks_opportunities": {
    "risks": ["key risk factors"],
    "opportunities": ["growth opportunities"]
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bank_name, report_type, report_year, report_quarter } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Analyzing report: ${bank_name} ${report_type} ${report_year}${report_quarter ? ` Q${report_quarter}` : ''}`);

    // Search for the report using web search
    const searchQuery = `${bank_name} ${report_type} ${report_year}${report_quarter ? ` Q${report_quarter}` : ''} investor relations SEC filing site:sec.gov OR site:investor.${bank_name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    console.log(`Search query: ${searchQuery}`);

    // Simulate report discovery (in production, this would use actual web search)
    // For now, we'll construct typical report URLs for major banks
    const reportUrl = constructReportUrl(bank_name, report_type, report_year, report_quarter);
    const reportTitle = `${bank_name} ${report_type} ${report_year}${report_quarter ? ` Q${report_quarter}` : ''}`;

    console.log(`Report URL: ${reportUrl}`);

    // Generate analysis using Lovable AI
    const analysisPrompt = `Analyze this ${bank_name} ${report_type} report from ${report_year}${report_quarter ? ` Q${report_quarter}` : ''}.

Based on typical ${report_type} structure for ${bank_name}, provide a comprehensive analysis covering:
1. Financial performance and key metrics
2. Business segment performance (Investment Banking, Trading, Wealth Management, Consumer Banking)
3. Strategic initiatives and management priorities
4. Market position and competitive dynamics
5. Risk factors and regulatory impacts
6. Student-friendly takeaways for IB interview prep

Format the response as JSON according to the specified structure.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices?.[0]?.message?.content || "{}";
    
    // Parse the JSON response from AI
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Fallback: create structured analysis from text
      analysis = {
        executive_summary: analysisText.substring(0, 300),
        key_metrics: {},
        strategic_priorities: [],
        market_position: "",
        student_takeaways: [],
        risks_opportunities: { risks: [], opportunities: [] }
      };
    }

    // Extract key insights
    const keyInsights = [
      ...(analysis.student_takeaways || []),
      ...(analysis.strategic_priorities || []).slice(0, 2),
    ].slice(0, 5);

    // Store in database
    const { data: reportData, error: dbError } = await supabase
      .from("bank_reports")
      .insert({
        bank_name,
        report_type,
        report_year,
        report_quarter,
        report_url: reportUrl,
        report_title: reportTitle,
        analysis,
        key_insights: keyInsights,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log("Report analysis saved:", reportData.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        report: reportData 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-report error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function constructReportUrl(bank: string, type: string, year: number, quarter?: string): string {
  const bankSlug = bank.toLowerCase().replace(/\s+/g, '');
  const baseUrls: Record<string, string> = {
    'jpmorgan': 'https://www.jpmorganchase.com/ir',
    'goldmansachs': 'https://www.goldmansachs.com/investor-relations',
    'morganstanley': 'https://www.morganstanley.com/about-us/investor-relations',
    'bankofamerica': 'https://investor.bankofamerica.com',
    'citigroup': 'https://www.citigroup.com/global/investors',
    'wellsfargo': 'https://www.wellsfargo.com/about/investor-relations',
  };

  const baseUrl = baseUrls[bankSlug] || `https://investor.${bankSlug}.com`;
  const quarterSuffix = quarter ? `-q${quarter}` : '';
  
  return `${baseUrl}/sec-filings/${type.toLowerCase()}-${year}${quarterSuffix}.pdf`;
}