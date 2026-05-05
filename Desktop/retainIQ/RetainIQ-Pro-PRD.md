# RetainIQ Pro — Product Requirements Document

> **Version:** 1.0 — Production Release
> **Date:** May 5, 2026
> **Status:** APPROVED — Ready for Engineering
> **Confidentiality:** Internal — Do Not Distribute

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Market Opportunity](#2-problem-statement--market-opportunity)
3. [Target Market & User Personas](#3-target-market--user-personas)
4. [Product Vision & Strategic Goals](#4-product-vision--strategic-goals)
5. [Core Features — Full Specification](#5-core-features--full-specification)
   - 5.1 Behavioral Churn-Risk Scoring Engine
   - 5.2 Smart Sequencing & Omnichannel Automation
   - 5.3 Replenishment AI
   - 5.4 Review & UGC Capture Loop
   - 5.5 Branded Tracking Experience
   - 5.6 Analytics & Intelligence Dashboard
6. [Technical Architecture](#6-technical-architecture)
7. [Tech Stack — Full Breakdown](#7-tech-stack--full-breakdown)
8. [Data Models & Schemas](#8-data-models--schemas)
9. [API Specification](#9-api-specification)
10. [ML Model Specifications](#10-ml-model-specifications)
11. [Performance & SLA Requirements](#11-performance--sla-requirements)
12. [Security Architecture](#12-security-architecture)
13. [Monetisation Model](#13-monetisation-model)
14. [Competitive Analysis](#14-competitive-analysis)
15. [Go-to-Market Strategy](#15-go-to-market-strategy)
16. [Product Roadmap](#16-product-roadmap)
17. [Success Metrics & KPIs](#17-success-metrics--kpis)
18. [Risk Analysis & Mitigations](#18-risk-analysis--mitigations)
19. [Compliance & Data Governance](#19-compliance--data-governance)
20. [Infrastructure & DevOps](#20-infrastructure--devops)
21. [Appendix](#21-appendix)

---

## 1. Executive Summary

RetainIQ Pro is a production-grade, AI-powered **post-purchase retention platform** purpose-built for Shopify Direct-to-Consumer (D2C) brands. It closes the single most expensive gap in modern e-commerce: brands spend 5–10× more acquiring a customer than keeping one, yet 80% of post-purchase journeys are handled by generic confirmation emails that drive zero incremental LTV.

RetainIQ Pro turns every completed order into a structured, data-rich retention event. The platform:
- Automatically **scores churn risk** within 2 hours of purchase
- Fires **personalised WhatsApp / SMS / email sequences** timed to each customer's behaviour
- **Predicts individual SKU replenishment dates** with ML-grade accuracy
- **Closes the review loop** at the exact moment satisfaction peaks (T+72h), not 30 days later

### Key Outcomes (Validated Beta Data)

| Metric | Lift vs. Baseline | Window |
|--------|------------------|--------|
| Repeat purchase rate | **+34%** | 6 months post-install |
| Customer LTV | **2.1×** | 6 months post-install |
| Average review volume | **+290%** | Per order, 72h window |
| Return rate | **−18%** | 30 days post-delivery |
| WhatsApp open rate | **87%** | vs. 24% email baseline |
| Time to first repurchase | **−11 days** | Median, consumables |
| One-tap reorder conversion | **22%** | Replenishment nudges |

**Average setup time for a Shopify merchant: < 1 hour (plug-and-play OAuth flow).**

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Retention Crisis in D2C

The D2C e-commerce sector has undergone a structural shift since iOS 14.5 privacy changes in 2021 decimated Meta ROAS benchmarks. Customer acquisition costs rose **60% between 2021–2024**, while average repeat-purchase rates for Shopify brands under $10M ARR remain **below 28%**. Brands are running cash-flow-negative acquisition engines subsidised by first orders that never convert to long-term customers.

### 2.2 Root Causes

| Problem | Current State | Impact |
|---------|--------------|--------|
| No structured post-purchase journey | Avg. brand sends 1.2 emails post-order, all logistics-focused | Zero incremental LTV from the most receptive window |
| Zero behavioural intelligence | Repurchase nudges on fixed 30-day schedules | Wrong timing kills conversion |
| Channel mismatch | 18–24% email open rates for promo content | 63% of messages go unseen |
| Review timing failure | Reviews requested at 30 days | < 4% collection rate vs. 22% at 72h |
| No early churn signal | Churn discovered 90+ days post-fact | Win-back nearly impossible |
| Tool fragmentation | 4–6 point solutions stitched together | Data silos, high ops overhead |

### 2.3 Market Opportunity

| Segment | Size (2025) | CAGR | Addressable |
|---------|-------------|------|-------------|
| Global D2C e-commerce market | $239B | 14.3% | Partially |
| Shopify merchant base (active stores) | 4.6M | — | Yes — App Store |
| Shopify Plus merchants (enterprise) | ~32,000 | — | Yes — direct sales |
| Customer retention software market | $8.1B | 16.1% | Yes — horizontal |
| WhatsApp Commerce TAM | $3.6B | 27% | Yes — channel layer |
| India D2C market alone | $61B | 19.7% | Yes — WhatsApp-first |

### 2.4 The Gap

Existing solutions each own **one layer**:
- Klaviyo → email automation
- Yotpo → reviews + loyalty  
- Postscript → SMS
- AfterShip → tracking pages
- Gorgias → support

**No single platform unifies behavioural scoring + omnichannel sequencing + replenishment AI + review capture in a Shopify-native app. RetainIQ Pro is that platform.**

---

## 3. Target Market & User Personas

### 3.1 Primary Segment

Shopify D2C brands generating **$500K – $15M ARR** in consumables, beauty, wellness, pet, and food categories with inherent repeat-purchase potential.

### 3.2 Persona A — The Growth-Obsessed Founder ("Maya")

| Attribute | Detail |
|-----------|--------|
| **Role** | Founder / CEO, 8-person brand |
| **Revenue** | $1.2M ARR, 60% from new customer acquisition |
| **Pain** | Meta ROAS at 1.4×; can't keep buying new customers |
| **Goal** | Double repeat rate from 22% → 44% in 12 months |
| **Current stack** | Shopify, Klaviyo, WhatsApp Business (manual), no CRM |
| **Key need** | Setup < 1 hour; no engineering resources; clear ROI dashboard |
| **Willingness to pay** | $299/mo if it demonstrably reduces CAC payback period |
| **Success metric** | Repeat purchase rate, payback period on first order |

### 3.3 Persona B — The CRM Manager ("Rohan")

| Attribute | Detail |
|-----------|--------|
| **Role** | Head of CRM / Retention, 45-person brand |
| **Revenue** | $8M ARR — already has Klaviyo + Yotpo |
| **Pain** | WhatsApp is a manual side project; tools don't talk to each other |
| **Goal** | Unified omnichannel flows, predictive replenishment, reduced tool sprawl |
| **Current stack** | Shopify Plus, Klaviyo, Yotpo, Postscript, AfterShip — 5 tools for 1 job |
| **Key need** | WhatsApp + email + SMS orchestration from one place; segment export |
| **Willingness to pay** | $799/mo for platform consolidation + advanced analytics |
| **Success metric** | Workflow hours saved, LTV lift per cohort |

### 3.4 Persona C — The Enterprise VP ("NykaaFashion-tier")

| Attribute | Detail |
|-----------|--------|
| **Role** | VP E-commerce + dedicated data team |
| **Revenue** | $15M+ ARR |
| **Pain** | No predictive layer; A/B testing is manual; no ML for replenishment |
| **Goal** | Custom ML models, data warehouse export, SLA-backed uptime |
| **Current stack** | Shopify Plus, custom ERP, BigQuery |
| **Key need** | API-first integration, SSO, raw event streaming, custom model endpoints |
| **Willingness to pay** | $2,500+/mo on annual contract |
| **Success metric** | Predicted vs actual LTV, operational cost reduction |

---

## 4. Product Vision & Strategic Goals

### 4.1 Vision Statement

> *"Make every post-purchase moment a compounding asset — not a missed opportunity. RetainIQ Pro is the operating system for D2C retention: behavioural intelligence, personalised omnichannel sequencing, and predictive reorder — all from one Shopify app."*

### 4.2 Strategic Goals (12-Month)

| ID | Goal | Target | Metric |
|----|------|--------|--------|
| G1 | Adoption | 2,000 active Shopify installs | Monthly active stores |
| G2 | Revenue | $2.4M ARR by month 12 | MRR × 12 |
| G3 | Retention | > 92% net revenue retention | NRR rolling 6-month |
| G4 | Merchant outcome | +30% avg repeat rate lift for cohort | Repeat rate delta 6-month |
| G5 | Channel coverage | WhatsApp live in India, Indonesia, Brazil | Geo-active WA merchants |
| G6 | Platform trust | SOC 2 Type II + GDPR + DPDP (India) compliant | Audit completion |

---

## 5. Core Features — Full Specification

### 5.1 Behavioral Churn-Risk Scoring Engine

Assigns a real-time churn-risk score (0–100) to every customer within **2 hours** of order completion. Score drives all downstream automation branching.

#### 5.1.1 Input Signals

| Signal | Weight | Source | Latency |
|--------|--------|--------|---------|
| AOV vs. brand median | High | Shopify Order API | Real-time |
| Number of previously viewed SKUs | High | Pixel / Storefront API | Real-time |
| Cart abandonment history | High | Shopify Cart API | Historical |
| Days since last purchase | Medium | Customer API | Historical |
| Discount code used (Y/N) | Medium | Order API | Real-time |
| Product category churn baseline | Medium | Internal benchmark DB | Pre-computed |
| NPS score (if prior customer) | Medium | Review module | Historical |
| Geographic region | Low | Shipping address | Real-time |
| Device type at order | Low | Pixel | Real-time |
| Email open history (last 90 days) | Low | Email provider webhook | Historical |

#### 5.1.2 Model Architecture

- **Algorithm:** Gradient-boosted decision trees (LightGBM) + online learning layer for per-brand fine-tuning
- **Training cadence:** Weekly global retrain; daily incremental update per brand
- **Cold-start:** Rule-based scoring (AOV + category baseline) for brands with < 200 orders
- **Score freshness SLA:** Score available within 90 seconds of `order.paid` webhook receipt
- **Score API:** `GET /v1/customers/{id}/churn-score` returns `{score, features[], computed_at}`
- **Explainability:** SHAP values for top-3 contributing features returned per API call

#### 5.1.3 Score-to-Action Routing

| Score Range | Segment | Action Triggered |
|-------------|---------|-----------------|
| 0–39 | Low risk | Referral programme invite queued at T+2h |
| 40–69 | Medium risk | Standard journey — usage tip + community invite |
| 70–84 | High risk | Personalised discount offer (dynamic %) at T+2h |
| 85–100 | Critical risk | Immediate WhatsApp outreach + VIP recovery offer |

#### 5.1.4 Acceptance Criteria

- **AC-1:** Score produced for 100% of orders within 120s of `order.paid` event under p99 load
- **AC-2:** Precision @ threshold 70 ≥ 0.72 on held-out validation set
- **AC-3:** Score API latency p50 < 80ms, p99 < 300ms
- **AC-4:** Model drift alert fires if AUC drops > 0.05 from baseline on rolling 7-day window
- **AC-5:** Merchant can manually override score for any customer via dashboard

---

### 5.2 Smart Sequencing & Omnichannel Automation

Event-driven orchestration engine that auto-triggers personalised WhatsApp, SMS, and email touchpoints along the post-purchase journey.

#### 5.2.1 Full Journey Timeline

| Trigger | Channel Priority | Content Type | Condition |
|---------|-----------------|--------------|-----------|
| `order.paid` (T+0) | WhatsApp > Email | Branded order confirmation + unboxing preview | Always |
| T+2h (score computed) | Internal | Branch logic activated | Always |
| T+2h (high risk ≥70) | WhatsApp > SMS | Personalised discount offer (dynamic %) | Score ≥ 70 |
| T+2h (low risk <40) | WhatsApp > Email | Referral programme invite | Score < 40 |
| T+24h | WhatsApp > SMS | Usage tip + community invite | Always |
| T+72h | WhatsApp > Email | Review + UGC capture | Delivered = true |
| T+Day N (replenishment) | WhatsApp > SMS | 1-tap reorder nudge | Consumable SKU |
| T+Day N+7 (no reorder) | SMS > Email | Win-back with FOMO offer | No reorder placed |
| T+14d | WhatsApp | NPS survey (0–10 scale) | Always |
| T+60d (dormant) | Email | Re-engagement — best-seller showcase | 0 orders in 60d |

#### 5.2.2 Channel Engine Specs

**WhatsApp**
- Provider: Meta WhatsApp Business Cloud API v18+ (primary); Gupshup fallback for India
- Template approval management built into admin dashboard
- Delivery receipt webhook → retry logic (max 3 attempts, 30-min intervals)
- Interactive message types: buttons (up to 3), list (up to 10 items), flow (multi-step)
- Opt-in required: customer must explicitly opt in at Shopify checkout before any WA message

**SMS**
- Primary: Twilio (global)
- India: MSG91
- EU: Vonage
- Carrier lookup to avoid landline delivery waste
- Time-of-day restrictions enforced (8am–9pm local time, TCPA compliant)

**Email**
- Provider: SendGrid (transactional)
- Klaviyo list-sync for campaign overlap prevention
- DKIM + SPF + DMARC enforced on all outbound domains
- AMP-for-email support for interactive elements (star rating inline)

#### 5.2.3 Personalisation Variables

| Variable | Source |
|----------|--------|
| `{{first_name}}` | Shopify Customer API |
| `{{product_name}}` | Order line item |
| `{{product_image_url}}` | Shopify Product API |
| `{{discount_pct}}` | AI discount engine (risk-tiered) |
| `{{discount_code}}` | Generated per-customer |
| `{{reorder_date}}` | Replenishment model output |
| `{{referral_link}}` | Generated per-customer referral URL |
| `{{review_link}}` | Dynamic deep-link to review widget |
| `{{usage_tip}}` | SKU-level tip library (brand-uploaded) |
| `{{community_link}}` | Brand WhatsApp group / Discord |
| `{{tracking_url}}` | Branded tracking page URL |
| `{{nps_link}}` | Unique NPS survey link |

#### 5.2.4 A/B Testing Engine

- Split traffic by percentage (e.g., 50/50, 80/20)
- Test dimensions: message content, send time (±1h / ±3h / ±6h), channel order
- Statistical significance detection at p < 0.05 (two-tailed z-test)
- Auto-promote winner after significance reached; archive loser
- Results visible in dashboard with confidence intervals

#### 5.2.5 Acceptance Criteria

- **AC-1:** Message delivery within 5 min of trigger time for ≥ 99% of events under normal load
- **AC-2:** Channel fallback executes within 10 min if primary delivery fails
- **AC-3:** Unsubscribe / opt-out processed within 30s; no further messages sent to that channel
- **AC-4:** No `{{unfilled}}` tokens rendered in any live message (pre-send validation enforced)
- **AC-5:** A/B test runner handles split at ingestion layer (not post-hoc) to avoid bias

---

### 5.3 Replenishment AI

Predicts the exact date each customer will run out of a given SKU, triggers a personalised reorder nudge 3 days before predicted depletion, and enables one-tap reorder via WhatsApp.

#### 5.3.1 Prediction Model

| Attribute | Specification |
|-----------|--------------|
| Algorithm | Bayesian survival model (Weibull-Gamma mixture) per customer×SKU pair |
| Features | Purchase cadence history, SKU volume/weight, product type taxonomy, household size proxy (AOV), subscription flag |
| Cold start | Category-level median from brand's order history; global prior for new brands |
| Minimum data | 2 prior purchases of same SKU to activate personalised prediction |
| Confidence output | Predicted date ± uncertainty interval (shown to merchant, hidden from customer) |
| Model update | Real-time Bayesian posterior update on every new purchase event |
| Accuracy KPI | MAE ≤ 5 days on held-out cohort (consumables category) |

#### 5.3.2 WhatsApp One-Tap Reorder Flow

```
Day N-3: WhatsApp sent
  → Product image + name + price
  → CTA button: "Reorder Now 🛒"
  
Customer taps "Reorder Now"
  → Pre-filled Shopify checkout URL (Shop Pay / saved card)
  → Checkout < 1.5s load time on 4G
  
Order placed
  → Confirmation echoed back to WA thread within 60s
  → Reorder event triggers new churn score computation
  → Replenishment prediction updated

Day N+7 (if no reorder)
  → Win-back escalation: FOMO offer + urgency framing
```

#### 5.3.3 Merchant Controls

- Set global or per-SKU "advance notice" days (default: 3, range: 1–14)
- Exclude SKUs from replenishment programme
- Override predicted date manually per customer
- View replenishment forecast calendar (next 30/60/90 days)
- Pause replenishment flow while a subscription is active (Recharge integration)

#### 5.3.4 Acceptance Criteria

- **AC-1:** Reorder date computed for all eligible customer×SKU pairs within 5 min of qualifying 2nd purchase
- **AC-2:** Reorder conversion rate from replenishment WhatsApp ≥ 18% (validated beta)
- **AC-3:** One-tap reorder checkout load time < 1.5s on 4G connection
- **AC-4:** MAE ≤ 5 days for consumables category at brand with ≥ 500 orders
- **AC-5:** Model uncertainty interval narrows with each additional purchase (verified via unit test)

---

### 5.4 Review & UGC Capture Loop

Captures star ratings, written reviews, photo/video UGC, and NPS at T+72h post-delivery. Automatically routes responses based on rating.

#### 5.4.1 Review Capture Flow

```
T+72h after delivery confirmed
  ↓
WhatsApp: "How's [Product Name]? Rate in one tap 👇"
  [⭐] [⭐⭐] [⭐⭐⭐] [⭐⭐⭐⭐] [⭐⭐⭐⭐⭐]

5★ tap:
  → "Amazing! Add a photo/review to help others?"
  → Inline WA flow: text input + optional image/video upload
  → Auto-submit to storefront + Google Business + Meta

4★ tap:
  → Short written review prompt
  → Publish to storefront
  → Soft upsell (related product)

3★ tap:
  → "What could be better?" (sizing / quality / delivery / other)
  → Support ticket created in Gorgias / Freshdesk
  → Merchant alerted in dashboard

1–2★ tap:
  → Human-agent alert (< 2 min)
  → Recovery offer: replacement or full refund
  → Private WhatsApp message, no auto-publish
  → Flagged in analytics as "at-risk recovery"
```

#### 5.4.2 Review Routing Matrix

| Rating | Auto-publish | Platform | Delay | Merchant Alert |
|--------|-------------|----------|-------|----------------|
| 5★ | Yes | Google Business + Meta (FB/IG) + Storefront | Immediate | No |
| 4★ | Yes | Shopify storefront widget | Immediate | No |
| 3★ | No (held) | Internal support queue | < 5 min | Yes |
| 1–2★ | No | Private WA + recovery offer only | < 2 min | Yes (urgent) |

#### 5.4.3 UGC Management

- Photo/video stored in brand's RetainIQ media library (S3, CloudFront CDN)
- Merchant approval workflow before storefront appearance
- One-click republish to Instagram Stories via Meta Content Publishing API
- UGC tagged with: product SKU, review date, customer segment, star rating
- Bulk export for ad creative use (with customer consent flag)

#### 5.4.4 NPS Engine (T+14d)

- Separate NPS survey fires at T+14d post-delivery (decoupled from review flow)
- In-message 0–10 scale via WhatsApp interactive buttons or email embedded widget
- **Detractors (0–6):** Auto-tagged 'at-risk' in CRM; personal follow-up queued within 24h
- **Passives (7–8):** Educational content about product features sent
- **Promoters (9–10):** Automatically invited to referral programme
- NPS trend chart in analytics dashboard with segment drill-down

#### 5.4.5 Acceptance Criteria

- **AC-1:** Review request delivered within 5 min of T+72h trigger for ≥ 99.5% of eligible orders
- **AC-2:** 5★ reviews published to Google/Meta within 2 min of submission
- **AC-3:** 1–2★ alert delivered to merchant within 2 min; zero auto-publish
- **AC-4:** UGC upload: JPEG/PNG/MP4; max 50MB; CDN-transcoded within 3 min
- **AC-5:** Review collection rate (responses / requests) ≥ 22% baseline

---

### 5.5 Branded Tracking Experience

Replaces Shopify's generic order confirmation and carrier tracking pages with a fully branded, conversion-optimised post-purchase experience.

#### 5.5.1 Page Components

| Component | Description |
|-----------|-------------|
| Real-time carrier tracking | Visual progress bar (EasyPost API), estimated delivery window |
| Unboxing preview | Brand-uploaded GIF / short video of product unboxing |
| "What to expect" rail | Customisable content cards: usage tips, setup guides, community links |
| Next-order module | Personalised bestseller recommendation (purchase + browse history) |
| Referral CTA | Unique referral link with social share to WhatsApp / Instagram |
| Review CTA (T+72h) | Star rating widget appears inline once 72h post-delivery passes |
| Loyalty progress bar | Points balance and next-tier progress (if loyalty module enabled) |
| Live chat widget | Optional Gorgias / Tidio embed for pre-delivery questions |

#### 5.5.2 Technical Specs

- **URL structure:** `trackingiq.app/{brand_handle}/orders/{order_token}` — custom domain supported
- **Performance targets:** LCP < 2.0s on 4G; CLS < 0.1; FID < 100ms (Core Web Vitals Green)
- **Carrier support:** DHL, FedEx, UPS, USPS, Delhivery, Bluedart, Shiprocket + 500+ via EasyPost
- **Mobile-first:** PWA-installable via "Add to Home Screen" prompt
- **Personalisation:** Every element renders per-customer; cached at edge per order token
- **Analytics:** Every click tracked → feeds next-session personalisation engine

---

### 5.6 Analytics & Intelligence Dashboard

#### 5.6.1 Dashboard Modules

| Module | Contents |
|--------|----------|
| Retention Overview | Repeat rate trend, LTV curve, churn rate, cohort heatmap |
| Flow Performance | Per-sequence open/click/conversion rates; revenue attributed per flow |
| Channel Analytics | WhatsApp / SMS / Email side-by-side delivery, open, click, conversion |
| Replenishment Forecast | 30/60/90 day reorder forecast; individual customer reorder calendar |
| Review Intelligence | Star distribution, NPS trend, UGC library, review velocity by SKU |
| Customer Segments | AI-generated: Champions / Loyal / At-Risk / Dormant / New |
| Revenue Attribution | RetainIQ-attributed revenue per channel per time period |
| A/B Test Results | Live + completed experiments with confidence intervals + winner |
| Churn Risk Heatmap | Real-time map of score distribution across customer base |

#### 5.6.2 Data Export & Integrations

- CSV / JSON export on any date range, any metric
- **BigQuery / Snowflake** live sync (Growth and Enterprise tiers)
- **Klaviyo segment sync:** push RetainIQ AI segments as Klaviyo lists in real time
- **Webhook API:** POST to any URL on score-change, review-received, reorder-placed events
- **Looker Studio connector** (pre-built template available on install)

---

## 6. Technical Architecture

### 6.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SHOPIFY ECOSYSTEM                               │
│  Store Webhook Events ──► Pixel (Storefront) ──► Checkout Extension     │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTPS + HMAC verified
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Kong)                              │
│            Auth (JWT/OAuth) · Rate Limit · CORS · Routing               │
└───────┬───────────┬───────────┬──────────┬──────────┬───────────────────┘
        │           │           │          │          │
        ▼           ▼           ▼          ▼          ▼
  ingestion-svc  scoring-svc  orch-svc  review-svc  admin-svc
  (Fastify)      (FastAPI)    (BullMQ)  (Fastify)   (Next.js)
        │           │           │
        ▼           ▼           ▼
   ┌─────────────────────────────────┐
   │      Apache Kafka (MSK)         │
   │  Topics: orders · scores ·      │
   │  messages · reviews · events    │
   └──────────────┬──────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
  channel-svc  replenish-svc  analytics-svc
  (Fastify)    (FastAPI)      (FastAPI+ClickHouse)
        │
        ├──► Meta WhatsApp Cloud API
        ├──► Twilio / MSG91 (SMS)
        └──► SendGrid (Email)

Data Layer:
  PostgreSQL 16 (RDS Multi-AZ)   ← transactional
  Redis 7 (ElastiCache)          ← feature cache / session
  ClickHouse (EKS)               ← analytics time-series
  S3 + CloudFront                ← UGC / static assets
  Apache Kafka (MSK)             ← event backbone

ML Layer:
  MLflow (model registry)
  Triton Inference Server (GPU)  ← churn scoring serving
  FastAPI (CPU)                  ← replenishment serving
  LightGBM · Bayesian Survival · Multilingual BERT
```

### 6.2 Microservices Map

| Service | Responsibility | Language | Framework | Scaling Strategy |
|---------|---------------|----------|-----------|-----------------|
| `ingestion-svc` | Shopify webhook receive, HMAC verify, Kafka produce | Node.js | Fastify | Horizontal, 20 pods max |
| `scoring-svc` | Churn score computation, model serving, SHAP | Python | FastAPI + Triton | GPU node, auto-scale |
| `orchestration-svc` | Journey trigger logic, branch evaluation, scheduling | Node.js | BullMQ + Redis | Horizontal, queue-backed |
| `channel-svc` | WhatsApp/SMS/Email dispatch, delivery tracking, retry | Node.js | Fastify | Horizontal, per-channel pod |
| `replenishment-svc` | Bayesian model inference, reorder date API | Python | FastAPI | CPU, auto-scale |
| `review-svc` | Review capture, routing, UGC storage, platform publish | Node.js | Fastify | Horizontal |
| `tracking-svc` | Branded tracking page, EasyPost polling, edge cache | TypeScript | Next.js 14 | Vercel Edge / CloudFront |
| `analytics-svc` | Metrics aggregation, dashboard queries, cohort compute | Python | FastAPI + ClickHouse | Read replicas |
| `api-gateway` | Auth, rate limiting, routing, CORS | — | Kong Gateway | HA, 3 replicas minimum |
| `admin-svc` | Merchant onboarding, settings, billing, Shopify OAuth | TypeScript | Next.js 14 + tRPC | Serverless (Vercel) |
| `ml-training` | Scheduled model retraining, evaluation, registry push | Python | Prefect + MLflow | Spot GPU instances |
| `notification-svc` | Internal alerts, PagerDuty webhooks, Slack ops alerts | Node.js | Fastify | Minimal, low traffic |

### 6.3 Event Flow — Order Placed to First Message

```
1. Customer places order on Shopify
2. Shopify fires order.paid webhook → ingestion-svc
3. ingestion-svc: HMAC verify → publish to Kafka topic: orders.paid
4. scoring-svc: consumes orders.paid → pulls customer features from Redis + PostgreSQL
5. scoring-svc: runs LightGBM inference → publishes score to Kafka topic: scores.computed
6. orchestration-svc: consumes scores.computed → evaluates branch logic
7. orchestration-svc: enqueues message job in BullMQ (Redis) with scheduled_at timestamp
8. channel-svc: picks up job at trigger time → selects channel → renders template
9. channel-svc: dispatches to Meta WA API / Twilio / SendGrid
10. Provider: fires delivery webhook → channel-svc updates flow_executions table
11. analytics-svc: consumes all events → writes to ClickHouse for dashboard
```

---

## 7. Tech Stack — Full Breakdown

### 7.1 Frontend

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | Next.js | 14.x (App Router) | SSR + ISR for tracking pages; RSC for dashboard |
| **Language** | TypeScript | 5.x | Full type safety across frontend + API contracts |
| **Styling** | Tailwind CSS | 3.x | Utility-first, consistent design system |
| **UI Components** | shadcn/ui + Radix UI | Latest | Accessible, unstyled primitives |
| **State Management** | Zustand | 4.x | Lightweight, no boilerplate |
| **Server State** | TanStack Query (React Query) | 5.x | Cache + background refetch for dashboard data |
| **API Communication** | tRPC | 11.x | End-to-end type safety, admin-svc ↔ frontend |
| **Charts** | Recharts | 2.x | Composable, React-native charting |
| **Forms** | React Hook Form + Zod | Latest | Validation + schema sharing with backend |
| **Drag-and-drop** | dnd-kit | Latest | Journey flow builder UI |
| **Rich text** | Tiptap | 2.x | WhatsApp template message editor |
| **Date handling** | date-fns | 3.x | Tree-shakable, timezone-aware |
| **Testing** | Vitest + Playwright | Latest | Unit + E2E, CI-friendly |
| **Bundler** | Turbopack (Next.js built-in) | — | Fast HMR in dev |

### 7.2 Backend Services (Node.js)

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Runtime** | Node.js | 20 LTS | LTS stability, good Kafka/WA SDK support |
| **Framework** | Fastify | 4.x | 2× faster than Express, built-in JSON schema validation |
| **Language** | TypeScript | 5.x | Type safety, shared types with frontend via monorepo |
| **Queue** | BullMQ | 5.x | Redis-backed job queue with delayed jobs, priorities, retries |
| **ORM** | Drizzle ORM | Latest | Type-safe, lightweight, SQL-first |
| **Validation** | Zod | 3.x | Runtime + compile-time validation, shared with frontend |
| **Auth** | jose (JWT) | Latest | JWT sign/verify, JWKS support |
| **Kafka client** | kafkajs | 2.x | Pure JS Kafka producer/consumer |
| **Redis client** | ioredis | 5.x | Cluster support, Lua scripts |
| **HTTP client** | undici | Latest | Node.js native, high-performance |
| **Testing** | Vitest + Supertest | Latest | Unit + integration |
| **Logging** | Pino | 8.x | Structured JSON logging, low overhead |
| **Tracing** | OpenTelemetry SDK | Latest | OTLP export to Grafana Tempo |

### 7.3 Backend Services (Python — ML/Analytics)

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Runtime** | Python | 3.12 | Latest stable, typing improvements |
| **Framework** | FastAPI | 0.111.x | Async, OpenAPI auto-docs, Pydantic v2 |
| **ML — Churn** | LightGBM | 4.x | Best GBDT for tabular; fast inference |
| **ML — Replenishment** | PyMC | 5.x | Bayesian survival models |
| **ML — Reviews** | HuggingFace Transformers | 4.x | Fine-tuned mBERT for multilingual sentiment |
| **ML Serving** | Triton Inference Server | 24.x | NVIDIA, high-throughput GPU serving |
| **ML Tracking** | MLflow | 2.x | Experiment tracking + model registry |
| **Feature engineering** | Polars | 0.20.x | Rust-backed DataFrames, 10× faster than Pandas |
| **Orchestration** | Prefect | 3.x | ML pipeline scheduling, retries, alerting |
| **Explainability** | SHAP | 0.45.x | SHAP values for churn score feature attribution |
| **Validation** | Pydantic | 2.x | Input/output validation |
| **Testing** | Pytest + hypothesis | Latest | Unit + property-based tests |
| **Logging** | structlog | Latest | Structured logging |

### 7.4 Data Infrastructure

| Component | Technology | Version | Config |
|-----------|-----------|---------|--------|
| **Primary DB** | PostgreSQL | 16 | RDS Multi-AZ, db.r6g.2xlarge, 500GB gp3 |
| **Migrations** | Drizzle Kit | Latest | Version-controlled, reviewed in CI |
| **Event streaming** | Apache Kafka | 3.7 (MSK) | 6-broker cluster, 3 AZ, 30-day retention |
| **Job queue** | Redis | 7.2 (ElastiCache) | Cluster mode, 3 shards, r6g.large |
| **Feature cache** | Redis | 7.2 (ElastiCache) | Separate cluster, 64GB, volatile-lru eviction |
| **Analytics DB** | ClickHouse | 24.x (self-hosted EKS) | 3-shard, 2-replica, MergeTree engine |
| **Object storage** | AWS S3 | — | Standard + IA tiering; versioning enabled |
| **CDN** | CloudFront | — | Edge caching for UGC + tracking pages |
| **Search** | OpenSearch | 2.x (managed) | Customer + SKU search in dashboard |
| **Secrets** | AWS Secrets Manager | — | Rotated every 90 days |
| **Config** | AWS Parameter Store | — | Feature flags, per-tenant config |

### 7.5 Infrastructure & DevOps

| Component | Technology | Config |
|-----------|-----------|--------|
| **Container runtime** | Docker | Multi-stage builds, distroless base images |
| **Orchestration** | Amazon EKS | 1.30, Managed Node Groups |
| **GitOps** | ArgoCD | 2.x, app-of-apps pattern |
| **CI/CD** | GitHub Actions | Monorepo with Turbo caching |
| **IaC** | Terraform | 1.8.x, S3 backend, workspace per env |
| **Service mesh** | Istio | 1.22, mTLS between all services |
| **Ingress** | AWS ALB + Kong Gateway | WAF enabled |
| **Autoscaling** | KEDA | Event-driven: Kafka lag → scale channel-svc |
| **Monitoring** | Prometheus + Grafana | 30-day metrics retention |
| **Tracing** | Grafana Tempo + OTLP | Distributed tracing across all services |
| **Logging** | Grafana Loki + Promtail | Structured log aggregation |
| **Alerting** | Grafana Alerting + PagerDuty | On-call rotation for P0/P1 |
| **Uptime monitoring** | Better Uptime | Public status page at status.retainiq.app |
| **Feature flags** | Growthbook | Self-hosted, PostgreSQL-backed |
| **Edge compute** | Vercel Edge Functions | tracking-svc + admin-svc |
| **DNS** | AWS Route 53 | Latency-based routing |
| **Certificate** | AWS ACM | Wildcard cert, auto-renewed |

### 7.6 Shopify Integration Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| **App framework** | Shopify App Bridge 3.x | Embedded app in Shopify Admin |
| **OAuth** | Shopify OAuth 2.0 | Offline access token for webhooks |
| **API version** | 2024-04 (stable) | Pinned, upgrade reviewed quarterly |
| **Webhooks** | HTTPS webhooks with HMAC-SHA256 | Registered on install |
| **Storefront** | Storefront API (GraphQL) | Product recommendations, public token |
| **Pixel** | Shopify Web Pixel API | Browse depth, add-to-cart signals |
| **Checkout** | Shopify Checkout Extensions | Opt-in widget at checkout |
| **Admin extensions** | Shopify Admin UI Extensions | Quick score view in order detail page |
| **Billing** | Shopify App Billing API | Recurring charges, usage billing |
| **Rate limiting** | Token bucket (40 req/s Plus, 2 req/s Basic) | In-house middleware |

### 7.7 Third-Party Channel APIs

| Channel | Provider | SDK/API | Fallback |
|---------|---------|---------|---------|
| WhatsApp | Meta Cloud API v18+ | Direct REST + webhooks | Gupshup BSP |
| SMS (Global) | Twilio | `twilio` Node.js SDK | Vonage |
| SMS (India) | MSG91 | REST API | Twilio |
| Email | SendGrid | `@sendgrid/mail` | AWS SES |
| Carrier tracking | EasyPost | REST API | AfterShip API |
| Google reviews | Google My Business API | REST | Manual link |
| Meta reviews | Meta Graph API v19+ | REST | Manual link |
| Payment (billing) | Stripe | `stripe` Node.js SDK | None (critical) |
| Support ticketing | Gorgias API / Freshdesk API | REST webhooks | — |

### 7.8 Security Stack

| Control | Technology |
|---------|-----------|
| **WAF** | AWS WAF (managed rules + custom) |
| **DDoS protection** | AWS Shield Standard |
| **Secret scanning** | Trufflehog in CI, GitHub secret scanning |
| **SAST** | Semgrep (custom rules for Shopify patterns) |
| **DAST** | OWASP ZAP (weekly scheduled scan) |
| **Dependency scanning** | Snyk (PR + scheduled) |
| **Container scanning** | Trivy in CI |
| **Pen-testing** | Annual third-party, HackerOne private programme |
| **mTLS** | Istio service mesh (all internal service-to-service) |
| **Secrets rotation** | AWS Secrets Manager auto-rotation (90d) |
| **Audit logging** | CloudWatch Logs (immutable, 90d hot / 1yr cold) |

---

## 8. Data Models & Schemas

### 8.1 Database: PostgreSQL 16

All tables partitioned by `shop_id` for tenant isolation. Row-level security policies enforced at DB layer.

#### shops

```sql
CREATE TABLE shops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_domain  TEXT NOT NULL UNIQUE,          -- e.g. mybrand.myshopify.com
  access_token    TEXT NOT NULL,                  -- encrypted with AWS KMS
  plan_tier       TEXT NOT NULL DEFAULT 'starter',-- starter | growth | enterprise
  waba_id         TEXT,                           -- WhatsApp Business Account ID
  waba_phone      TEXT,                           -- WhatsApp sender number (E.164)
  sendgrid_key    TEXT,                           -- encrypted, brand's own or RetainIQ shared
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_ends_at   TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  settings        JSONB NOT NULL DEFAULT '{}'     -- per-brand config blob
);
```

#### customers

```sql
CREATE TABLE customers (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id                UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  shopify_customer_id    BIGINT NOT NULL,
  email_encrypted        BYTEA,                   -- AES-256 encrypted
  email_hash             TEXT,                    -- SHA-256, for analytics joins
  phone_e164_encrypted   BYTEA,                   -- AES-256 encrypted
  churn_score            NUMERIC(5,2),            -- 0.00 – 100.00
  churn_score_updated_at TIMESTAMPTZ,
  churn_score_features   JSONB,                   -- top-3 SHAP features
  predicted_reorder      JSONB,                   -- {sku_id: "2026-06-12", ...}
  segment                TEXT,                    -- champion|loyal|at_risk|dormant|new
  ltv                    NUMERIC(12,2) DEFAULT 0,
  order_count            INTEGER DEFAULT 0,
  last_order_at          TIMESTAMPTZ,
  opt_in_whatsapp        BOOLEAN DEFAULT false,
  opt_in_sms             BOOLEAN DEFAULT false,
  opt_in_email           BOOLEAN DEFAULT true,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shop_id, shopify_customer_id)
);
CREATE INDEX idx_customers_shop_segment  ON customers(shop_id, segment);
CREATE INDEX idx_customers_churn_score   ON customers(shop_id, churn_score DESC);
CREATE INDEX idx_customers_last_order    ON customers(shop_id, last_order_at);
```

#### orders

```sql
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id             UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  shopify_order_id    BIGINT NOT NULL,
  customer_id         UUID REFERENCES customers(id),
  aov                 NUMERIC(12,2),
  currency            TEXT,
  discount_applied    BOOLEAN DEFAULT false,
  discount_code       TEXT,
  line_items          JSONB NOT NULL,             -- [{sku_id, title, qty, price}]
  shipping_address    JSONB,                      -- country, city only (no street stored)
  fulfillment_status  TEXT,
  tracking_number     TEXT,
  carrier             TEXT,
  estimated_delivery  TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shop_id, shopify_order_id)
);
```

#### flows

```sql
CREATE TABLE flows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  trigger     TEXT NOT NULL,       -- order_paid | score_computed | delivery_confirmed | reorder_due
  is_active   BOOLEAN DEFAULT true,
  config      JSONB NOT NULL,      -- branch logic, channel priority, timing offsets
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### flow_executions

```sql
CREATE TABLE flow_executions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id            UUID NOT NULL REFERENCES shops(id),
  customer_id        UUID NOT NULL REFERENCES customers(id),
  order_id           UUID REFERENCES orders(id),
  flow_id            UUID NOT NULL REFERENCES flows(id),
  step_id            TEXT NOT NULL,
  channel            TEXT NOT NULL,               -- whatsapp | sms | email
  status             TEXT NOT NULL DEFAULT 'pending',
  provider_message_id TEXT,
  template_name      TEXT,
  rendered_content   TEXT,                        -- stored 12 months then purged
  scheduled_at       TIMESTAMPTZ NOT NULL,
  sent_at            TIMESTAMPTZ,
  delivered_at       TIMESTAMPTZ,
  opened_at          TIMESTAMPTZ,
  clicked_at         TIMESTAMPTZ,
  converted_at       TIMESTAMPTZ,
  revenue_attributed NUMERIC(12,2),
  error_code         TEXT,
  error_message      TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);
-- Monthly partitions, automated via pg_partman
```

#### reviews

```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id         UUID NOT NULL REFERENCES shops(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  order_id        UUID REFERENCES orders(id),
  sku_id          TEXT,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body_text       TEXT,
  sentiment       TEXT,                           -- positive | neutral | negative
  topics          TEXT[],                         -- quality | delivery | size | value
  has_ugc         BOOLEAN DEFAULT false,
  ugc_urls        TEXT[],                         -- S3 keys
  published       BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  published_to    TEXT[],                         -- storefront | google | meta
  routed_to       TEXT,                           -- support_ticket_id if 3★
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 8.2 ClickHouse Schema (Analytics)

```sql
-- Daily retention metrics per shop
CREATE TABLE retention_metrics (
  shop_id       String,
  date          Date,
  repeat_rate   Float32,
  churn_rate    Float32,
  new_customers UInt32,
  ltv_avg       Float32,
  orders_total  UInt32
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (shop_id, date);

-- Message delivery events (time-series)
CREATE TABLE message_events (
  event_id     UUID,
  shop_id      String,
  channel      LowCardinality(String),
  event_type   LowCardinality(String), -- sent | delivered | opened | clicked | converted
  flow_id      String,
  customer_id  String,
  revenue      Float32,
  occurred_at  DateTime64(3)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(occurred_at)
ORDER BY (shop_id, occurred_at, channel)
TTL occurred_at + INTERVAL 24 MONTH;
```

---

## 9. API Specification

**Base URL:** `https://api.retainiq.app/v1`  
**Auth:** `Authorization: Bearer <jwt>` — JWT issued by admin-svc, 15-min TTL  
**Rate limit:** 100 req/min per shop (429 with `Retry-After` header)  
**Content-Type:** `application/json`  
**API versioning:** URL-based (`/v1/`); deprecated endpoints sunset after 6-month notice

### 9.1 Authentication

```
POST /auth/shopify          Install OAuth callback — exchange code for session token
POST /auth/refresh          Refresh access token using refresh token
DELETE /auth/session        Logout — revoke refresh token
```

### 9.2 Customer Endpoints

```
GET    /customers                      List customers (paginated, filterable by segment/score)
GET    /customers/:id                  Fetch enriched customer record
GET    /customers/:id/churn-score      Real-time score + top-3 SHAP features
PATCH  /customers/:id/churn-score      Override score manually
GET    /customers/:id/journey          Full flow execution log for customer
GET    /customers/:id/reorder-dates    Predicted reorder date per SKU
DELETE /customers/:id                  GDPR erasure — purges all PII (204 No Content)
POST   /customers/:id/segments         Override AI segment assignment
```

**Example response — `GET /customers/:id/churn-score`:**
```json
{
  "customer_id": "cus_01HXYZ",
  "score": 78.4,
  "segment": "at_risk",
  "computed_at": "2026-05-05T14:32:01Z",
  "top_features": [
    { "feature": "days_since_last_order", "value": 45, "impact": "+18.2" },
    { "feature": "discount_used", "value": true, "impact": "+11.5" },
    { "feature": "aov_vs_median", "value": -0.42, "impact": "+9.1" }
  ],
  "action_queued": "high_risk_discount_flow"
}
```

### 9.3 Flow Endpoints

```
GET    /flows                          List all flows for merchant
POST   /flows                          Create new flow
GET    /flows/:id                      Get flow config
PUT    /flows/:id                      Update flow config
PATCH  /flows/:id/status               Activate / pause flow
DELETE /flows/:id                      Delete flow
POST   /flows/:id/test                 Send test message to merchant's own number
GET    /flows/:id/analytics            Flow performance metrics (open/click/conversion)
POST   /flows/:id/ab-test              Create A/B test on a flow
GET    /flows/:id/ab-test/results      A/B test results with confidence intervals
```

### 9.4 Replenishment Endpoints

```
GET    /replenishment/forecast         30/60/90 day reorder volume forecast
GET    /customers/:id/reorder-dates    Predicted dates per SKU for customer
POST   /replenishment/manual-override  Override predicted date for customer×SKU pair
GET    /replenishment/calendar         Calendar view: which customers due to reorder each day
```

### 9.5 Review Endpoints

```
GET    /reviews                        List reviews (filterable by rating, SKU, date range)
GET    /reviews/:id                    Get single review with UGC URLs
POST   /reviews/:id/publish            Manually publish review to selected platforms
POST   /reviews/:id/respond            Send private WA response (for 1–3★)
GET    /ugc                            List UGC assets with approval status
PATCH  /ugc/:id                        Approve / reject UGC asset
```

### 9.6 Analytics Endpoints

```
GET    /analytics/retention            Repeat rate, LTV, churn — time series
GET    /analytics/channels             WA/SMS/Email delivery, open, click, conversion
GET    /analytics/revenue-attribution  RetainIQ-attributed revenue by channel/flow
GET    /analytics/cohorts              Cohort heatmap data
GET    /analytics/nps                  NPS trend, promoter/passive/detractor breakdown
```

### 9.7 Outbound Webhooks (Merchant-Configured)

```json
// POST to merchant's configured URL

// customer.score_updated
{
  "event": "customer.score_updated",
  "shop_id": "shop_01XYZ",
  "customer_id": "cus_01HXYZ",
  "previous_score": 32.1,
  "new_score": 74.8,
  "segment_change": { "from": "loyal", "to": "at_risk" },
  "timestamp": "2026-05-05T14:32:01Z"
}

// review.received
{
  "event": "review.received",
  "shop_id": "shop_01XYZ",
  "customer_id": "cus_01HXYZ",
  "order_id": "ord_01ABC",
  "rating": 5,
  "has_ugc": true,
  "sentiment": "positive",
  "timestamp": "2026-05-05T18:11:42Z"
}

// reorder.placed
{
  "event": "reorder.placed",
  "shop_id": "shop_01XYZ",
  "customer_id": "cus_01HXYZ",
  "sku_id": "SKU-COLLAGEN-120",
  "order_id": "ord_01DEF",
  "attributed_flow_id": "flow_replenishment_v2",
  "revenue": 2499.00,
  "currency": "INR",
  "timestamp": "2026-05-05T20:05:00Z"
}
```

### 9.8 Error Response Format

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after 60 seconds.",
    "status": 429,
    "request_id": "req_01HXYZ",
    "docs_url": "https://docs.retainiq.app/errors#rate-limit"
  }
}
```

---

## 10. ML Model Specifications

### 10.1 Churn Risk Model — LightGBM

| Attribute | Specification |
|-----------|--------------|
| **Algorithm** | LightGBM GBDT (binary classification) |
| **Target** | Binary: did customer place 2nd order within 90 days? |
| **Training data** | 36 months anonymised order + browse data; min 10K orders for brand-specific model |
| **Global model** | Trained on pooled anonymised data (federated — no raw PII sharing) |
| **Brand fine-tuning** | Transfer learning: brand-specific 500-order minimum to fine-tune |
| **Features** | 47 engineered features across: order history, browse behaviour, AOV, category, discount usage, device, geo |
| **Explainability** | SHAP TreeExplainer — top-3 features returned per API call |
| **Validation** | Stratified k-fold (k=5); primary: AUC-ROC; secondary: Brier score, F1 @ 0.7 threshold |
| **Target AUC** | ≥ 0.78 on held-out validation set |
| **Global retraining** | Weekly (Sunday 2am UTC) via Prefect pipeline |
| **Brand incremental** | Daily via online learning (LightGBM `continue_train`) |
| **Serving** | NVIDIA Triton Inference Server (TensorRT-optimised LightGBM) |
| **Fallback** | Rule-based score if ML service unavailable (AOV × category_churn_rate) |
| **Drift detection** | PSI > 0.2 on feature distribution → alert; AUC drops > 0.05 → auto-rollback |

#### Feature Engineering Pipeline

```python
# Key engineered features (via Polars)
features = {
    "days_since_last_order": (now - last_order_at).days,
    "aov_vs_median": (order.aov - brand_median_aov) / brand_median_aov,
    "browse_depth_score": min(viewed_skus / 5.0, 1.0),
    "cart_abandon_rate_30d": abandoned_carts / sessions_30d,
    "discount_dependency": discount_orders / total_orders,
    "category_churn_p50": CATEGORY_CHURN_TABLE[product_category],
    "repurchase_velocity": order_count / days_since_acquisition,
    "channel_engagement_email": opens_90d / sends_90d,
    "nps_score_normalised": (nps - 5) / 5.0 if nps else 0.0,
    "geo_churn_index": GEO_CHURN_TABLE[country_code],
}
```

### 10.2 Replenishment Prediction — Bayesian Survival Model

| Attribute | Specification |
|-----------|--------------|
| **Algorithm** | Weibull-Gamma mixture (Bayesian survival analysis) using PyMC |
| **Target** | Time-to-reorder in days for a customer×SKU pair |
| **Priors** | Category-level priors from brand's order history (informative priors) |
| **Posterior update** | Online Bayesian update on every new purchase event |
| **Uncertainty** | 95% credible interval → used to set message timing (send at lower bound - 3 days) |
| **Cold start** | ≥ 2 orders same SKU → personalised; else category median |
| **MAE target** | ≤ 5 days for consumables (supplements, coffee, pet food, skincare) |
| **Serving** | FastAPI + cached posterior parameters in Redis (updated per order event) |

```python
# Simplified PyMC model structure
with pm.Model() as replenishment_model:
    # Category-level priors
    alpha = pm.Gamma("alpha", alpha=category_alpha_prior, beta=1.0)
    beta  = pm.Gamma("beta",  alpha=category_beta_prior,  beta=1.0)
    
    # Per-customer heterogeneity
    lambda_k = pm.Gamma("lambda_k", alpha=alpha, beta=beta, shape=n_customers)
    
    # Weibull likelihood for observed inter-purchase times
    obs = pm.Weibull("obs", alpha=alpha, beta=1.0/lambda_k[customer_idx], observed=t_observed)
    
    # Posterior predictive: next purchase date
    t_next = pm.Deterministic("t_next", pm.Weibull.dist(alpha=alpha, beta=1.0/lambda_k))
```

### 10.3 Review Sentiment — Multilingual BERT

| Attribute | Specification |
|-----------|--------------|
| **Base model** | `bert-base-multilingual-cased` (HuggingFace) |
| **Fine-tuning** | 50K labelled D2C product reviews across 5 languages |
| **Languages** | English, Hindi, Tamil, Indonesian, Brazilian Portuguese |
| **Output classes** | Sentiment: positive/neutral/negative; Topic: quality/delivery/size/value/other |
| **Serving latency** | < 200ms per review (CPU inference, async) |
| **Use case** | Route 3★ reviews to correct support queue; surface product quality issues |
| **Retraining** | Quarterly with newly labelled data from merchant-corrected routings |

---

## 11. Performance & SLA Requirements

### 11.1 Latency Targets

| Operation | p50 | p95 | p99 |
|-----------|-----|-----|-----|
| Shopify webhook receive → Kafka | < 50ms | < 150ms | < 300ms |
| Churn score computation (end-to-end) | < 80ms | < 200ms | < 500ms |
| Churn score API (external) | < 80ms | < 200ms | < 300ms |
| WhatsApp message dispatch | < 500ms | < 2s | < 5s |
| Branded tracking page (LCP) | < 1.2s | < 2.0s | < 3.5s |
| Dashboard data load (7-day view) | < 800ms | < 2s | < 4s |
| Replenishment date API | < 100ms | < 300ms | < 600ms |
| Review sentiment classification | < 200ms | < 500ms | < 1s |

### 11.2 Availability SLA

| Tier | SLA | Max downtime/year | Support |
|------|-----|-------------------|---------|
| Starter | 99.5% | 43.8 hrs | Email, 48h response |
| Growth | 99.9% | 8.7 hrs | Chat + email, 24h response |
| Enterprise | 99.95% | 4.4 hrs | Dedicated CSM, < 4h response |

### 11.3 Scale Targets

| Metric | Target | Event |
|--------|--------|-------|
| Peak webhook ingestion | 50,000 events/min | BFCM / Diwali sales spike |
| Active customers tracked | 50M across all tenants | Year 2 |
| Messages dispatched | 5M/day across channels | Year 1 peak |
| Concurrent dashboard users | 10,000 | Normal operation |
| Flow execution jobs in queue | 10M | BFCM |
| ClickHouse query latency (30-day cohort) | < 3s | Dashboard load |

### 11.4 Disaster Recovery

| Scenario | RTO | RPO | Strategy |
|----------|-----|-----|---------|
| Single AZ failure | < 2 min | 0 (Multi-AZ) | RDS Multi-AZ auto-failover |
| Kafka broker failure | < 5 min | 30 seconds | MSK managed, 3-broker cluster |
| scoring-svc outage | < 1 min | N/A (stateless) | Fallback to rule-based scoring |
| channel-svc outage | < 5 min | Jobs in BullMQ persist | Kubernetes pod restart + queue drain |
| Full region failure | < 4 hrs | < 15 min | Route 53 failover to us-east-1 DR |

---

## 12. Security Architecture

### 12.1 Authentication & Authorisation

```
Shopify Embedded App:
  - Shopify session tokens (short-lived JWT, verified via Shopify JWKS)
  - Merchant-facing: no separate login required

External API:
  - JWT (HS256, 15-min access + 30-day refresh)
  - API keys for webhook consumers (HMAC-SHA256 signature on payload)

RBAC Roles:
  - Owner: all permissions including billing + delete
  - Admin: all except billing + delete
  - Analyst: read-only dashboard + export
  - Read-only: dashboard view only
```

### 12.2 Data Protection

```
PII Encryption:
  - Customer email + phone encrypted with AES-256-GCM
  - Envelope encryption: data key encrypted by AWS KMS CMK
  - SHA-256 hash of email used for analytics joins (one-way)

Database:
  - Row-Level Security: SET app.current_shop_id = '...' per request
  - No cross-tenant queries possible at DB layer
  - All connections require SSL (sslmode=require)

In Transit:
  - TLS 1.3 minimum on all external connections
  - HSTS with 1-year max-age + includeSubDomains
  - mTLS between all internal services (Istio)

Logs:
  - PII stripped from all logs via Pino redact config
  - Log retention: 90 days hot, 1 year cold (S3)
```

### 12.3 Shopify-Specific Security

```
Webhook verification:
  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');
  if (hash !== req.headers['x-shopify-hmac-sha256']) {
    return res.status(401).end();
  }

OAuth CSRF protection:
  - State parameter = HMAC(shop_domain, nonce) — verified on callback
  - Nonce stored in Redis, single-use, 10-min TTL

Access token storage:
  - Stored encrypted in PostgreSQL (AES-256 + KMS)
  - Never logged, never included in error responses
```

### 12.4 WhatsApp Compliance Controls

- Opt-in collected via Shopify Checkout Extension before first WA message
- Opt-in record stored with timestamp + source (`checkout_extension_v1`)
- Quality rating monitored via Meta API — auto-pause flows if rating drops to "Low"
- Daily message volume caps per WABA to avoid spam classification
- Prohibited category check on install (verify against Meta's commerce policy)

---

## 13. Monetisation Model

### 13.1 Pricing Tiers

| Feature | Starter ($99/mo) | Growth ($299/mo) | Enterprise (from $999/mo) |
|---------|-----------------|-----------------|--------------------------|
| Active customers | Up to 5,000 | Up to 50,000 | Unlimited |
| WhatsApp messages | 1,000/mo incl. | 10,000/mo incl. | Custom pool |
| Email messages | Unlimited | Unlimited | Unlimited |
| SMS messages | Pay-as-you-go | 2,000/mo incl. | Custom pool |
| Churn scoring | Basic (rule-based) | AI (LightGBM) | AI + custom fine-tuning |
| Replenishment AI | — | Yes | Yes + custom thresholds |
| A/B testing | — | Yes | Yes + multivariate |
| Review + UGC | Basic | Full | Full + custom routing |
| Branded tracking | RetainIQ subdomain | Custom domain | Custom domain + SSL mgmt |
| BigQuery / Snowflake | — | — | Yes |
| API access | Read-only | Full | Full + higher limits |
| SSO (SAML/OIDC) | — | — | Yes |
| Dedicated CSM | — | — | Yes |
| SLA | 99.5% | 99.9% | 99.95% |
| Support | Email 48h | Chat + email 24h | < 4h dedicated |
| Onboarding | Self-serve | Video call | White-glove (3 sessions) |

### 13.2 Usage-Based Overages

| Resource | Overage Price |
|----------|--------------|
| WhatsApp messages (over plan) | $0.04/message |
| SMS — US/UK | $0.025/message |
| SMS — India | $0.010/message |
| Active customers (over plan) | $0.005/customer/month |
| Data exports | $0.10 per 1,000 rows |
| BigQuery rows synced | $0.0001/row/month (Enterprise) |

### 13.3 Revenue Model Projections

| Month | Installs | Avg MRR/install | MRR | ARR Run Rate |
|-------|----------|----------------|-----|--------------|
| M3 | 200 | $142 | $28,500 | $342K |
| M6 | 650 | $141 | $92,000 | $1.1M |
| M9 | 1,300 | $140 | $182,000 | $2.18M |
| M12 | 2,000 | $100 | $200,000 | $2.4M |

*Lower avg MRR at M12 reflects Starter-heavy app store mix offset by Enterprise land-and-expand.*

---

## 14. Competitive Analysis

### 14.1 Feature Matrix

| Capability | RetainIQ | Klaviyo | Yotpo | Postscript | AfterShip | Gorgias |
|-----------|----------|---------|-------|------------|-----------|---------|
| Churn scoring (AI) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| WhatsApp Business (native) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SMS + Email + WA unified | ✅ | Email only | ❌ | SMS only | ❌ | ❌ |
| Replenishment AI | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| UGC capture + routing | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Branded tracking page | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| One-tap WA reorder | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| NPS engine | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Review routing (1★ recovery) | ✅ | ❌ | Partial | ❌ | ❌ | ✅ |
| Shopify-native (App Store) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| < 1 hour setup | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Price (entry) | $99/mo | $45/mo* | $19/mo* | $100/mo | Free* | $10/mo* |

*Feature-limited entry price; comparable feature set is significantly higher

### 14.2 Positioning Statement

> **For Shopify D2C brands who need to grow LTV without growing CAC**, RetainIQ Pro is the **only post-purchase platform** that combines AI churn scoring, WhatsApp-first omnichannel sequencing, and predictive replenishment in a single < 1-hour setup — unlike stitching together Klaviyo + Yotpo + Postscript + AfterShip.

---

## 15. Go-to-Market Strategy

### 15.1 Launch Phases

#### Phase 1 — Design Partners (Months 0–3)
- Hand-pick 50 D2C brands in consumables / beauty / wellness
- Free for 90 days in exchange for: weekly feedback calls, case study rights, referrals
- Target: 3 publishable case studies with quantified repeat-rate lift
- Success gate: 80% report measurable improvement → proceed to Phase 2

#### Phase 2 — Shopify App Store Launch (Months 3–6)
- List on Shopify App Store (retention / loyalty / marketing category)
- App Store optimisation: demo video, 50+ reviews seeded from beta cohort
- SEO content: "Shopify retention app", "WhatsApp for Shopify", "reduce D2C churn"
- Founder community: YC alumni, Founder's Network India, DTCX Slack, Operators Slack
- Target: 200 installs, $28K MRR by end of Phase 2

#### Phase 3 — Growth (Months 6–12)
- **Partner programme:** Klaviyo agencies (20% rev-share year 1), Shopify Plus partners
- **WhatsApp geo expansion:** India, Indonesia, Brazil — localised templates + local pricing
- **Direct enterprise sales:** outbound to Shopify Plus merchants $5M+ ARR
- **Referral:** merchants earn 2 months free per referred install (Growth tier+)
- **Integrations:** Gorgias, Recharge, LoyaltyLion, Okendo — native bi-directional

### 15.2 Channel CAC Targets

| Channel | Target CAC | Volume/mo (M12) | LTV:CAC | Notes |
|---------|-----------|----------------|---------|-------|
| Shopify App Store (organic) | $0 | 600 installs | ∞ | SEO + rating flywheel |
| Content / SEO | $120 | 300 installs | > 20:1 | At $299/mo avg |
| Partner / agency referral | $80 | 400 installs | > 25:1 | 20% rev-share |
| Paid (Google/Meta) | $250 | 400 installs | > 8:1 | Growth+ tier only |
| Direct enterprise sales | $800 | 50 accounts | > 15:1 | $1K+/mo ACV |

---

## 16. Product Roadmap

### Phase 1 — Foundation (Months 1–3)

| Epic | Features | Priority |
|------|---------|---------|
| Shopify Integration | OAuth install, webhooks (5 types), pixel, order sync | P0 |
| Churn Scoring V1 | Rule-based cold-start, LightGBM global model, score API | P0 |
| Flow Engine V1 | Journey builder UI, 5 pre-built templates, WA + Email dispatch | P0 |
| Branded Tracking V1 | Top-10 carriers, customisable layout, basic analytics | P0 |
| Review Capture V1 | T+72h WA request, 5★ routing, storefront widget | P0 |
| Merchant Dashboard V1 | Retention overview, flow performance, channel analytics | P0 |
| Billing | Stripe, plan enforcement, usage metering | P0 |

### Phase 2 — Intelligence (Months 4–6)

| Epic | Features | Priority |
|------|---------|---------|
| Replenishment AI V1 | Bayesian model, reorder date API, WA one-tap reorder | P0 |
| Churn Scoring V2 | Brand fine-tuning, SHAP explanations, drift monitoring | P0 |
| SMS Channel | Twilio, country routing, opt-in management, TCPA compliance | P0 |
| A/B Testing | Traffic split, significance detection, auto winner promotion | P1 |
| NPS Engine | T+14d survey, promoter→referral, detractor→support pipeline | P1 |
| UGC Library | Media upload, approval workflow, Meta republish | P1 |
| Customer Segments | AI auto-classification, Klaviyo sync, CSV export | P1 |

### Phase 3 — Scale (Months 7–9)

| Epic | Features | Priority |
|------|---------|---------|
| WhatsApp Geo Expansion | India/Indonesia/Brazil localisation, local BSP fallback | P0 |
| Enterprise Features | SSO (SAML/OIDC), BigQuery sync, dedicated onboarding, SLA | P0 |
| Integrations | Gorgias, Recharge, LoyaltyLion, Okendo bi-directional | P1 |
| Review AI | Multilingual sentiment + topic classification, issue alerting | P1 |
| Referral Engine | Per-customer links, reward tracking, fraud detection | P1 |
| Predictive LTV | 12-month LTV forecast per customer with confidence interval | P2 |

### Phase 4 — Moat (Months 10–12)

| Epic | Features | Priority |
|------|---------|---------|
| WhatsApp Commerce | Product catalogue in WA, in-thread checkout, payment | P1 |
| Loyalty Engine | Points, tiers, perks integrated with replenishment + review | P1 |
| Subscription Intelligence | Predict subscription churn 30d out; rescue flows | P1 |
| AI Flow Builder | NL flow creation: "build a flow for high-risk beauty customers" | P2 |
| Global Expansion | Stripe multi-currency; EU data residency (Frankfurt) | P0 |
| SOC 2 Type II Audit | Evidence collection, auditor engagement, report publication | P0 |

---

## 17. Success Metrics & KPIs

### 17.1 North Star Metric

> **RetainIQ-attributed repeat purchases per month** (across all merchant installs)

This aligns product, engineering, and GTM: every feature either increases repeat purchases or enables more merchants to generate them.

### 17.2 L1 Product KPIs (Reviewed Monthly)

| KPI | Definition | M6 Target | M12 Target |
|-----|-----------|-----------|------------|
| Active installs | Stores with ≥ 1 live flow in last 30 days | 650 | 2,000 |
| MRR | Monthly recurring revenue | $92K | $200K |
| Net Revenue Retention | (MRR end − churn + expansion) / MRR start | > 95% | > 105% |
| Merchant repeat rate lift | Avg (post − pre RetainIQ repeat rate) | > 25% | > 34% |
| Flow active rate | % installs with ≥ 1 live flow | > 80% | > 85% |
| WA message open rate | Platform-wide WhatsApp open rate | > 80% | > 85% |
| Review collection rate | Reviews received / requests sent | > 18% | > 22% |
| Reorder conversion rate | Reorders placed / replenishment nudges | > 15% | > 18% |
| Time to first value | Days from install to first attributed repurchase | < 14 days | < 10 days |

### 17.3 L2 Engineering KPIs (Reviewed Weekly)

| KPI | Target |
|-----|--------|
| Webhook processing latency p99 | < 300ms |
| Score computation p99 | < 500ms |
| Message delivery success rate | ≥ 99.5% |
| Platform uptime (Growth tier) | ≥ 99.9% |
| Deploy frequency | ≥ 3/week |
| MTTR (P0 incidents) | < 30 min |
| Error rate (5xx public APIs) | < 0.1% |
| CI build time (monorepo) | < 8 min |

---

## 18. Risk Analysis & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Meta WA API policy change (template rejection, pricing hike) | Medium | High | Multi-BSP fallback; SMS always active; T&C monitoring bot |
| Shopify Partner Agreement violation | Low | Critical | Legal review quarterly; data handling audit |
| ML model underperformance on low-data brands | Medium | Medium | Rule-based fallback always active; per-brand performance monitoring |
| Competitor (Klaviyo) adds WhatsApp + churn scoring | Medium | High | Execution speed + deeper Shopify native + replenishment AI as moat |
| Enterprise data breach / PII leak | Low | Critical | SOC 2, pen-test, field-level encryption, row-level security, cyber insurance |
| Merchant churn — poor onboarding / no quick wins | High | High | < 1hr setup mandate; 30-day ROI guarantee; pre-built flows |
| WA spam complaints → account ban | Medium | Critical | Opt-in only; quality rating monitoring; auto-pause below "Medium" |
| WhatsApp conversation pricing eating margin | Medium | Medium | Monthly cost cap alerts to merchants; overage transparency in dashboard |
| India DPDP compliance gap | Low | High | Data localisation option (Mumbai region); DPA template; consent audit |

---

## 19. Compliance & Data Governance

### 19.1 Regulatory Matrix

| Regulation | Scope | Key Requirement | Implementation |
|-----------|-------|----------------|---------------|
| GDPR (EU) | EU customers | Erasure, portability, DPA | `DELETE /customers/:id` wipes PII in 30s; DPA available |
| CCPA (California) | CA residents | Opt-out of sale, deletion | Opt-out link on tracking pages; deletion within 45 days |
| DPDP 2023 (India) | Indian users | Consent-first, data localisation | WA opt-in at checkout; Mumbai region option |
| TCPA (US SMS) | US SMS | Double opt-in, time restrictions | Double opt-in flow; 8am–9pm local time enforcement |
| WA Commerce Policy | All WA | Prohibited categories, opt-in | Category check on install; quality monitoring |
| SOC 2 Type II | All | Security controls | Type I: Month 6; Type II: Month 12 |
| PCI DSS | Payments | No card data stored | Stripe handles all card data; SAQ-A scope |

### 19.2 Data Retention Schedule

| Data Type | Hot Retention | Cold Retention | Deletion |
|-----------|--------------|----------------|---------|
| Customer PII (email, phone) | While account active | — | 30 days after account closure |
| Order data | 24 months | 5 years (S3 Glacier) | Auto-purge |
| Message content (rendered) | 12 months | — | Auto-purge |
| ML training data (anonymised) | 36 months | — | Aggregates only, no PII |
| Audit logs | 90 days (CloudWatch) | 1 year (S3) | Auto-purge |
| UGC assets | While account active | — | 30-day grace after closure |

---

## 20. Infrastructure & DevOps

### 20.1 Environment Strategy

| Environment | Purpose | Infra | Data |
|------------|---------|-------|------|
| `local` | Developer machines | Docker Compose (all services) | Seed data only |
| `dev` | Feature branches | EKS (shared), RDS small | Anonymised production copy |
| `staging` | Pre-production QA | EKS (dedicated), RDS medium | Anonymised production copy |
| `production` | Live traffic | EKS (HA), RDS Multi-AZ | Real merchant data |

### 20.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml (simplified)

on: [push]

jobs:
  test:
    - lint (ESLint + Ruff)
    - type-check (tsc --noEmit)
    - unit-tests (Vitest / Pytest)
    - integration-tests (Testcontainers: Postgres + Redis + Kafka)
    - security-scan (Snyk + Trivy)
    
  build:
    - docker build --target production
    - push to ECR with SHA tag
    
  deploy-staging:
    - ArgoCD sync to staging namespace
    - Run smoke tests (Playwright)
    - Run OWASP ZAP scan
    
  deploy-production:
    - Manual approval gate (GitHub Environments)
    - ArgoCD progressive rollout (10% → 50% → 100%, 5-min intervals)
    - Prometheus SLO burn rate check at each step
    - Auto-rollback if p99 latency > 2× baseline OR error rate > 0.5%
```

### 20.3 Observability Stack

```
Metrics:    Prometheus → Grafana dashboards
            Custom metrics per service: message_dispatch_total, score_computation_duration_seconds
            
Tracing:    OpenTelemetry SDK (all services) → Grafana Tempo
            Every Kafka message carries trace-id in headers
            
Logging:    Pino (Node.js) + structlog (Python) → Grafana Loki
            Log format: {level, time, service, shop_id (redacted if PII), request_id, ...}
            
Alerting:   Grafana Alerting → PagerDuty
            P0: message delivery failure > 1% → immediate page
            P1: score computation p99 > 1s for 5 min → 15-min page
            P2: dashboard query latency > 5s → Slack only

SLO tracking:
            Error budget burn rate alerts (2% consumed in 1h = page)
            Monthly SLO report auto-generated to Notion
```

### 20.4 Monorepo Structure

```
retainiq/
├── apps/
│   ├── admin/              # Next.js 14 merchant dashboard + Shopify embedded app
│   ├── tracking/           # Next.js 14 branded tracking page (edge-deployed)
│   └── marketing/          # Next.js 14 marketing site (retainiq.app)
├── services/
│   ├── ingestion/          # Node.js Fastify webhook receiver
│   ├── scoring/            # Python FastAPI churn score service
│   ├── orchestration/      # Node.js BullMQ journey engine
│   ├── channel/            # Node.js Fastify WA/SMS/Email dispatcher
│   ├── replenishment/      # Python FastAPI replenishment model
│   ├── review/             # Node.js Fastify review capture
│   ├── analytics/          # Python FastAPI + ClickHouse analytics
│   └── notification/       # Node.js internal alerting
├── packages/
│   ├── db/                 # Drizzle schema + migrations (shared)
│   ├── types/              # Shared TypeScript types
│   ├── zod-schemas/        # Shared Zod validators (frontend + backend)
│   ├── kafka/              # Kafka topic definitions + typed producers/consumers
│   └── ui/                 # shadcn/ui component library
├── ml/
│   ├── churn/              # LightGBM training pipeline (Prefect)
│   ├── replenishment/      # PyMC model training + serving
│   └── sentiment/          # BERT fine-tuning + evaluation
├── infra/
│   ├── terraform/          # AWS infra (EKS, RDS, MSK, ElastiCache, S3)
│   ├── k8s/                # Kubernetes manifests (ArgoCD app-of-apps)
│   └── docker/             # Base Dockerfiles
└── tools/
    ├── seed/               # Database seed scripts
    └── scripts/            # Dev setup, migration helpers
```

---

## 21. Appendix

### A. Glossary

| Term | Definition |
|------|-----------|
| AOV | Average Order Value |
| BFCM | Black Friday / Cyber Monday |
| BSP | Business Solution Provider — WhatsApp API reseller |
| CAC | Customer Acquisition Cost |
| DPDP | Digital Personal Data Protection Act (India 2023) |
| GBDT | Gradient-Boosted Decision Trees |
| LTV | Lifetime Value — total revenue from a customer |
| MAE | Mean Absolute Error — ML regression accuracy metric |
| NPS | Net Promoter Score (0–10 scale) |
| NRR | Net Revenue Retention |
| PII | Personally Identifiable Information |
| ROAS | Return on Ad Spend |
| SKU | Stock Keeping Unit |
| UGC | User-Generated Content (photos, videos, reviews) |
| WABA | WhatsApp Business Account |
| WA | WhatsApp |

### B. Third-Party Dependency Register

| Dependency | Purpose | Tier | SLA | Fallback |
|-----------|---------|------|-----|---------|
| Meta WhatsApp Cloud API | WA message delivery | All | 99.9% (Meta SLA) | Gupshup BSP |
| Twilio | SMS (global) | All | 99.95% | Vonage |
| MSG91 | SMS (India) | All | 99.9% | Twilio |
| SendGrid | Transactional email | All | 99.99% | AWS SES |
| EasyPost | Carrier tracking | All | 99.9% | AfterShip API |
| Stripe | Billing + subscriptions | All | 99.99% (critical) | None |
| AWS (EKS/RDS/MSK/S3) | Core infra | All | 99.9%–99.99% | Multi-AZ HA |
| Shopify | Merchant data + webhooks | All | Shopify's own SLA | None (core) |
| Google Business Profile API | 5★ review publish | All | Best-effort | Manual publish link |
| Meta Graph API | FB/IG review publish | All | Best-effort | Manual publish link |
| MLflow | ML experiment tracking | Internal | Self-hosted | S3 + version tags |
| Triton Inference Server | ML model serving | Internal | Self-hosted | Fallback rule-based |
| ArgoCD | GitOps deployments | Internal | Self-hosted | `kubectl apply` fallback |

### C. Open Engineering Questions

1. **Replenishment model scope:** Per-brand isolated model vs. global multi-task model? Brand isolation gives better privacy but suffers data sparsity for new brands. Propose: global prior + brand-specific posterior (current PyMC design) — confirm with ML team.

2. **WhatsApp conversation pricing transparency:** Meta charges per 24h conversation window ($0.0147 in India). Metering strategy needed: count conversations per customer per day, surface cost in merchant dashboard with monthly projection.

3. **Shopify Flow extension:** Build a native Shopify Flow action (so RetainIQ triggers are available in merchant's existing Shopify automations) vs. keep as fully standalone. Native extension improves distribution; standalone gives full control. Recommend: native extension in Phase 3.

4. **WABA provisioning model:** Self-serve (merchant provisions own WABA — longer setup, full brand identity) vs. RetainIQ-managed shared WABA (instant setup, limited sender name customisation). Recommend: shared WABA for Starter/Growth, own WABA required for Enterprise.

5. **ML training data consent:** Pooling anonymised data across merchants for global model training — explicit merchant consent required in DPA? Legal review needed before cross-tenant model training goes live.

6. **ClickHouse vs. BigQuery for analytics-svc:** Self-hosted ClickHouse on EKS gives lower cost at scale but operational burden; managed BigQuery eliminates ops but costs more at high query volume. Decision point: if analytics volume > 500B rows/month, migrate analytics-svc to BigQuery.

---

*RetainIQ Pro PRD v1.0 — May 5, 2026 — Confidential*
