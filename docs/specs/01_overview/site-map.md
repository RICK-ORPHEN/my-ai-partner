# サイトマップ / Site Map（正規構造）

本書は my-ai-partner サイトの **正規ページ** と **退役ページ** を定義する唯一のソースである。
追加・変更時はまず本書を更新し、以後の実装は本書に従うこと。

## 1. 4層構造
| 層 | 役割 | 代表ページ |
|---|---|---|
| 公開面 | 世界観 / 価値提案 / 流入 | index, about, corporate, individual |
| 導入面 | 業種・目的・現在地の取得 | onboarding, interactive-onboarding |
| 学習面 | コース受講・提出・評価 | dashboard-v2, lesson-interactive-v2 |
| 管理面 | 運営者用の受講者/教材管理 | admin, admin-* |

## 2. 正規ページ一覧

### 2-1. 公開面
- `/index.html` — TOP。価値提案と導線集約
- `/pages/about.html` — サービス思想
- `/pages/company.html` — 会社情報
- `/pages/corporate.html` — 法人向けサービス紹介
- `/pages/individual.html` — 個人向けサービス紹介
- `/pages/pricing.html`
- `/pages/cases.html`
- `/pages/courses-industry.html` — 業種別に学べるテーマ一覧
- `/pages/knowledge.html`
- `/pages/seminar.html`
- `/pages/news.html`
- `/pages/lab.html`
- `/pages/legal.html`
- `/pages/privacy.html`
- `/pages/tokushoho.html`
- `/pages/contact.html` — **新規必須**
- `/pages/terms.html` — **新規必須**

### 2-2. 導入面
- `/pages/onboarding.html` — 軽量版 / 通常導入
- `/pages/interactive-onboarding.html` — 本命 / AIスクール体験の中核

### 2-3. 学習面（v2 正規）
- `/pages/dashboard-v2.html` — ダッシュボード本体
- `/pages/dashboard-skills-v2.html` — スキル可視化
- `/pages/dashboard-matching-v2.html` — 業種・目的マッチング
- `/pages/lesson-interactive-v2.html` — レッスン実行本体

### 2-4. 管理面
- `/pages/admin.html`
- `/pages/admin-users.html`
- `/pages/admin-courses.html`
- `/pages/admin-content.html`
- `/pages/admin-assignments.html`
- `/pages/admin-projects.html`
- `/pages/admin-skills.html`
- `/pages/admin-talent.html`
- `/pages/admin-marketing.html`
- `/pages/admin-revenue.html`
- `/pages/admin-system.html`
- `/pages/admin-ai-evaluations.html` — **新規追加**
- `/pages/admin-curriculum-rules.html` — **新規追加**
- `/pages/admin-onboarding-flows.html` — **新規追加**

## 3. 退役ページ一覧
下記は **削除せず、退役案内ページ化** する。
ページ本文を消し、正規ページへの誘導 CTA のみを残す。

### 3-1. v1 ダッシュボード
- dashboard.html → dashboard-v2.html
- dashboard-courses.html → dashboard-v2.html
- dashboard-skills.html → dashboard-skills-v2.html
- dashboard-assignments.html → dashboard-v2.html
- dashboard-projects.html → dashboard-v2.html
- dashboard-history.html → dashboard-v2.html
- dashboard-offers.html → dashboard-matching-v2.html
- dashboard-community.html → dashboard-v2.html
- dashboard-profile.html → dashboard-v2.html
- dashboard-settings.html → dashboard-v2.html
- dashboard-billing.html → dashboard-v2.html

### 3-2. v1 レッスン
- lesson-01.html / lesson01.html / lesson02.html → lesson-interactive-v2.html
- lesson-restaurant/retail/realestate/medical/legal/construction/beauty/education-01.html → lesson-interactive-v2.html（カリキュラムエンジンで差分注入後に再生成）

## 4. リンク切れ修正ルール
index.html が現在参照している不在リンクは下記方針で修正する。

| 現リンク | 対処 |
|---|---|
| talent-db.html | → talent.html にリライト |
| ai-lab.html | → lab.html にリライト |
| case-studies.html | → cases.html にリライト |
| terms.html | **新規作成** |
| contact.html | **新規作成** |
| careers.html | ナビから削除（必要になったら新設） |
| skill-assessment.html | ナビから削除（将来は onboarding と統合） |

## 5. 命名規則
- 静的 HTML の下で運用する間は、新 UI を `-v2` 以降で増やさない。v3 は禁止。
- 業種別レッスンの個別ファイルは作らない。`lesson-interactive-v2.html` + カリキュラムエンジンで出し分ける。
- 別デザイン・別世界観のページ群を新設しない。
