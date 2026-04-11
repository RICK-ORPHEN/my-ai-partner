# 開発手順書 v2 — 飲食特化・課金検証先行
> 2026-04-11 確定

## 前提
- 最初の売上が出るまでに**2週間以上かけない**
- 飲食業1業種のみ深掘り。他業種は LP 表示のみ
- マッチングプラットフォームは作らない
- 静的 HTML + Supabase + Stripe で最小構成

---

## Phase 0 — 課金検証（Week 1-2）

### 目的
「¥49,800/月を払う飲食店オーナーが存在するか」を確認する。存在しなければピボット。

### Week 1: LP + 決済 + 無料体験公開

#### Day 1-2: LP改修
- [ ] index.html を飲食特化に書き換え
  - Hero: 「飲食店の電話対応、半分にしませんか？」
  - Problem: 予約電話 / 同じ質問 / 人手不足
  - Solution: 社員が自分で予約botを作れるようになるAI道場
  - How: オンボーディング → Lesson 1-2 無料 → 有料で完走
  - Pricing: ¥49,800/月（助成金で実質¥15,000以下）
  - CTA: 「無料で Lesson 1 を始める」
- [ ] OGP画像（飲食×AI）を1枚作成
- [ ] Google Analytics / Clarity 埋め込み

#### Day 3: 決済
- [ ] Stripe アカウント開設（RICK名義）
- [ ] Checkout Session 生成（¥49,800/月 サブスク）
- [ ] 決済完了 → Thank you ページ → dashboard-v2 へ誘導
- [ ] Webhook で Supabase に顧客レコード作成

#### Day 4-5: 無料体験の公開
- [ ] Lesson 1-2 を課金なしで完走可能にする
  - onboarding → lesson-runner（飲食×予約bot 固定）
  - Lesson 2 終了時に評価結果 + 課金 CTA
- [ ] GPT-5.4 評価エンジン最小版（Supabase Edge Function）
  - Lesson 2 の提出物を5軸で評価
  - JSON レスポンス → 画面にスコア表示

#### Day 6-7: 集客開始
- [ ] X（Twitter）で飲食店オーナー向けに投稿（5本）
- [ ] Google 広告（飲食店 AI 予約 で 5万円テスト）
- [ ] 知人の飲食店 5 店に直接声かけ

### Week 2: データ収集と判断

- [ ] LP訪問数 / 無料体験開始数 / Lesson 2 完走数 / 有料転換数 を毎日確認
- [ ] **有料転換 0 社 → ピボット判断会議**
  - 価格を下げるか？（¥29,800 / ¥19,800）
  - 対象を変えるか？（美容 / 小売）
  - 訴求を変えるか？（予約bot → シフト管理）
- [ ] 1社でも転換 → Phase 1 に進む

### Phase 0 の技術スタック
```
LP: 静的 HTML（既存 index.html 改修）
決済: Stripe Checkout（サーバーレス）
Auth: Supabase Auth（メール + パスワード）
DB: Supabase（users / enrollments テーブルのみ）
AI: Supabase Edge Function → OpenAI API（GPT-5.4）
ホスティング: GitHub Pages（LP） + Supabase（API）
```

---

## Phase 1 — 1コース完走可能（Week 3-6）

### 目的
有料顧客が chatbot コース 7 レッスンを完走し、MVP bot を現場に導入できる状態。

### Week 3-4: Backend 基盤
- [ ] Supabase テーブル設計
  ```
  users (id, email, name, company, industry, plan, created_at)
  enrollments (id, user_id, course_id, status, started_at)
  progress (id, enrollment_id, lesson_id, status, started_at, completed_at)
  submissions (id, progress_id, content, submitted_at)
  evaluations (id, submission_id, score, by_axis, strengths, missing, next_q, created_at)
  ```
- [ ] RLS ポリシー（自分のデータしか見えない）
- [ ] Edge Function: 評価エンジン（全7レッスン対応）
- [ ] Edge Function: 進捗更新 API

### Week 4-5: Frontend 接続
- [ ] onboarding → 飲食固定でレッスンランナーに接続
- [ ] lesson-engine.js を Supabase API に接続
  - 提出 → Edge Function → GPT-5.4 評価 → DB保存 → 画面表示
  - 進捗保存（localStorage → Supabase に移行）
- [ ] dashboard-v2.html にリアルデータ接続
  - 現在のレッスン / 進捗バー / 次の課題 / 提出履歴
- [ ] Lesson 3-7 の飲食特化ヒント・評価基準を chatbot.json に追記

### Week 5-6: 磨き込み
- [ ] 有料顧客 5 社のフィードバックを収集
- [ ] Lesson 体験の UX 改善（つまずきポイント修正）
- [ ] 評価プロンプトのチューニング（スコア安定性 ±5 以内）
- [ ] deploy-verify でヘルスチェック自動化

---

## Phase 2 — ポートフォリオ（Week 7-9）

### 目的
修了者が「自分は何を作れるか」を URL 1つで見せられる状態。

### Week 7-8: スキルスコア基盤
- [ ] Supabase テーブル追加
  ```
  skill_scores (id, user_id, axis, score, updated_at)
  portfolios (id, user_id, public_url_slug, is_public, bio, created_at)
  certifications (id, user_id, course_id, issued_at, pdf_url)
  ```
- [ ] 評価結果 → 5軸スキルスコア集約ロジック
- [ ] dashboard-skills-v2.html にリアルデータ接続

### Week 8-9: 公開プロフィール
- [ ] `/portfolio/{slug}` の公開ページ生成（静的 or Edge Function SSR）
- [ ] PDF 認定証出力（修了者名 + コース名 + スコア + 日付）
- [ ] 「ポートフォリオを公開する」トグル（dashboard-skills-v2 既存UI活用）

---

## Phase 3 — 横展開判断（Week 10+）

### 条件（全て満たしたら実行）
- 飲食 30社到達
- 完走率 40%以上
- 月間チャーン 5%以下

### やること
- 2業種目（美容 or 小売）のコース JSON 追加
- LP の業種選択を有効化
- 価格改定（¥69,800/月）

---

## Phase 4 — マッチング判断（修了者100名+）

### 条件
- 修了者 100名以上
- 企業からの引き合い（メール/問い合わせ）が月5件以上

### やること（やるなら）
- 企業ダッシュボード（簡易版）
- オファー送受信
- 手数料決済

### やらない場合
- ポートフォリオ URL を名刺代わりに使う運用を継続
- マッチングは外部プラットフォーム（Wantedly 等）に任せる

---

## 禁止事項（全 Phase 共通）
1. 飲食以外の業種の教材を Phase 3 前に深掘りしない
2. マッチングプラットフォームを Phase 4 前に作らない
3. Next.js 移行を Phase 1 完了前に始めない
4. 「全部作ってからローンチ」をしない
5. 課金検証（Phase 0）をスキップしない
6. 既存 lp-03 デザインから逸脱しない
