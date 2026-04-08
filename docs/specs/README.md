# AI SCHOOL Specs — Single Source of Truth

このフォルダは my-ai-partner プロジェクトにおける **唯一の仕様ソース** です。
実装は必ず本書を先に更新してから行ってください。

## 読む順番（推奨）
1. `01_overview/service-definition.md` — このサービスの正体
2. `01_overview/site-map.md` — 正規 / 退役ページ
3. `01_overview/user-journey.md` — 体験全体像
4. `02_website/public-ia.md` — 公開面IA
5. `02_website/onboarding-flow.md` — 導入面の入出力
6. `02_website/v1-v2-consolidation.md` — 統廃合方針
7. `02_website/link-fix-plan.md` — リンク切れ修正
8. `03_product/curriculum-framework.md` — レッスン共通骨格
9. `03_product/chatbot-course-definition.md` — 最初の完成コース
10. `03_product/industry-difference-rules.md`
11. `03_product/goal-difference-rules.md`
12. `03_product/evaluation-framework.md`
13. `04_technical/static-site-governance.md`
14. `04_technical/future-nextjs-migration-plan.md`
15. `04_technical/asset-optimization-plan.md`
16. `05_ai_engine/gpt54-role-definition.md`
17. `05_ai_engine/hint-engine-design.md`
18. `05_ai_engine/evaluation-engine-design.md`
19. `05_ai_engine/curriculum-generation-logic.md`
20. `06_service/business-model.md`
21. `06_service/school-positioning.md`
22. `06_service/launch-plan.md`

## 大原則（再掲）
1. 既存サイトの下で拡張する。別世界観の独立サイトは作らない
2. v1 と v2 を併存させない。正規は v2
3. 教材は「説明」ではなく「思考誘導」
4. AI は答えを渡さない（問い / ヒント / 評価のみ）
5. 業種別レッスンを直接量産しない。共通骨格 × 差分モジュール
6. まず静的 HTML で完成度を上げる。Next.js 移行は条件付き

## 禁止事項
- 仕様未更新での実装着手
- v3 以降の命名でのページ増設
- 完成コードを hints に埋め込むこと
- 別デザイン・別ディレクトリでの並行実装
