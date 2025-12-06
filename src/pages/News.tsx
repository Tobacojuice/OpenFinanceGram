import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Youtube, Instagram, Newspaper, Globe } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const wsoContent = [
  {
    name: "Wall Street Oasis",
    url: "https://www.wallstreetoasis.com/",
    type: "website",
    description: "The largest finance community - forums, salary data, interview prep",
    icon: Globe,
  },
  {
    name: "WSO YouTube",
    url: "https://www.youtube.com/@WallStreetOasis",
    type: "youtube",
    description: "Career advice, day-in-the-life, industry insights",
    icon: Youtube,
  },
  {
    name: "WSO Instagram",
    url: "https://www.instagram.com/wallstreetoasis/",
    type: "instagram",
    description: "Quick tips, memes, and finance culture",
    icon: Instagram,
  },
  {
    name: "The Daily Peel Newsletter",
    url: "https://www.wallstreetoasis.com/the-daily-peel",
    type: "newsletter",
    description: "Daily market news with humor - WSO's flagship newsletter",
    icon: Newspaper,
    featured: true,
  },
  {
    name: "WSO Company Database",
    url: "https://www.wallstreetoasis.com/company",
    type: "resource",
    description: "Salary data, interview questions, company reviews",
    icon: Globe,
  },
];

const expansionContent = [
  {
    name: "La Primera de Expansión",
    url: "https://www.expansion.com/la-primera-de-expansion.html",
    type: "newsletter",
    description: "El briefing matutino con las noticias económicas más relevantes",
    icon: Newspaper,
    featured: true,
  },
  {
    name: "Expansión",
    url: "https://www.expansion.com/",
    type: "website",
    description: "El diario económico líder en España",
    icon: Globe,
  },
  {
    name: "Expansión Mercados",
    url: "https://www.expansion.com/mercados.html",
    type: "website",
    description: "Bolsa, divisas, materias primas y análisis técnico",
    icon: Globe,
  },
  {
    name: "Expansión YouTube",
    url: "https://www.youtube.com/@ExpansionTV",
    type: "youtube",
    description: "Entrevistas, análisis y noticias económicas en vídeo",
    icon: Youtube,
  },
];

const otherSources = [
  {
    name: "Financial Times",
    url: "https://www.ft.com/",
    type: "website",
    description: "Global business and financial news",
    icon: Newspaper,
  },
  {
    name: "Bloomberg Markets",
    url: "https://www.bloomberg.com/markets",
    type: "website",
    description: "Real-time market data and analysis",
    icon: Globe,
  },
  {
    name: "Matt Levine's Money Stuff",
    url: "https://www.bloomberg.com/opinion/authors/ARbTQlRLRjE/matthew-s-levine",
    type: "newsletter",
    description: "The best finance newsletter - witty take on markets and deals",
    icon: Newspaper,
    featured: true,
  },
  {
    name: "Odd Lots Podcast",
    url: "https://www.bloomberg.com/oddlots-podcast",
    type: "podcast",
    description: "Bloomberg's deep-dive podcast on markets and economics",
    icon: Globe,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "youtube": return "text-red-500 border-red-500";
    case "instagram": return "text-pink-500 border-pink-500";
    case "newsletter": return "text-primary border-primary";
    default: return "text-foreground border-foreground";
  }
};

interface ContentItem {
  name: string;
  url: string;
  type: string;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
}

const ContentCard = ({ item }: { item: ContentItem }) => {
  const Icon = item.icon;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${item.featured ? 'border-primary' : 'border-foreground'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${getTypeColor(item.type)}`}>
              <Icon className="w-4 h-4" />
              <span className="mono text-xs uppercase">{item.type}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.featured && <span className="mono text-xs text-primary bg-primary/20 px-2 py-0.5">FEATURED</span>}
              <ExternalLink className="w-4 h-4 opacity-50" />
            </div>
          </div>
          <CardTitle className="mono text-lg mt-2">{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mono text-sm">{item.description}</CardDescription>
        </CardContent>
      </Card>
    </a>
  );
};

export default function News() {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <h1 className="text-2xl mono text-primary">&gt; NEWS &amp; MEDIA</h1>
        <p className="text-sm mono mt-2 opacity-70">Essential finance news sources and communities</p>
      </div>

      <Tabs defaultValue="wso" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black border-2 border-foreground">
          <TabsTrigger value="wso" className="mono data-[state=active]:bg-primary data-[state=active]:text-black">
            WSO
          </TabsTrigger>
          <TabsTrigger value="expansion" className="mono data-[state=active]:bg-primary data-[state=active]:text-black">
            EXPANSIÓN
          </TabsTrigger>
          <TabsTrigger value="global" className="mono data-[state=active]:bg-primary data-[state=active]:text-black">
            GLOBAL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wso" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="mb-4 p-4 border-2 border-primary bg-primary/10">
              <p className="mono text-sm">
                <span className="text-primary font-bold">WALL STREET OASIS</span> - The #1 finance community. 
                Essential for IB/PE recruiting, salary data, and industry insights.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {wsoContent.map((item) => (
                <ContentCard key={item.name} item={item} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="expansion" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="mb-4 p-4 border-2 border-primary bg-primary/10">
              <p className="mono text-sm">
                <span className="text-primary font-bold">EXPANSIÓN</span> - El diario económico líder en España. 
                Imprescindible para seguir los mercados españoles y europeos.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {expansionContent.map((item) => (
                <ContentCard key={item.name} item={item} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="global" className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4 md:grid-cols-2">
              {otherSources.map((item) => (
                <ContentCard key={item.name} item={item} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
