# CreatorPulse - UI and User Flow Diagrams

## User Journey Map

<lov-mermaid>
journey
    title CreatorPulse User Journey
    section Onboarding
      Sign Up / Login: 5: User
      Complete Profile Setup: 4: User
      Configure Preferences: 4: User
    section Source Management
      Connect Twitter/X Sources: 5: User
      Add YouTube Channels: 5: User
      Add RSS Feeds: 5: User
      Activate Sources: 5: User
    section Content Processing
      System Syncs Sources: 3: System
      Trends Detected: 4: System
      Review Detected Trends: 4: User
    section Draft Creation
      Upload Past Newsletters: 5: User
      Train Writing Style: 4: System
      Generate AI Draft: 5: System
      Review Draft: 5: User
      Edit & Customize: 4: User
    section Publishing
      Schedule Newsletter: 5: User
      Send Newsletter: 5: System
      Track Performance: 4: User
    section Learning Loop
      Provide Feedback: 4: User
      System Improves: 5: System
</lov-mermaid>

## Main Application Flow

<lov-mermaid>
graph TD
    A[Login / Sign Up] --> B{Authenticated?}
    B -->|No| A
    B -->|Yes| C[Dashboard]
    
    C --> D[Sources Page]
    C --> E[Trends Page]
    C --> F[Drafts Page]
    C --> G[Writing Style Trainer]
    C --> H[Settings]
    
    D --> D1[Add New Source]
    D --> D2[View Active Sources]
    D --> D3[Sync Sources]
    D1 --> D4{Source Type}
    D4 -->|Twitter/X| D5[Enter Handle]
    D4 -->|YouTube| D6[Enter Channel URL]
    D4 -->|RSS| D7[Enter Feed URL]
    D5 --> D8[Activate Source]
    D6 --> D8
    D7 --> D8
    
    E --> E1[View Detected Trends]
    E --> E2[Filter by Category]
    E --> E3[Sort by Sentiment/Mentions]
    E1 --> E4[Select Trends via Checkbox]
    E4 --> E5[Select All/Deselect All]
    E5 --> E6[Generate Draft from Selected]
    
    F --> F1[View All Drafts]
    F --> F2[Create New Draft]
    F --> F3[Edit Draft]
    F --> F4[Review Draft]
    F2 --> F5[Select Trends]
    F5 --> F6[Generate AI Draft]
    F6 --> F3
    F4 --> F7[Schedule Send]
    F7 --> F8[Newsletter Sent]
    
    G --> G1[Upload Past Newsletters]
    G --> G2[Train AI Model]
    G2 --> G3[View Training Status]
    
    H --> H1[Update Preferences]
    H --> H2[Configure Writing Style]
    H --> H3[Set Delivery Schedule]
    H --> H4[Manage Email Settings]
</lov-mermaid>

## Source Synchronization Flow

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant UI as UI
    participant API as Edge Function
    participant DB as Database
    participant EXT as External APIs
    
    U->>UI: Add New Source
    UI->>API: POST /sync-sources
    API->>DB: Insert source record
    DB-->>API: Source created
    API->>EXT: Fetch content (Twitter/YouTube/RSS)
    EXT-->>API: Return content data
    API->>DB: Store content items
    API->>API: Analyze for trends
    API->>DB: Update trends table
    DB-->>API: Trends stored
    API-->>UI: Sync complete
    UI-->>U: Show success + new content
</lov-mermaid>

## Draft Generation Flow

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant UI as UI
    participant API as Edge Function
    participant AI as AI Model
    participant DB as Database
    
    U->>UI: Request new draft
    UI->>API: POST /generate-draft
    API->>DB: Fetch user preferences
    API->>DB: Fetch recent trends
    API->>DB: Fetch past newsletters (style)
    DB-->>API: Return data
    API->>AI: Generate draft with context
    Note over AI: Uses Lovable AI Gateway<br/>Models: Gemini 2.5 Flash (default)<br/>or GPT-5, Gemini Pro
    AI-->>API: Return generated content
    API->>API: Clean formatting (remove escapes)
    API->>API: Apply user style preferences
    API->>DB: Save draft
    DB-->>API: Draft saved
    API-->>UI: Return draft
    UI-->>U: Display draft for review
    U->>UI: Edit & provide feedback
    UI->>API: Update draft + feedback
    API->>DB: Store feedback
    DB-->>API: Saved
    API-->>UI: Updated
