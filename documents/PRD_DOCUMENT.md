# CreatorPulse MVP PRD - PRIMARY

> **✅ PRIMARY PRD**
>
> This is the **official PRD** for CreatorPulse MVP development.
>
> **Status**: MVP Implemented on Lovable Cloud with Supabase backend and Lovable AI integration
>
> **Last Updated**: January 2025

---

## 📝 Abstract
CreatorPulse is an AI-powered newsletter automation platform that aggregates content from multiple sources, detects emerging trends, and generates ready-to-send newsletter drafts. The MVP is built on **Lovable Cloud with Supabase backend** and uses **Lovable AI Gateway** for seamless AI model access without API key management.

---

## 🎯 Business Objectives
- Cut newsletter drafting time from 2–3 hours to under 20 minutes.  
- Achieve ≥70% draft-acceptance rate within 90 days.  
- Increase engagement for early adopters using free tools and open channels.  
- Validate the product concept with minimal investment.

---

## 📊 KPI
| GOAL | METRIC | TARGET (first 8–12 weeks) |
|------|--------|---------------------------|
| Reduce newsletter creation time | Avg. review time per accepted draft | ≤ 20 min |
| Improve draft quality | Draft acceptance rate | ≥ 70% |
| Boost engagement | Median uplift in open rate / CTR | ≥ 2× baseline for 60% of users |

---

## 🏆 Success Criteria
- Users review and send drafts in <20 min.  
- ≥70% of AI-generated newsletters accepted with minimal edits.  
- Early users report time savings and consistent publishing.

---

## 🚶‍♀️ User Journeys
- Connect sources → Detect trends → Generate draft → Review → Send → Collect feedback  
- Optional WhatsApp delivery deferred for MVP; web dashboard replaced with Google Sheets / Airtable

---

## 📖 Scenarios
- Daily draft sent via free email service.  
- Inline feedback captured for AI learning.  
- Analytics via free email API or basic spreadsheet tracking.

---

## 🕹️ User Flow
- **Connect Sources:** Free APIs / public endpoints (RSS feeds, Twitter/X, YouTube).  
- **Trend Detection:** Google Alerts + cron jobs.  
- **Writing Style Trainer:** User uploads newsletters (CSV/paste) for in-context learning.  
- **Draft Generation:** Open-source LLM via local inference / Hugging Face free-tier.  
- **Delivery:** Free SMTP (Gmail) or MailerSend free tier.  
- **Feedback:** Inline reactions stored in spreadsheet / lightweight DB.

---

## 🧰 Core Features (MVP)
- **Source Connections:** Twitter/X handles, YouTube channels, Newsletter RSS  
- **Research & Trend Engine:** Scheduled crawls, Google Alerts, cron jobs  
- **Writing Style Trainer:** In-context learning on user-uploaded newsletters  
- **Newsletter Draft Generator:** Auto-drafted content, “Trends to Watch” block  
- **Morning Delivery:** 08:00 local via free email  
- **Feedback Loop:** Inline reactions, auto-diff, improvement over time  
- **Optional Dashboard:** Manage sources and delivery preferences via Google Sheets / Airtable

---

## 🚀 Future Expansion (v2+ Features)
- Google Trends, arXiv, industry blogs integration  
- Auto-scheduler for newsletter send (Beehiiv / Substack API integration)  
- Multi-language draft generation  
- Browser extension for content clipping  
- Social media draft publishing (X / LinkedIn)

---

## 📐 AI Model Requirements
| SPECIFICATION | IMPLEMENTATION | NOTES |
|---------------|----------------|-------|
| AI Gateway | Lovable AI Gateway | No API key management required |
| Primary Model | google/gemini-2.5-flash | Default for balanced performance/cost |
| Alternative Models | google/gemini-2.5-pro, openai/gpt-5 | Available via same gateway |
| Context Window | 4–8k tokens | Handles past newsletters + trends |
| Modalities | Text only | MVP focus |
| Fine Tuning | In-context learning via past newsletters | No model training required |
| Latency | <10 seconds for draft generation | Production-ready performance |

