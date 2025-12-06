import { Link, useLocation } from "react-router-dom";
import { 
  BriefcaseBusiness,
  MessageSquare,
  Settings,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Newspaper
} from "lucide-react";

const navItems = [
  { to: "/jobsea", icon: BriefcaseBusiness, label: "JOBSEA™" },
  { to: "/news", icon: Newspaper, label: "NEWS" },
  { to: "/resources", icon: BookOpen, label: "RESOURCES" },
  { to: "/study", icon: GraduationCap, label: "STUDY AI" },
  { to: "/community", icon: MessageSquare, label: "COMMUNITY" },
  { to: "/openbb", icon: ExternalLink, label: "OPENBB DATA" },
  { to: "/settings", icon: Settings, label: "SETTINGS" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-black border-r-2 border-foreground min-h-screen p-4" data-tour="sidebar">
      <div className="mb-8 border-b-2 border-foreground pb-4">
        <h1 className="text-2xl mono text-primary">&gt; FINANCEGRAM</h1>
        <p className="text-sm mono mt-2">OPENBB TERMINAL</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          const tourId = item.to.replace('/', '');
          
          return (
            <Link
              key={item.to}
              to={item.to}
              data-tour={tourId}
              className={`
                flex items-center gap-3 px-4 py-3 mono text-sm
                border-2 transition-all
                ${isActive 
                  ? "bg-primary text-black border-primary" 
                  : "border-foreground hover:bg-foreground hover:text-black"
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t-2 border-foreground pt-4 mono text-xs opacity-70">
        <p>&gt; POWERED BY</p>
        <p className="text-primary">OPENBB PLATFORM</p>
        <p className="mt-2">LICENSE: AGPLV3</p>
      </div>
    </aside>
  );
}
