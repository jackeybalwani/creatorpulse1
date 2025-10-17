# CreatorPulse - Architecture and Technical Flow Diagrams

## System Architecture Overview

<lov-mermaid>
graph TB
    subgraph "Client Layer"
        A[React SPA]
        A1[Vite Dev Server]
        A2[TypeScript]
        A3[Tailwind CSS]
        A4[shadcn/ui]
    end
    
    subgraph "Application Layer"
        B[React Router]
        C[React Query]
        D[Context API]
        E[Form Validation]
    end
    
    subgraph "API Layer - Supabase"
        F[Supabase Client]
        G[Authentication]
        H[PostgreSQL Database]
        I[Edge Functions]
        I1[sync-sources]
        I2[generate-draft]
        I3[send-newsletter]
        I4[scheduled-draft-generator]
        I5[scheduled-email-sender]
    end
    
    subgraph "AI Services"
        J[AI Model Router]
        K[GPT-5 / GPT-5-mini]
        L[Gemini 2.5 Pro/Flash]
    end
    
    subgraph "External APIs"
        M[Twitter/X API]
        N[YouTube API]
        O[RSS Feeds]
        P[Email Service SMTP]
    end
    
    A --> B
    A --> C
    A --> D
    A --> F
    
    F --> G
    F --> H
    F --> I
    
    I --> I1
    I --> I2
    I --> I3
    I --> I4
    I --> I5
    
    I1 --> M
    I1 --> N
    I1 --> O
    
    I2 --> J
    J --> K
    J --> L
    
    I3 --> P
    I4 --> I2
    I5 --> I3
</lov-mermaid>

## Database Schema

