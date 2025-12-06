# Architecture Documentation

## Overview

Financegram is a single-page application (SPA) built with React and TypeScript, following a feature-based architecture pattern. The application emphasizes clean code organization, type safety, and maintainability.

## Core Principles

### 1. Feature-Based Organization
Components are organized by feature/domain rather than by type:
- ✅ Good: `components/jobsea/CVBuilder.tsx`
- ❌ Bad: `components/builders/CVBuilder.tsx`

### 2. Separation of Concerns
- **Layout**: App shell components (Header, Sidebar)
- **Common**: Reusable cross-feature components
- **Auth**: Authentication and authorization logic
- **Features**: Domain-specific components (jobsea, community, etc.)

### 3. Type Safety First
- All components use TypeScript with strict mode
- Shared types defined in `src/types/`
- Database types auto-generated from Supabase

## Directory Structure

```
src/
├── components/
│   ├── layout/              # App shell
│   │   ├── Header.tsx       # Top navigation bar
│   │   ├── Sidebar.tsx      # Side navigation
│   │   └── index.ts         # Barrel exports
│   │
│   ├── common/              # Shared components
│   │   ├── TutorialButton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   │
│   ├── auth/                # Authentication
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserQuiz.tsx
│   │   └── index.ts
│   │
│   ├── community/           # Community features
│   │   ├── UniversityMap.tsx
│   │   └── ...
│   │
│   ├── jobsea/              # Job matching features
│   │   ├── CVBuilder.tsx
│   │   └── ...
│   │
│   ├── resources/           # Learning resources
│   │   ├── ReportCard.tsx
│   │   └── ...
│   │
│   └── ui/                  # shadcn/ui primitives
│       └── ...
│
├── pages/                   # Route components
│   ├── Auth.tsx
│   ├── JobSea.tsx
│   ├── Community.tsx
│   └── ...
│
├── hooks/                   # Custom React hooks
│   ├── use-toast.ts
│   ├── useTour.ts
│   └── ...
│
├── contexts/                # React Context providers
│   └── UserPreferencesContext.tsx
│
├── integrations/            # External services
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── lib/                     # Utilities
│   └── utils.ts
│
├── types/                   # TypeScript types
│   └── ...
│
└── data/                    # Static data
    └── ...
```

## Data Flow

### Authentication Flow
```
User → Auth Page → Supabase Auth → Session Storage → Protected Routes
```

### Feature Data Flow
```
Component → React Query → Edge Function → Supabase → Database
                ↓
            Local Cache
```

## State Management

### Local State
- Component-level state with `useState`
- Form state with React Hook Form

### Server State
- React Query for API data
- Automatic caching and revalidation
- Optimistic updates where appropriate

### Global State
- User preferences via Context API
- Authentication state via Supabase client

## Routing Architecture

```typescript
/ → Redirect to /jobsea
/auth → Public authentication page
/jobsea → Protected job matching features
/news → Protected news aggregation
/resources → Protected learning resources
/study → Protected AI study assistant
/community → Protected university networking
/settings → Protected user settings
/openbb → External redirect to OpenBB
```

## Component Patterns

### Page Components
Located in `src/pages/`, these are route-level components:
- Handle data fetching
- Manage page-level state
- Compose feature components

Example:
```typescript
export default function JobSea() {
  const { data: jobs } = useJobs();
  
  return (
    <div>
      <JobSearchFilters />
      <JobList jobs={jobs} />
    </div>
  );
}
```

### Feature Components
Located in `src/components/{feature}/`:
- Focused on specific domain logic
- Reusable within feature
- Self-contained with co-located logic

Example:
```typescript
export function CVBuilder({ userId }: CVBuilderProps) {
  // Component logic
}
```

### Common Components
Located in `src/components/common/`:
- Used across multiple features
- Generic and configurable
- Well-documented props

## API Layer

### Edge Functions
Serverless functions running on Supabase:
- `analyze-report` - AI-powered bank report analysis
- `finance-assistant` - Study assistant chatbot

### Database Access
Direct Supabase client for CRUD operations:
```typescript
const { data, error } = await supabase
  .from('jobsea_profiles')
  .select('*')
  .eq('user_id', userId);
```

## Security Architecture

### Row Level Security (RLS)
All user data protected by Supabase RLS policies:
```sql
CREATE POLICY "Users can view own data"
ON jobsea_profiles
FOR SELECT
USING (auth.uid() = user_id);
```

### Authentication
- Email/password via Supabase Auth
- Session management automatic
- Protected routes via `ProtectedRoute` wrapper

### API Keys
Stored as Supabase secrets, accessed only in edge functions

## Performance Optimization

### Code Splitting
- Route-based splitting via React Router
- Lazy loading for heavy components
- Dynamic imports where beneficial

### Caching Strategy
- React Query default cache time: 5 minutes
- Stale-while-revalidate pattern
- Optimistic updates for mutations

### Bundle Optimization
- Tree-shaking enabled via Vite
- CSS purging via Tailwind
- SVG optimization

## Testing Strategy

### Unit Tests
- Component logic testing
- Hook testing with React Testing Library
- Utility function testing

### Integration Tests
- User flow testing
- API integration testing
- Database query testing

## Deployment

### Build Process
```bash
npm run build  # Creates production bundle in dist/
```

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

### CI/CD
Automated via Lovable platform:
- Push to main → Auto-deploy to staging
- Manual promotion to production
- Edge functions deploy automatically

## Monitoring

### Error Tracking
- Console errors logged
- Supabase dashboard for backend errors
- Edge function logs for serverless issues

### Analytics
- User interaction tracking planned
- Performance monitoring via Lighthouse

## Future Considerations

### Scalability
- Consider Redis caching for heavy queries
- Implement pagination for large datasets
- Add GraphQL layer if REST becomes unwieldy

### Architecture Evolution
- Consider micro-frontends if app grows significantly
- Evaluate state management library (Zustand/Jotai) if Context becomes complex
- Implement design system package if components are reused externally

---

Last Updated: 2024-11-28
