# CreatorPulse MVP PRD (Minimal Cost) - PRIMARY

> **✅ PRIMARY PRD**
>
> This is the **official PRD** for CreatorPulse MVP development.
>
> **Focus**: Minimal cost validation with free-tier services, SQLite, and open-source tools.
>
> **Note**: A production-grade PRD exists at [CreatorPulse_prd_per.md](./CreatorPulse_prd_per.md) for future reference after MVP validation.

---

## 📝 Abstract
CreatorPulse is a newsletter drafting tool that aggregates free content sources, detects emerging trends, and generates ready-to-send newsletters. The MVP focuses on validating user value (time saved, draft acceptance) using **free APIs, open-source AI models, and minimal cloud resources**.

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

## 📐 Model Requirements
| SPECIFICATION | REQUIREMENT | RATIONALE |
|---------------|------------|-----------|
| Model | Open-source LLaMA / GPT-J | Free / low-cost MVP |
| Context Window | 2–3k tokens | Handle past newsletters |
| Modalities | Text only | MVP focus |
| Fine Tuning | In-context learning only | Avoid paid training |
| Latency | Acceptable for small batch drafts | Free-tier compute |

---

## 🧮 Data Requirements
- >20 past newsletters/posts per user uploaded manually  
- SQLite / CSV storage for MVP  
- Optional incremental improvement via manual feedback loop

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

## 🛠 Minimal Cost Tech Stack
**Frontend:** React.js / simple HTML templates (optional)  
**Backend:** Python FastAPI or Node.js Express (local / free-tier hosting)  
**Database:** SQLite / Google Sheets / Airtable  
**AI / ML:** Open-source LLaMA / GPT-J via Hugging Face free tier or local inference  
**APIs:** Twitter/X free endpoints, YouTube public data, RSS feeds, Google Alerts, Gmail SMTP / MailerSend free tier  
**Infrastructure:** Local deployment or free-tier cloud, cron jobs for scheduled draft generation

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

