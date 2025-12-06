import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What is DCF valuation and when should I use it?",
  "Explain the CFA Level 1 exam structure",
  "How do I calculate WACC?",
  "What's the difference between IRR and NPV?",
  "Walk me through an LBO model",
  "How do I prepare for IB technical interviews?",
];

export default function StudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke("finance-assistant", {
        body: { messages: [...messages, userMessage] },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      <div className="border-b-2 border-foreground pb-4">
        <h1 className="text-2xl mono text-primary">&gt; STUDY ASSISTANT</h1>
        <p className="text-sm mono mt-2 opacity-70">
          AI mentor with 20+ years in finance. Ask about IB, CFA, valuations, careers.
        </p>
      </div>

      <Card className="flex-1 bg-black border-2 border-foreground flex flex-col overflow-hidden">
        <CardHeader className="border-b-2 border-foreground py-3">
          <CardTitle className="mono text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            FINANCE MENTOR AI
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <p className="mono text-center mb-6 opacity-70">
                Ask me anything about finance careers, technical concepts, or exam prep.
              </p>
              <div className="grid gap-2 md:grid-cols-2 w-full max-w-2xl">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left p-3 border-2 border-foreground hover:border-primary mono text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 border-2 border-primary flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 mono text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-black"
                          : "border-2 border-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 border-2 border-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="border-2 border-foreground p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t-2 border-foreground">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a finance question..."
                className="mono bg-black border-2 border-foreground focus:border-primary resize-none min-h-[60px]"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-primary text-black hover:bg-primary/90 mono px-6"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
