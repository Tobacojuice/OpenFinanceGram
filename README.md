# Financegram

> A comprehensive finance education and career navigation platform for students and professionals

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── common/          # Reusable components (TutorialButton, ErrorBoundary)
│   ├── auth/            # Authentication components (ProtectedRoute, UserQuiz)
│   ├── community/       # Community feature components
│   ├── jobsea/          # JobSea feature components
│   ├── resources/       # Resources feature components
│   └── ui/              # shadcn/ui primitives
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks
├── contexts/            # React context providers
├── integrations/        # Third-party integrations (Supabase)
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── data/                # Static data files
```

## 🚀 Features

### 🎯 JobSea™
AI-powered job matching system with:
- Personalized job recommendations
- Investment banking CV builder with strict IB standards
- Company intelligence database (20+ finance firms)
- Voice tracking (25+ finance influencers)

### 📰 News & Media
Curated financial content from:
- Wall Street Oasis (The Daily Peel)
- Expansión (Spanish financial newspaper)
- Global finance media sources

### 📚 Resources
Professional training hub featuring:
- Bulge bank financial report analysis with AI
- Financial modeling courses
- Wall Street Prep integration
- Programming lab (Excel → Python transition)

### 🎓 Study Assistant
AI finance mentor with 20+ years experience:
- Technical concept explanations
- CFA exam prep
- IB interview preparation
- Valuation models walkthrough

### 👥 Community
University networking platform:
- 50+ global institutions
- Interactive world map for discovery
- Regional channels (EMEA, Americas, Asia)
- Student-focused discussions

### ⚙️ Settings
Profile and preference management:
- LinkedIn integration
- Career goal customization
- Notification preferences

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Backend**: Supabase (via Lovable Cloud)
- **AI**: Lovable AI (Gemini 2.5)
- **Maps**: react-simple-maps
- **State**: React Query
- **Forms**: React Hook Form + Zod

## 🔒 Security

- Row Level Security (RLS) on all user data tables
- Protected routes with authentication guards
- Secure API key management via Supabase Edge Functions

## 📦 Database Schema

**Core Tables:**
- `jobsea_profiles` - User preferences and career data
- `job_alerts` - Personalized job recommendations
- `universities` - Global institution database
- `channels` - Community channels
- `jobsea_voices` - Industry influencer tracking
- `jobsea_companies` - Finance company intelligence
- `bank_reports` - AI-analyzed financial reports

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to `http://localhost:5173`

## 🎨 Design System

The application uses a Bloomberg Terminal-inspired design with:
- **Primary Color**: Bright green (`#00FF41`)
- **Font**: VT323 monospace for terminal aesthetic
- **Theme**: Dark mode with high contrast
- **Components**: shadcn/ui primitives customized for terminal look

## 📝 Code Standards

- **Component Organization**: Feature-based folders
- **Import Aliases**: Use `@/` for absolute imports
- **TypeScript**: Strict mode enabled
- **Naming**: PascalCase for components, camelCase for functions
- **File Structure**: One component per file with co-located styles

## 🔧 Development

- **Hot Reload**: Vite HMR for instant updates
- **Type Safety**: Full TypeScript coverage
- **Linting**: ESLint configured for React
- **Formatting**: Prettier for consistent code style

## 📖 Documentation

- [Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 📄 License

AGPL-3.0

## 🤝 Contributing

This is a Lovable-managed project. Please maintain the existing architecture and code standards.

---

**Built with Lovable** • **Powered by OpenBB Platform**