</lov-mermaid>

## Component Architecture

<lov-mermaid>
graph TB
    subgraph "Frontend Components"
        A[App.tsx] --> B[Layout]
        B --> C[AppSidebar]
        B --> D[Main Content]
        
        D --> E[Dashboard]
        D --> F[Sources Page]
        D --> G[Trends Page]
        D --> H[Drafts Page]
        D --> I[Draft Editor]
        D --> J[Writing Style Trainer]
        D --> K[Settings]
        
        F --> F1[SourceList Component]
        F --> F2[AddSourceDialog]
        F --> F3[SourceCard]
        
        G --> G1[TrendsList Component]
        G --> G2[TrendCard]
        G --> G3[TrendFilters]
        
        H --> H1[DraftsList Component]
        H --> H2[DraftCard]
        
        I --> I1[Rich Text Editor]
        I --> I2[Preview Panel]
        I --> I3[Feedback Form]
    end
    
    subgraph "State Management"
        L[AppContext] --> M[Sources State]
        L --> N[Trends State]
        L --> O[Drafts State]
        L --> P[User Preferences]
    end
    
    subgraph "UI Components"
        Q[shadcn/ui] --> R[Button]
        Q --> S[Card]
        Q --> T[Dialog]
        Q --> U[Form]
        Q --> V[Table]
        Q --> W[Toast]
    end
    
    E --> L
    F --> L
    G --> L
    H --> L
    I --> L
    
    F1 --> Q
    G1 --> Q
    H1 --> Q
</lov-mermaid>

## State Management Flow

<lov-mermaid>
graph LR
    A[User Action] --> B[UI Component]
    B --> C{Local or Global?}
    C -->|Local| D[Component State]
    C -->|Global| E[AppContext]
    E --> F[Context Provider]
    F --> G[Child Components]
    G --> H[Re-render with new state]
    
    B --> I[API Call]
    I --> J[Supabase Client]
    J --> K[Backend]
    K --> L[Database]
    L --> K
    K --> J
    J --> I
    I --> E
</lov-mermaid>

## Authentication Flow

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant UI as Login Page
    participant Auth as Supabase Auth
    participant DB as Database
    participant App as Protected Routes
    
    U->>UI: Enter credentials
    UI->>Auth: Sign in request
    Auth->>DB: Validate credentials
    DB-->>Auth: User validated
    Auth-->>UI: Session token
    UI->>App: Redirect to Dashboard
    App->>Auth: Verify session
    Auth-->>App: Valid session
    App-->>U: Show Dashboard
    
    Note over U,App: All subsequent requests include auth token
    
    U->>App: Navigate to page
    App->>Auth: Check session
    Auth-->>App: Valid
    App-->>U: Show content
</lov-mermaid>

## Key UI Screens

### 1. Dashboard
- Overview metrics (sources, trends, drafts)
- Quick actions (add source, generate draft)
- Recent activity feed

### 2. Sources Management
- List of all connected sources
- Add new source dialog
- Source status indicators (active/syncing/error)
- Sync controls and last sync timestamps

### 3. Trends Detection
- Grid/list view of detected trends
- Filters (category, sentiment, date range)
- Trend details (mentions, sources, sentiment score)
- Selection for draft generation

### 4. Draft Editor
- Split view (edit/preview)
- AI-generated content
- Manual editing capabilities
- Feedback collection
- Schedule/send controls

### 5. Writing Style Trainer
- Past newsletter upload interface
- Training status dashboard
- Style preference configuration

### 6. Settings
- User preferences
- Email configuration
- Writing style parameters
- Delivery schedule settings
