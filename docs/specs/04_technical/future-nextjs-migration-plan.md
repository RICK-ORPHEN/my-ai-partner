# Next.js 移行計画（将来）

## 1. 移行を開始する条件（All-Pass）
1. チャットbotコースが完成し、有料受講者が10社以上
2. 業種×目的の差分注入ロジックが JSON 仕様で安定
3. GPT-5.4 評価エンジンのレイテンシ・コストが把握できている
4. Supabase スキーマが確定している

上記が揃う前は移行しない。

## 2. 移行の目的
- 認証 / 進捗保存 / 決済 / 管理画面を DB 化
- カリキュラム差分生成をサーバー側で行う
- AI 評価を API Route 経由で保護
- SEO は SSG / ISR で維持

## 3. アーキテクチャ（目標）
```
Next.js 15 (App Router)
  ├─ app/(public)        # 現 index, corporate, individual 等
  ├─ app/(learn)         # dashboard, lesson
  ├─ app/(admin)         # admin-*
  ├─ app/api/ai          # GPT-5.4 proxy
  ├─ app/api/evaluate    # 評価エンジン
  └─ lib/curriculum      # JSON → runtime
Supabase
  ├─ users
  ├─ enrollments
  ├─ submissions
  ├─ evaluations
  └─ curriculum_rules
```

## 4. 移行戦略（段階）
1. **Phase M1**: 既存 HTML を App Router にそのまま移植（SSG）。URL 互換維持
2. **Phase M2**: onboarding / lesson を React 化、localStorage → Supabase
3. **Phase M3**: 管理面の Supabase 化、AI API Route 化
4. **Phase M4**: 決済・サブスク、RLS 強化、監査ログ

## 5. 非機能要件
- 初回ロード 2 秒以内（LCP）
- 既存SEO評価を落とさない（301 はほぼ使わず、パス維持）
- 既存画像資産を next/image で再利用

## 6. 移行判定ボード
- 毎月1回、移行開始条件をレビュー
- 条件未達なら静的運用を継続
- 強行移行は禁止
