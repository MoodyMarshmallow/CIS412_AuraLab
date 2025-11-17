AuraLab — Technical Specifications (MVP → v1)

0) Scope, Non‑Goals & Assumptions

In‑scope (MVP):

Multi‑campaign UI with a shared “campaign prompt” and simple reference materials.

AI post generation (text + optional hashtag suggestions) using campaign context.

AI analysis/feedback with clear, structured suggestions.

Instagram‑style preview mock (visual only; no real publishing).

Simple two‑state post lifecycle: DRAFT → READY.

Local disk file uploads for media and references (no cloud object storage yet).

Non‑goals (MVP):

Real platform publishing to Instagram/TikTok/etc. — the MVP only generates and previews content; posting is done manually by the user.

Scheduling or background jobs of any kind (no timers or workers).

Complex collaboration (comments, mentions, roles).

Localization beyond basic i18n hooks.

Real‑time sockets (polling or simple refetch is fine).

Assumptions / Doubts (stated upfront):

Exact LLM model names change often; we’ll keep a provider interface with a default (e.g., OpenAI “GPT‑4.x/GPT‑4o‑mini”). If the chosen model is EOL or renamed later, the interface remains stable.

If/when you want actual publishing to Instagram, you’ll need Business/Creator accounts + FB app approvals; that’s outside MVP and adds OAuth + compliance work.

Large media processing (video transcode) is out-of-scope for MVP; we handle images and small docs.

1) Architecture Overview

Keep it simple:

Frontend: Next.js (App Router) + TypeScript, Mantine UI, TanStack Query, React Hook Form, Zod.

Backend: FastAPI + Python 3.12, SQLModel/SQLAlchemy, PostgreSQL.

Storage: PostgreSQL for structured data; local disk on the API server for files (images, references) under a dedicated uploads/ directory.

AI: Pluggable LLMProvider service (OpenAI by default).

Observability (MVP): Basic structured logging and minimal error tracking; full metrics/tracing is deferred to a later version.

Deploy: Dockerized. One API container, one Postgres container, one Next.js frontend container.

High‑level flow

[Next.js] --JSON--> [FastAPI] --SQLAlchemy--> [PostgreSQL]
     |                   |
     |                   +--> [Local disk: /uploads]
     |                   +--> [LLM Provider]


2) Domain Model

Entities & relationships (MVP, single-user)

For the first, fast MVP we assume a single user of the system (or a small trusted team sharing access). There is no auth/account system and no multi‑tenant org model yet.

Core entities (flattened):

Campaign: high‑level container for a set of posts.

id, title, prompt (campaign‑wide description/instructions), audience, guidelines, reference_paths[] (array of file paths or URLs on disk).

Post: one potential social post belonging to a campaign.

id, campaign_id, title, text, media_paths[] (array of local file paths for images), status, analysis_json, created_at.

We treat media and references as arrays of paths on the main entities, rather than normalizing into separate tables, to minimize moving parts for the MVP.

Status machine (Post, MVP):

DRAFT -> READY


DRAFT: created from an AI generation call or manually edited but not yet marked as ready.

READY: user has reviewed/edited the post and considers it good enough to copy/paste into real platforms.

No scheduling, no published state, no background jobs.

Simplified ER (ASCII)

Campaign( id PK, title, prompt, audience, guidelines, reference_paths text[] )

Post( id PK, campaign_id FK, title, text,
      media_paths text[],
      status,        -- 'DRAFT' | 'READY'
      analysis_json jsonb,
      created_at timestamptz )


Indexes

post(campaign_id, status, created_at)

campaign(title) (btree, for simple search)

3) API Design (FastAPI) (FastAPI) (FastAPI)

Standards

JSON everywhere.



Validation: Pydantic v2 models + consistent error envelopes.

Versioned base path: /api/v1/...

Pagination: ?cursor=<opaque>&limit=50.

Idempotent POST where appropriate using Idempotency-Key header.

Error envelope (consistent)

{ "error": { "code": "NOT_FOUND", "message": "Campaign not found", "details": null } }


Representative schemas (Pydantic/Python)

from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Literal

Platform = Literal["instagram"]  # future: "tiktok", "x", ...

class Media(BaseModel):
    url: HttpUrl
    type: Literal["image","video"]
    width: Optional[int] = None
    height: Optional[int] = None

class PostSummary(BaseModel):
    id: str
    title: str
    status: Literal["DRAFT","ANALYZED","REVISION_NEEDED","READY","SCHEDULED","PUBLISHED","FAILED"]
    platform: Platform
    scheduled_at: Optional[str] = None

class CampaignSummary(BaseModel):
    id: str
    title: str
    prompt: str
    references: List[Media] = []
    posts: List[PostSummary] = []

