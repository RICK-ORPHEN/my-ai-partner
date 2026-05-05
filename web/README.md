# My AI Partner — v3 (Next.js 15)

汎用AIスクールプラットフォーム。業種8 × 横断スキル4 = 84レッスンと、プロダクト公開・ポートフォリオ機能。

## セットアップ

```bash
cp .env.example .env.local
# 各種キーを設定（下記）
npm install
npm run dev
```

### 必須環境変数
| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー専用（書き込み・採点） |
| `STRIPE_SECRET_KEY` | Stripe sk_ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `STRIPE_PRICE_MONTHLY` | 月額プランの price_xxx |
| `STRIPE_PRICE_YEARLY` | 年額プランの price_xxx |
| `STRIPE_PRICE_TEAM` | 法人プランの price_xxx |
| `KEYLESS_EMAIL` / `KEYLESS_PASSWORD` / `KEYLESS_PROJECT_ID` | AI採点用 Keyless AI |
| `NEXT_PUBLIC_AFFILIATE_VERCEL/SUPABASE/SQUARESPACE` | 各社のアフィリンク |
| `NEXT_PUBLIC_SITE_URL` | 本番URL |

## DB マイグレーション

```bash
# Supabase CLI
supabase link --project-ref <your-ref>
supabase db push

# もしくは管理画面のSQL Editorに以下を順に貼り付け
# supabase/migrations/003_v3_full_schema.sql
# supabase/migrations/004_v3_seed_data.sql
```

## デプロイ
1. `vercel link` してこのディレクトリをVercelプロジェクトに接続
2. Vercelダッシュボードで上記ENVを全て設定
3. `vercel --prod` でデプロイ

## アーキテクチャ
- Next.js 15 App Router
- Supabase（Auth/DB/Realtime/RLS全件適用）
- Stripe（subscription billing + webhook）
- Keyless AI（OpenAI/Geminiをキーなしで呼ぶ）

## ディレクトリ構成
```
app/
  (public LP)        page.tsx, courses/, cases/, pricing/, about/, contact/, legal/, privacy/
  (auth)             login/, signup/, onboarding/, auth/callback/, logout/
  (student)          dashboard/, courses/[course]/, lesson/[lesson]/, p/[slug]/
  (admin)            admin/  (users / lessons / products / scores / affiliates)
  (api)              api/  (submissions/score, products/*/review, billing/*, stripe/webhook,
                            contact, profile/update, portfolio/save, enroll/[course], health)
components/          Nav, Footer, Container, Badge
lib/                 supabase/{client,server,admin}, keyless, stripe, curriculum, cn
```

## 検証
- ヘルスチェック: GET /api/health
- スモークテスト: トップ/コース/ログイン/サインアップ/ダッシュボード(要auth)
