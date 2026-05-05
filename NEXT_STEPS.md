# 次にやること（公開までの最短手順）

v3 完全実装は完了しコミット済（commit `a535aa7`）。Rickさんのローカルからこれを実行すれば公開状態になります。

## 1. GitHubに push（認証）
```bash
cd ~/Documents/Claude/Projects/"AI SCHOOL"
git push origin main
```
SSH/PAT認証が通るマシンから実行してください。

## 2. Supabase
1. https://supabase.com で新プロジェクト
2. Settings → API から URL / anon / service_role を取得
3. SQL Editor で順に実行：
   - `supabase/migrations/003_v3_full_schema.sql`
   - `supabase/migrations/004_v3_seed_data.sql`
4. Authentication → Providers で Email + Magic Link を有効化

## 3. Stripe
1. https://stripe.com でプロダクト作成：
   - 月額 ¥9,800 → `STRIPE_PRICE_MONTHLY`
   - 年額 ¥98,000 → `STRIPE_PRICE_YEARLY`
   - 法人 ¥49,800/5シート → `STRIPE_PRICE_TEAM`
2. Webhook endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Signing secret を `STRIPE_WEBHOOK_SECRET` に

## 4. Keyless AI（AI採点用）
1. https://app.keyless-ai.com で aischool プロジェクト
2. OpenAI のキーを vault に保存（alias: `global.openai.main`）
3. 環境変数: `KEYLESS_EMAIL` / `KEYLESS_PASSWORD` / `KEYLESS_PROJECT_ID`

## 5. アフィリエイトリンク
- Vercel: https://vercel.com/?ref=aischool
- Supabase: https://supabase.com/?ref=aischool
- Squarespace: https://squarespace.com/?ref=aischool

各社のアフィプログラムで生成したUTMリンクを `NEXT_PUBLIC_AFFILIATE_*` に設定。

## 6. Vercel デプロイ
```bash
cd web
npm install
npx vercel link
# Project Settings で全環境変数を設定（.env.example参照）
npx vercel --prod
```

## 7. 自分をadminに昇格
Supabase SQL Editor:
```sql
update profiles set is_admin = true where email = 'r-prolifera-art@i.softbank.jp';
```

## 8. スモークテスト
- https://your-domain.com → LP
- /signup → 確認メール → /onboarding → /dashboard
- /courses → 受講登録 → /lesson/restaurant_01 → 成果物提出 → AI採点
- /admin で全データが見える
- Stripe テストカード `4242 4242 4242 4242` で /api/billing/checkout

---
完成したら deploy-verify スキルでヘルスチェック自動化、scheduleスキルで定期監視まで載せられます。