<lov-mermaid>
erDiagram
    users ||--o{ sources : owns
    users ||--o{ trends : detects
    users ||--o{ drafts : creates
    users ||--o{ past_newsletters : uploads
    users ||--o{ user_preferences : has
    drafts ||--o{ draft_feedback : receives
    
    users {
        uuid id PK
        string email
        timestamp created_at
    }
    
    sources {
        uuid id PK
        uuid user_id FK
        string type
        string name
        string url
        boolean is_active
        integer tracked_count
        timestamp added_at
        timestamp last_sync_at
        string sync_status
        string sync_error
    }
    
    trends {
        uuid id PK
        uuid user_id FK
        string title
        text description
        jsonb source_ids
        integer mentions
        float sentiment
        timestamp detected_at
        string category
    }
    
    drafts {
        uuid id PK
        uuid user_id FK
        string subject
        text content
        string status
        timestamp generated_at
        timestamp scheduled_for
        timestamp sent_at
        jsonb trend_ids
        jsonb feedback
    }
    
    past_newsletters {
        uuid id PK
        uuid user_id FK
        string title
        text content
        timestamp sent_date
        timestamp uploaded_at
    }
    
    user_preferences {
        uuid id PK
        uuid user_id FK
        text writing_style
        string tone
        string length
        jsonb topics
        string delivery_time
        string email_address
    }
    
    draft_feedback {
        uuid id PK
        uuid draft_id FK
        uuid user_id FK
        text original_subject
        text edited_subject
        text original_content
        text edited_content
        integer rating
        text comments
        timestamp created_at
    }
</lov-mermaid>

## Data Flow Architecture

<lov-mermaid>
graph LR
    A[External Sources] -->|API Calls| B[sync-sources Function]
    B -->|Store| C[(Sources Table)]
    B -->|Analyze| D[(Trends Table)]
    
    E[User Upload] -->|Past Newsletters| F[(past_newsletters Table)]
    
    G[Scheduled Job] -->|Trigger| H[scheduled-draft-generator]
    H -->|Fetch| D
    H -->|Fetch| F
    H -->|Fetch| I[(user_preferences Table)]
    H -->|Generate| J[generate-draft Function]
    J -->|AI Processing| K[AI Models]
    K -->|Return| J
    J -->|Store| L[(drafts Table)]
    
    M[User Review] -->|Feedback| N[(draft_feedback Table)]
    M -->|Approve| O[scheduled-email-sender]
    O -->|Fetch| L
    O -->|Send| P[send-newsletter Function]
    P -->|SMTP| Q[Email Recipients]
    P -->|Update| L
</lov-mermaid>

## Edge Functions Architecture

<lov-mermaid>
graph TB
    subgraph "Edge Function: sync-sources"
        SF1[Validate Auth] --> SF2[Fetch User Sources]
        SF2 --> SF3{Source Type?}
        SF3 -->|Twitter| SF4[Twitter API]
        SF3 -->|YouTube| SF5[YouTube API]
        SF3 -->|RSS| SF6[RSS Parser]
        SF4 --> SF7[Store Content]
        SF5 --> SF7
        SF6 --> SF7
        SF7 --> SF8[Trend Analysis]
        SF8 --> SF9[Update Database]
    end
    
    subgraph "Edge Function: generate-draft"
        GD1[Validate Input] --> GD2[Fetch Trends]
        GD2 --> GD3[Fetch Preferences]
        GD3 --> GD4[Fetch Past Newsletters]
        GD4 --> GD5[Build AI Prompt]
        GD5 --> GD6[Call AI Model]
        GD6 --> GD7[Format Output]
        GD7 --> GD8[Return Draft]
    end
    
    subgraph "Edge Function: send-newsletter"
        SN1[Validate Input] --> SN2[Sanitize Content]
        SN2 --> SN3[Build Email HTML]
        SN3 --> SN4[SMTP Send]
        SN4 --> SN5[Log Result]
    end
    
    subgraph "Edge Function: scheduled-draft-generator"
        SDG1[Fetch All Users] --> SDG2[For Each User]
        SDG2 --> SDG3[Generate Draft]
        SDG3 --> GD1
        GD8 --> SDG4[Schedule Send]
    end
    
    subgraph "Edge Function: scheduled-email-sender"
        SES1[Fetch Due Drafts] --> SES2[For Each Draft]
        SES2 --> SES3[Send Newsletter]
        SES3 --> SN1
        SN5 --> SES4[Mark as Sent]
    end
</lov-mermaid>

## Security Architecture

<lov-mermaid>
graph TB
    A[Client Request] --> B{Authentication?}
    B -->|No Auth| C[Public Routes Only]
    B -->|Has Token| D[Verify JWT]
    D -->|Invalid| E[401 Unauthorized]
    D -->|Valid| F[Extract User ID]
    
    F --> G{RLS Check}
    G -->|Read| H[user_id = auth.uid]
    G -->|Write| I[user_id = auth.uid]
    G -->|Update| J[user_id = auth.uid]
    G -->|Delete| K[user_id = auth.uid]
    
    H --> L[Allow Query]
    I --> L
    J --> L
    K --> L
    
    L --> M[Execute Query]
    M --> N[Return Data]
    
    subgraph "Row Level Security"
        H
        I
        J
        K
    end
    
    subgraph "Edge Function Security"
        O[JWT Verification] --> P[User Context]
        P --> Q[Filtered Queries]
    end
    
    subgraph "Input Validation"
        R[Zod Schemas] --> S[Type Safety]
        S --> T[Sanitization]
    end
</lov-mermaid>

## Deployment Architecture

<lov-mermaid>
graph TB
    subgraph "Lovable Cloud"
        A[Git Repository]
        A --> B[CI/CD Pipeline]
        B --> C[Build Process]
        C --> D[Frontend Build]
        C --> E[Edge Functions Deploy]
        D --> F[CDN Distribution]
        E --> G[Supabase Functions]
    end
    
    subgraph "Supabase Backend"
        H[PostgreSQL]
        I[Authentication]
        J[Storage]
        K[Realtime]
        G --> H
        G --> I
        G --> J
        G --> K
    end
    
    subgraph "External Services"
        L[AI Models]
        M[SMTP Service]
        N[Social APIs]
    end
    
    F --> O[End Users]
    G --> L
    G --> M
    G --> N
</lov-mermaid>

## AI Integration Flow

<lov-mermaid>
sequenceDiagram
    participant EF as Edge Function
    participant Router as AI Router
    participant GPT as GPT-5
    participant Gemini as Gemini 2.5
    participant Cache as Response Cache
    
    EF->>Router: Generate draft request
    Router->>Router: Select model based on config
    
    alt GPT Model Selected
        Router->>GPT: API call with prompt
        GPT-->>Router: Generated content
    else Gemini Model Selected
        Router->>Gemini: API call with prompt
        Gemini-->>Router: Generated content
    end
    
    Router->>Cache: Store response
    Router-->>EF: Return formatted draft
    
    Note over EF,Cache: Model selection based on:<br/>- User preferences<br/>- Content complexity<br/>- Cost optimization
</lov-mermaid>

## Scheduled Jobs Architecture

<lov-mermaid>
graph LR
    A[Cron Scheduler] -->|Daily| B[scheduled-draft-generator]
    A -->|Hourly| C[scheduled-email-sender]
    A -->|Every 6h| D[source-sync-job]
    
    B --> E[(Database)]
    C --> E
    D --> E
    
    B --> F[AI Generation]
    C --> G[Email Service]
    D --> H[External APIs]
    
    E --> I[User Notifications]
    E --> J[Analytics Events]
</lov-mermaid>

## Technology Stack Details

### Frontend Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router 6.30.1
- **State Management**: React Context API + React Query 5.83.0
- **Form Handling**: React Hook Form + Zod validation

### Backend Stack
- **Platform**: Supabase (Lovable Cloud)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (JWT-based)
- **Functions**: Deno-based Edge Functions
- **Storage**: Supabase Storage (for future file uploads)

### AI Integration
- **Models**: OpenAI GPT-5, Google Gemini 2.5
- **Integration**: Lovable AI (no API keys required)
- **Fallback**: Multi-model support for redundancy

### External Services
- **Email**: SMTP (Gmail/SendGrid/MailerSend)
- **Social APIs**: Twitter/X, YouTube, RSS
- **Monitoring**: Built-in Supabase analytics

## Performance Optimization

<lov-mermaid>
graph TB
    A[User Request] --> B{Cached?}
    B -->|Yes| C[Return Cached]
    B -->|No| D[Process Request]
    D --> E[Database Query]
    E --> F{Data Size}
    F -->|Small| G[Direct Return]
    F -->|Large| H[Pagination]
    H --> I[Infinite Scroll]
    G --> J[Cache Response]
    I --> J
    J --> K[Return to User]
    C --> K
    
    L[Background Jobs] --> M[Precompute Trends]
    L --> N[Pre-generate Drafts]
    M --> O[(Cache)]
    N --> O
</lov-mermaid>

## Error Handling Flow

<lov-mermaid>
graph TB
    A[Operation] --> B{Success?}
    B -->|Yes| C[Return Result]
    B -->|No| D{Error Type}
    D -->|Auth| E[Redirect to Login]
    D -->|Validation| F[Show Validation Errors]
    D -->|Network| G[Retry with Backoff]
    D -->|Server| H[Log Error]
    H --> I[Show User-Friendly Message]
    G --> J{Max Retries?}
    J -->|No| A
    J -->|Yes| H
    F --> K[User Corrects]
    K --> A
</lov-mermaid>