class CreateCampaign(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    prompt: str = Field(min_length=10, max_length=4000)
    audience: Optional[str] = None
    guidelines: Optional[str] = None

class GeneratePostRequest(BaseModel):
    title: Optional[str] = None
    prompt: str = Field(min_length=1, max_length=2000)
    platform: Platform = "instagram"
    media_urls: List[HttpUrl] = []

class PostDetail(BaseModel):
    id: str
    title: str
    text: str
    platform: Platform
    media: List[Media]
    status: str
    analysis: Optional[dict] = None


Endpoints (selected)

GET /api/v1/campaigns?cursor&limit – list campaigns.

POST /api/v1/campaigns (CreateCampaign) → CampaignSummary.

GET /api/v1/campaigns/{campaign_id} → CampaignSummary including post summaries.

POST /api/v1/campaigns/{campaign_id}/references/upload – multipart upload of a single reference file; saves to local disk and returns updated reference list.

POST /api/v1/campaigns/{campaign_id}/posts (GeneratePostRequest) → PostDetail.

Calls LLM service to draft; creates a DRAFT post.

GET /api/v1/posts/{post_id} → PostDetail.

PATCH /api/v1/posts/{post_id} – update title/text/media_paths/status.

POST /api/v1/posts/{post_id}/analyze → { analysis, status }.

Calls LLM analysis; stores analysis_json and can optionally flip status from DRAFT → READY if analysis passes a simple heuristic.

POST /api/v1/uploads – generic multipart upload for post media; returns { path } to store in media_paths.

No scheduling endpoints and no job polling APIs are required for the MVP.

4) AI Service Layer

Interface

class LLMProvider(Protocol):
    def generate_post(self, campaign_ctx: dict, user_prompt: str, media_meta: list[dict]) -> dict: ...
    def analyze_post(self, campaign_ctx: dict, post: dict) -> dict: ...


Generation output (deterministic JSON)

{
  "title": "Early Access Drop",
  "text": "We’re launching ... #AI #Design #YourBrand",
  "hashtags": ["AI","Design","YourBrand"],
  "tone": "friendly",
  "cta": "Join the waitlist",
  "safety_flags": []
}


Analysis output

{
  "overall_score": 78,
  "readability_grade": "7-8",
  "sentiment": "positive",
  "platform_fit": {
    "instagram": { "length_ok": true, "has_hashtags": true, "has_emoji": false }
  },
  "improvements": [
    "Open with a benefit-driven hook.",
    "Add 2-3 niche hashtags.",
    "Replace generic CTA with a concrete action."
  ],
  "media_suggestions": [
    "Use a lifestyle shot with product visible in first 2 sec."
  ]
}


Prompting (sketch)

Provide campaign prompt, audience, guidelines, and 1–3 top reference snippets (token safe).

Use “respond in JSON” constraint with a fallback parser that repairs minor JSON errors.

Safety: run a quick heuristic (disallowed terms list) + model‑based moderation before saving.

5) Scheduling & Worker (Deferred)

Scheduling and automated publishing are out-of-scope for the MVP. All posts are copied manually from AuraLab into real social platforms. A later version can introduce background workers, job tables, and real publishing flows.

6) File Storage

For the MVP, file storage is intentionally simple and uses local disk on the API server.

Root directory: uploads/ mounted inside the API container/VM.

Subdirectories:

uploads/campaigns/{campaign_id}/references/ for campaign‑level reference files.

uploads/campaigns/{campaign_id}/posts/{post_id}/media/ for post media.

Access pattern:

API exposes files via static file routes (e.g., /static/uploads/...) mapped to the uploads/ directory.

Frontend stores and uses the resulting relative paths/URLs in reference_paths[] and media_paths[].

Upload flow (simplified):

Client submits a multipart/form‑data request to POST /api/v1/uploads or a more specific upload endpoint.

FastAPI saves the file to disk, generates a unique filename, and returns the relative path.

Client then associates that path to a campaign or post via a normal PATCH/POST.

Security for MVP:

Basic validation on file size and extension (e.g., allow only images/pdf up to a certain size).

Because this is expected to run for a single trusted user/team, we accept the trade‑off of local disk over cloud storage for now.

In a future version, the same interface can be swapped to S3/R2 without changing the frontend.

7) Frontend (Next.js + Mantine) (Next.js + Mantine)

Routing (App Router)

