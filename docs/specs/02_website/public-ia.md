# 公開面 情報設計 / Public Information Architecture

## 1. 目的
初見ユーザーに対して「何が学べるか / 自分に合うか / どう始めるか」を3スクロール以内で伝える。

## 2. グローバルナビゲーション（確定版）
```
AI SCHOOL（ロゴ → index）
├─ AIスクールとは         → #about（index内セクション）
├─ 法人向け               → pages/corporate.html
├─ 個人向け               → pages/individual.html
├─ 業種別コース           → pages/courses-industry.html
├─ 料金                   → pages/pricing.html
├─ 事例                   → pages/cases.html
├─ ナレッジ               → pages/knowledge.html
├─ セミナー               → pages/seminar.html
├─ AIラボ                 → pages/lab.html
├─ AI人材DB               → pages/talent.html
└─ [CTA] 無料で始める     → pages/interactive-onboarding.html
```

フッターナビ:
```
会社情報 / お問い合わせ / 利用規約 / プライバシー / 特商法 / ニュース
company.html / contact.html / terms.html / privacy.html / tokushoho.html / news.html
```

## 3. index.html セクション構成（上から順）
1. Hero — キャッチ + サブコピー + CTA（「無料で自分専用カリキュラムを見る」）
2. Problem — 現場で AI 導入が進まない3つの理由
3. Solution — 業種×目的×現在地で出し分ける学習OS
4. How it works — オンボーディング→学習→評価→実務の4ステップ
5. Industry — 8業種アイコン + 代表テーマ
6. Course highlight — チャットbot開発コースを前面に
7. Evidence — 事例 / 受講者の声 / 導入企業ロゴ
8. Pricing glimpse — 法人 / 個人の代表プラン
9. Final CTA — 「業種を選んでスタート」

## 4. 公開面に置かないもの
- 管理画面への直リンク
- v1 ダッシュボードへのリンク
- 未完成の業種別レッスンへの直リンク（必ず onboarding 経由）

## 5. アクセシビリティ / SEO
- lang="ja", meta description を全ページ必須
- h1 は1ページ1つ、セクション構造は h2/h3 で階層化
- OGP 画像をコース単位で作成
- 内部リンクはすべて相対パス
