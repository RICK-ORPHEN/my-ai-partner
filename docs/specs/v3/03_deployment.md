# v3 デプロイ手順

## 1. Supabase プロジェクト作成
1. https://supabase.com で新プロジェクト作成（**アフィリリンクは将来 NEXT_PUBLIC_AFFILIATE_SUPABASE で受講生に提示**）
2. Settings → API から URL / anon / service_role を取得
3. SQL Editor で以下を順に実行:
   - `supabase/migrations/003_v3_full_schema.sql`
   - `supabase/migrations/004_v3_seed_data.sql`
4. Authentication → Providers で Email を有効化、Magic Link許可

## 2. Stripe セットアップ
1. https://stripe.com でアカウント作成
2. Products でプラン作成:
   - Monthly: ¥9,800/月
   - Yearly: ¥98,000/年
   - Team: ¥49,800/月（5シート）
3. 各 price_xxx をメモ
4. Webhook endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Signing secret をメモ

## 3. Keyless AI（AI採点用）
1. https://app.keyless-ai.com で aischool プロジェクト作成
2. OpenAI キーを vault に保存（aliasは `global.openai.main`）
3. KEYLESS_EMAIL / KEYLESS_PASSWORD / KEYLESS_PROJECT_ID を取得

## 4. Vercel デプロイ
```bash
cd web
vercel link
# Project Settings → Environment Variables で以下を設定:
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
# STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY, STRIPE_PRICE_TEAM
# KEYLESS_EMAIL, KEYLESS_PASSWORD, KEYLESS_PROJECT_ID
# NEXT_PUBLIC_AFFILIATE_VERCEL/SUPABASE/SQUARESPACE
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
vercel --prod
```

## 5. アドミン昇格
最初の管理者として自分を昇格:
```sql
update profiles set is_admin = true where email = 'r-prolifera-art@i.softbank.jp';
```

## 6. スモークテスト
1. https://your-domain.com を開いてLPを確認
2. /signup → 確認メール → /onboarding → /dashboard へ遷移できること
3. /courses → 任意のコース → 受講登録 → /lesson/xxx_01 が開く
4. ダミー成果物を提出 → /api/submissions/score がスコアを返す
5. Stripe Test Cardで /api/billing/checkout
6. /admin で全ユーザー・レッスン・採点・プロダクト・アフィリエイトが見える
