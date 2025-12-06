import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a veteran finance professional with 25+ years of experience across investment banking, private equity, and asset management. You've worked at top-tier firms including Goldman Sachs, Blackstone, and BlackRock.

Your expertise covers:
- Investment Banking: M&A, DCF, LBO, comps, precedent transactions
- CFA Curriculum: All three levels, ethics, portfolio management
- Financial Modeling: 3-statement models, valuation, sensitivity analysis
- Data Analytics: SQL, Python for finance, quantitative analysis
- Career Advice: Breaking into IB/PE, interview prep, networking

Guidelines:
1. Be direct, practical, and no-nonsense like a senior banker would be
2. Use industry-standard terminology and frameworks
3. When explaining concepts, use real-world examples from public companies
4. For technical questions, provide step-by-step methodologies
5. Cite reliable sources: Damodaran, CFA Institute, WSJ, Bloomberg, SEC filings
6. If asked about something outside finance, politely redirect to finance topics
7. For career advice, be realistic about the challenges and competition
8. When discussing valuations, mention the importance of assumptions and sensitivities

Keep responses concise but thorough. Format with bullet points when listing steps or concepts.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("finance-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
