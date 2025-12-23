# KOURT ARCHITECTURE V5 - COST & SCALE OPTIMIZED

## 1. STRATEGIC DECISIONS (Engineering Chief)

### 1.1 Unified Backend: **Supabase** (Chosen)

* **Why?** Open-source, predictable pricing, built-in Auth, Storage, and Realtime. Cheaper scaling than Firebase for high-read/write apps due to SQL efficiency.
* **Cost Strategy**: Heavy abuse of Row Level Security (RLS) to prevent middleware costs. Direct-to-db from client.

### 1.2 Database Schema (Optimized)

We will create these core tables with specific focus on reducing redundancy.

* `profiles`: Base user data.
* `courts`: Geographically indexed (PostGIS) for efficient radial search.
* `matches`: Core gameplay loop.
* `social_posts`: Polymorphic social feed items.
* `analytics_events`: **[NEW]** Log usage without external paid tools like Mixpanel.
* `api_costs`: **[NEW]** Internal ledger to track Mapbox/OpenAI calls.

### 1.3 Image Optimization Protocol (Client-Side)

To survive the "Social" feature costs:

1. **Compression**: `expo-image-manipulator` on device BEFORE upload.
    * Max: 1080p
    * Quality: 0.8
    * Format: WebP (Save ~30% size vs JPG)
2. **Storage Buckets**: `avatars`, `posts`, `court-images`.
3. **CDN**: Supabase standard CDN with aggressive caching `Cache-Control: public, max-age=31536000`.

### 1.4 Map Strategy

* **Provider**: Mapbox (via `@rnmapbox/maps`).
* **Cost Hack**: Cache court coordinates in local device storage (AsyncStorage/MMKV). Only fetch "new areas" when user moves significantly (>2km).
* **Clustering**: Enable Mapbox native clustering to render thousands of pins with 1 draw call.

### 1.5 AI Usage (Low-Cost)

* **Logic**: AI is ONLY for "High Value" actions (Generating a Post, Verifying a Court).
* **Guardrails**:
  * Rate Limit: 5 requests/user/day.
  * Cache: Store AI results. If user asks "Generate post" twice for same match, return DB result.

## 2. METRICS & MONITORING (KPIs)

We will engineer a `kpi_dashboard` view in Supabase.

| Metric | Source | Frequency |
|:-------|:-------|:----------|
| **CAC** | `analytics_events` (attributed install) / Ad Spend | Weekly |
| **LTV** | Sum of `subscription_payments` | Real-time |
| **DAU/MAU** | Unique `auth.uid()` in `analytics_events` | Daily |
| **Retention** | Cohort analysis of D1/D7 logins | Weekly |
| **API Costs**| `api_costs` table sum | Real-time |

## 3. SECURITY & ROLES

* **RLS Policies**: Default `deny all`. Explicitly allow `select` for public data.
* **Roles**: `admin` (Kourt Staff), `host` (Arena Owner), `player` (Standard).
* **Anti-Spam**: Database Trigger to block uploads if user > 50 posts/hour.

---
**Next Steps:**

1. Execute SQL Migration.
2. Implement Client-Side Compression Service.
3. Setup Analytics Logger.