---

## 🧮 Data Requirements
- **Past Newsletters:** Users can upload historical newsletters for style training
- **Database:** PostgreSQL via Supabase with Row Level Security (RLS)
- **Real-time Sync:** Source data synced and trends detected automatically
- **Feedback Storage:** Draft feedback captured for continuous improvement
- **User Preferences:** Customizable settings stored per user

---

## 💬 Prompt Requirements
- Hard-coded policy / refusal filters  
- Personalization from uploaded newsletter samples  
- Output: plain-text or simple HTML for email

---

## 🧪 Testing & Measurement
- Manual QA by early users  
- Feedback tracked in Sheets / CSV  
- Engagement tracked via free email analytics

---

## ⚠️ Risks & Mitigations
| RISK | MITIGATION |
|------|-----------|
| Free API rate limits | Minimize sources, caching, daily limits |
| Email deliverability | Gmail / MailerSend free tier, verified sender domains |
| AI quality | Small batch size, human review before sending |

---

## 💰 Costs
- Development: Free open-source LLM, Google Sheets / Airtable  
- Operational: Free-tier email, free APIs, local inference or Hugging Face hosting

---

## 🔗 Assumptions & Dependencies
- Small user base (5–20 early adopters)  
- No paid cloud hosting; model runs locally or via Hugging Face Spaces  
- Only free / public APIs used  
- WhatsApp integration deferred until funding

---

## 🔒 Compliance/Privacy/Legal
- Store only newsletter content and feedback in free-tier DB / spreadsheet  
- No PII beyond email addresses  
- Users responsible for GDPR compliance of their subscribers

---

## 📣 GTM/Rollout Plan
- Invite 5–20 early adopters (independent creators / small agencies)  
- Collect feedback manually via survey / Sheets  
- Validate MVP value before scaling or investing

---

## 🛠 Production Tech Stack (Implemented)
**Frontend:** React 18.3 + TypeScript + Vite + Tailwind CSS  
**UI Components:** shadcn/ui (Radix UI primitives)  
**Backend:** Supabase (PostgreSQL + Authentication + Edge Functions)  
**AI Integration:** Lovable AI Gateway (Gemini 2.5, GPT-5 models)  
**Email Service:** Resend API for newsletter delivery  
**State Management:** React Context API + React Query  
**Validation:** Zod schemas for type-safe data validation  
**Deployment:** Lovable Cloud with automatic CI/CD  
**Edge Functions:** Deno-based serverless functions for backend logic

---

## 🏗 Development Plan (Minimal Cost MVP)
**Phase 1: Setup & Source Integration (1–2 weeks)**
- Connect RSS feeds, Twitter/X free endpoints, YouTube public channels  
- Store source metadata in Google Sheets / Airtable

**Phase 2: Trend Detection & Scheduling (1 week)**
- Implement cron jobs / lightweight scheduler  
- Set up Google Alerts or lightweight scraping for trend spikes

**Phase 3: AI Draft Generation (2 weeks)**
- Integrate open-source LLaMA / GPT-J model  
- Implement in-context learning on user-uploaded newsletters  
- Generate newsletter drafts + “Trends to Watch” block

**Phase 4: Delivery System (1 week)**
- Configure Gmail SMTP / MailerSend free-tier for automated draft delivery  
- Test 08:00 local delivery scheduling

**Phase 5: Feedback Loop & Tracking (1 week)**
- Collect inline 👍/👎 feedback in Sheets / CSV  
- Auto-diff to track edits and improve source/style rankings

**Phase 6: Manual QA & Early User Testing (1 week)**
- Internal QA for draft quality, trend accuracy, and delivery  
- Rollout to 5–20 early adopters, collect feedback

**Phase 7: Optional Dashboard Setup (1 week)**
- Simple interface in Google Sheets / Airtable to manage sources, delivery preferences, and usage

**Phase 8: Evaluation & Next Steps (1 week)**
- Measure KPIs (draft acceptance rate, review time, engagement uplift)  
- Document roadmap for v2+ paid expansions

