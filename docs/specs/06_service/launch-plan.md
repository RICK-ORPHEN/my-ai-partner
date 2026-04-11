# ローンチ計画 v2 — 課金検証先行・飲食特化

> v1 からの変更: Phase 0（課金検証）を最優先に追加。Phase 順序を全面再編。
> 詳細は `01_overview/development-roadmap-v2.md` を参照。

## Phase 0 — 課金検証（Week 1-2）✦ 最重要
- [ ] LP を飲食特化に改修
- [ ] Stripe Checkout 決済（¥49,800/月）
- [ ] Supabase Auth + 最小 DB
- [ ] Lesson 1-2 無料体験を公開
- [ ] GPT-5.4 評価エンジン最小版（Lesson 2 用）
- [ ] 集客開始（X / Google広告 / 直接営業）
- [ ] **有料転換 0 社ならピボット判断**

## Phase 1 — 1コース完走（Week 3-6）
- [ ] Supabase テーブル（users / enrollments / progress / submissions / evaluations）
- [ ] RLS ポリシー
- [ ] 評価エンジン全7レッスン対応
- [ ] lesson-engine.js → Supabase API 接続
- [ ] dashboard-v2 にリアルデータ接続
- [ ] 有料5社のフィードバックで磨き込み

## Phase 2 — ポートフォリオ（Week 7-9）
- [ ] skill_scores / portfolios / certifications テーブル
- [ ] 公開プロフィール URL 生成
- [ ] PDF 認定証出力
- [ ] dashboard-skills-v2 にリアルデータ接続

## Phase 3 — 横展開判断（Week 10+）
- 条件: 飲食30社 / 完走率40% / チャーン5%以下
- [ ] 2業種目のコース JSON 追加
- [ ] LP 業種選択の有効化
- [ ] 価格改定 ¥69,800/月

## Phase 4 — マッチング判断（修了者100名+）
- 条件: 企業からの引き合い月5件以上
- [ ] 企業ダッシュボード（簡易版）
- [ ] オファー機能
- または: 外部プラットフォーム連携で代替

## 成功判定

### 2週間後（Phase 0 完了）
- 有料転換: 1社以上（0 社 → ピボット）

### 6週間後（Phase 1 完了）
- 有料顧客: 10社
- MRR: ¥498,000
- 継続率: 80%以上

### 6ヶ月後
- 有料顧客: 30社
- MRR: ¥1,494,000
- 完走率: 40%
- 月間チャーン: 5%以下
