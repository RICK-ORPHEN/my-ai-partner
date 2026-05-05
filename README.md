# my-ai-partner — AI School Platform v3

業種8 × 横断スキル4 = 公開URLとポートフォリオを所有して卒業するAIスクール。

## 構成
- `web/` ← Next.js 15 App Router 本体（**v3 — ここが本番アプリ**）
- `supabase/migrations/` ← DBマイグレーション
  - `003_v3_full_schema.sql` ← v3完全スキーマ + RLS
  - `004_v3_seed_data.sql` ← 全コース・全レッスンのシード
- `docs/` ← 既存のHTMLサイト（参考用）と仕様書（specs/v3 が最新方針）
- `backend/` ← v2時代のExpress（v3で廃止予定。Next.js Route Handlersに移行済み）

## クイックスタート
```bash
cd web
cp .env.example .env.local   # 各種キーを設定
npm install
npm run dev
```

詳細は `web/README.md` と `docs/specs/v3/00_v3_strategy.md`。
