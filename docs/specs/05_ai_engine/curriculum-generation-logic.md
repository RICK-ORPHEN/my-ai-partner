# カリキュラム生成ロジック / Curriculum Generation Logic

## 1. 入力
- industry（8カテゴリ＋その他）
- goal（10カテゴリ＋その他）
- level（3段）
- constraints（複数選択）

## 2. 出力
`onboarding-flow.md` の出力 JSON 形式。

## 3. 生成アルゴリズム（初期 = ルール表方式）
1. `rules/industry-diff.json` を引いて業種差分を取得
2. `rules/goal-diff.json` を引いて目的差分を取得
3. `courses/{goal}.json` をベースコースとして選択
4. `level` に応じて各レッスンの hints / deliverable を切り替え
5. `constraints` が「短期間」なら Lesson 3, 5, 7 を優先する短縮ルートに置換
6. `firstThreeLessons` には Lesson 1, 2, 3 を基本セット
7. `difficulty` は level × 業種リスクの合算で決定
8. `estimatedPeriod` は lesson 数 × 1週間 − 短縮制約

## 4. GPT-5.4 版（Phase 2）
- ルール表で素案を作り、GPT-5.4 に「受講者向けの表現」と「順序の最適化」を依頼
- 出力 JSON スキーマを固定し、壊れたら再試行

## 5. 品質チェック
- 出力 JSON がスキーマに合致するか
- firstThreeLessons がベースコースに存在するか
- difficulty と level が逆転していないか
- estimatedPeriod が制約と矛盾していないか

## 6. 失敗時挙動
- 不正な組み合わせ（例: 業種=その他 × 目的=その他）ならデフォルトのチャットbotコースを返す
- どの場合でも必ず firstThreeLessons を埋める