/           -> CampaignsListPage
/campaigns/:id -> CampaignDetailPage
/post/:id   -> PostOverlay (modal route)
/auth/*     -> login/signup


State & data

TanStack Query: useCampaigns, useCampaign(id), useCreatePost, useAnalyzePost, useSchedulePost, usePresignUpload.

React Hook Form (+ Zod): post edit form & bottom prompt bar.

Component tree (core)

<AppShell>
  <SidebarCampaigns />
  <Viewport>
    <CampaignHeader />
    <CampaignReferences />
    <PostsGrid>
      <PostCard />...
    </PostsGrid>
    <PromptBar />   <-- generate-Post
  </Viewport>
</AppShell>

<PostOverlay>  (Modal)
  <LeftPane>
    <PostEditorForm />
    <MediaDropzone />
  </LeftPane>
  <RightPane Tabs>
    <Tab "Preview (InstagramMock)">
      <InstagramPhoneFrame>
        <PostPreview />
      </InstagramPhoneFrame>
    </Tab>
    <Tab "AI Feedback">
      <AnalysisPanel />
    </Tab>
  </RightPane>
</PostOverlay>


UI patterns (Mantine)

AppShell, Navbar for sidebar.

Card for posts, Grid for layout.

Modal for overlay; Tabs for preview/analysis.

Dropzone for media/reference uploads.

Notifications for toasts (success/error).

Example: Prompt bar (TSX)

// components/PromptBar.tsx
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, Button, Group } from "@mantine/core";
import { useCreatePost } from "@/queries/posts";

const schema = z.object({ prompt: z.string().min(1).max(2000) });

export function PromptBar({ campaignId }: { campaignId: string }) {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { prompt: "" },
  });
  const createPost = useCreatePost(campaignId);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await createPost.mutateAsync({ prompt: values.prompt, platform: "instagram" });
        reset();
      })}
    >
      <Group justify="space-between" align="end">
        <Textarea autosize minRows={2} placeholder="Describe the post you want..."
          {...register("prompt")} />
        <Button type="submit" loading={createPost.isPending}>Generate</Button>
      </Group>
    </form>
  );
}


TanStack Query hook (typed)

// queries/posts.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/util/api"; // fetch wrapper with cookies

export function useCreatePost(campaignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { prompt: string; platform: "instagram"; media_urls?: string[] }) =>
      api.post(`/api/v1/campaigns/${campaignId}/posts`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaign", campaignId] });
    },
  });
}


8) Backend Implementation Notes

Directory layout

backend/
  auralab/
    api/        # FastAPI routers
    models/     # SQLModel tables
    schemas/    # Pydantic IO models
    services/   # llm.py, storage.py, auth.py, scheduling.py
    workers/    # apscheduler runner
    config.py
    main.py
  tests/


Sample endpoint (FastAPI)

@router.post("/campaigns/{cid}/posts", response_model=PostDetail)
async def generate_post(cid: str, body: GeneratePostRequest, user=Depends(auth.require_user)):
    campaign = repo.get_campaign(cid, user.org_id)
    draft = llm.generate_post(
        campaign_ctx={
            "prompt": campaign.prompt,
            "audience": campaign.audience,
            "guidelines": campaign.guidelines,
            "references": repo.get_reference_snippets(cid, limit=3),
        },
        user_prompt=body.prompt,
        media_meta=[{"url": str(u)} for u in body.media_urls],
    )
    post = repo.create_post(
        campaign_id=cid,
        title=draft["title"] or "Untitled",
        text=draft["text"],
        platform=body.platform,
        media=body.media_urls,
        created_by=user.id,
        status="DRAFT",
    )
    return mapper.post_to_detail(post)


Presign endpoint (R2/S3)

@router.post("/uploads/presign")
def presign_upload(body: PresignRequest, user=Depends(auth.require_user)):
    key = storage.build_key(user.org_id, body.filename)
    url, fields, public_url = storage.presign_put(key=key, mime=body.mime, size=body.size)
    return {"url": url, "fields": fields, "publicUrl": public_url}


9) Security & Privacy (MVP)

For a one‑week MVP, keep security simple and pragmatic:

Deployment context: assume this runs for a single trusted user or small team (e.g., behind a VPN or password‑protected reverse proxy). No in‑app account system.

CORS: restrict to the known frontend origin.

Input validation: Zod on the client, Pydantic on the server; reject overlong content and obviously invalid data.

Secrets: injected via environment variables; never committed.

PII: store minimal data (no end‑user/customer PII, only content you create).

Content moderation: lightweight heuristic scan before saving posts (e.g., denylist of clearly unsafe terms); full moderation pipeline can wait for v1.

10) Observability & Reliability (MVP)

Keep observability very lightweight for the first build:

Logging: basic structured logs to stdout (JSON or key=value) including timestamp, route, and status code.

Request IDs: generate a simple request id per HTTP request and include it in logs and responses.

Error handling: centralized FastAPI exception handler that logs stack traces and returns a clean error envelope to the client.

Optional: if time permits, wire a single external error tracker (e.g., Sentry) but skip full OpenTelemetry + Prometheus for now.

Backups: rely on periodic Postgres dumps or managed‑DB snapshots; object storage can use provider‑level lifecycle rules.

11) Performance & Safety Budgets

API P95 < 300ms (excluding LLM calls).

LLM requests: timeout 15s; retries x1 with jitter. Circuit-breaker on provider.

Post body limit: 10KB text; media ≤ 10MB each (MVP).

Rate limits: X-RateLimit-* headers; e.g., 60 req/min/user (tunable).

Content moderation: pre-save scan (heuristics); block obviously unsafe output; surface warnings in UI.

12) Testing Strategy

Unit: services (LLM adapters with fixtures), validators, repositories.

Contract (API): OpenAPI schema + Schemathesis fuzz.

Integration: DB + storage (use MinIO in CI), worker jobs.

E2E: Playwright (create campaign → add reference → generate → analyze → schedule).

Load: k6/Locust for post list & generation endpoints.

CI: linters (ruff, black, mypy; eslint, typescript), tests, docker build.

13) Deployment

Dev (docker-compose): Next.js, FastAPI, Postgres, MinIO, Mailhog, Worker.

Prod:

API + Worker on a single VM or container platform (2 services).

Postgres (managed, e.g., RDS/Neon).

Storage: R2/S3 (+ optional Cloudflare CDN).

Frontend: Vercel or container with Nginx.

Migrations: Alembic run on deploy.

Blue/Green: two app slots or rolling update; DB migration is backward‑compatible.

14) Acceptance Criteria (MVP)

Create/read campaigns with a title and campaign‑wide prompt.

Attach reference files to a campaign using local disk uploads; files are visible in the UI.

Generate a post via the prompt bar; post appears as DRAFT with AI‑generated text (and optional hashtags).

Open a post overlay, edit title/text, and see a live Instagram‑style preview mock.

Run AI analysis on a post; feedback is stored and displayed in the Analysis tab.

Manually flip a post from DRAFT to READY via the UI (with status stored in the database).

All media displayed in the preview are loaded from local disk paths managed by the backend.

Basic logging and error handling are present; the app can be run via a simple Docker setup.

15) Future (v1+)

Real publisher connectors (Instagram Graph API first) with OAuth.

Hashtag intelligence from real engagement data.

Reference “knowledge packs” (brand voice, previous high performers).

Collaboration (comments, approvals), version history.

Real-time updates via WebSockets or server-sent events.

16) Example SQL (DDL sketch)

create table campaign (
  id uuid primary key,
  title text not null,
  prompt text not null,
  audience text,
  guidelines text,
  reference_paths text[] default '{}',
  created_at timestamptz default now()
);

create table post (
  id uuid primary key,
  campaign_id uuid not null references campaign(id) on delete cascade,
  title text not null,
  text text not null,
  media_paths text[] default '{}',
  status text not null, -- 'DRAFT' | 'READY'
  analysis_json jsonb,
  created_at timestamptz default now()
);


17) Example: Instagram Preview Mock (UI rules)

Truncate captions > 2,200 chars (Instagram limit guideline).

Clamp to ~3 lines with “more…” expansion in mock.

Render first image prominently (square by default).

Show handle, avatar placeholder, like/comment icons (non-functional).

18) Risks & Mitigations

AI output instability → strict JSON schema + repair parser, short prompts, few-shot examples.

**- Cost spikes → cache last analysis; exponential backoff; per‑org quotas.

Storage sprawl → lifecycle policies (e.g., auto‑expire unused uploads after 7 days).

19) Developer Ergonomics

Make a storybook for components (Mantine theming, PostCard, Overlay).

API client generator from OpenAPI (or hand-typed, your call—but pick one).

Seed script to create sample campaign + posts.

One‑command local bootstrap: make dev (or task dev).

Tiny Code Appendix

LLM adapter (pluggable)

class OpenAILLM(LLMProvider):
    def __init__(self, client):
        self.client = client

    def generate_post(self, campaign_ctx, user_prompt, media_meta):
        # call provider with system+user messages; parse JSON
        # (omitted: provider-specific params)
        return {
            "title": "...",
            "text": "...",
            "hashtags": ["AI","Design"]
        }

    def analyze_post(self, campaign_ctx, post):
        return {
            "overall_score": 76,
            "improvements": ["Shorten first sentence", "Add CTA"]
        }


APScheduler worker bootstrap

def start_scheduler():
    scheduler = AsyncIOScheduler(jobstores={"default": PostgresJobStore(dsn=cfg.pg_dsn)})
    scheduler.add_jobstore(PostgresJobStore, "default")
    scheduler.add_executor(AsyncIOExecutor())
    scheduler.start()


20) What to build first (pragmatic order)

DB schema + FastAPI skeleton + auth.

Presign upload + references UI.

Campaign detail page + Prompt bar → generate DRAFT.

Post overlay (editor + preview) + Analyze.

Scheduling + worker + status flips.

Polish: pagination, empty states, metrics, tests.