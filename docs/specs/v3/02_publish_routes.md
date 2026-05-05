# v3 公開ルート設計

## 学習者レベル判定（Onboarding時）
オンボーディングで以下を質問：
- Q1: コーディング経験は？（ある / 少しある / 全くない）
- Q2: 公開後の運用は？（自分で更新したい / 業者に任せたい / どちらでも）
- Q3: 月額予算は？（〜2,000円 / 〜10,000円 / 規模問わず）

回答を `learner_track` に保存：
- `track_a` = コーディング派（Vercel + Supabase + GitHub）
- `track_b` = ノーコード派（Squarespace のみ）
- `track_hybrid` = 段階的にAから始めて将来Bへ／逆も

## Track A (Vercel + Supabase)
**ターゲット:** 自分で更新したい・コードに興味あり

レッスン6 で：
- GitHub アカウント作成誘導
- Next.js プロジェクトテンプレ提供（`npx create-aischool-app`）
- Supabase プロジェクト作成誘導（**アフィリリンク**）

レッスン7 で：
- Vercel連携（**アフィリリンク**）
- 独自ドメイン取得ガイド
- 公開後のVercel Analyticsで効果計測

**成果物の例:** `https://yourname.vercel.app` で動くお店アプリ

## Track B (Squarespace)
**ターゲット:** 触りたくない／本業に集中したい

レッスン6 で：
- Squarespace アカウント作成誘導（**アフィリリンク**）
- 業種別テンプレ提供（事前に弊社で作り込んだもの）
- AI生成コンテンツ（コピー・画像）をテンプレに流し込む

レッスン7 で：
- 独自ドメイン購入
- SEO設定
- 公開・効果測定

**成果物の例:** `https://yourname.com` のSquarespaceサイト

## アフィリエイト構成

| サービス | 紹介手数料 | DBカラム |
|---------|------------|----------|
| Vercel Pro | 月額の20% | `affiliate_vercel_signed_up` |
| Supabase Pro | 月額の30% | `affiliate_supabase_signed_up` |
| Squarespace Business | 初年度の20% | `affiliate_squarespace_signed_up` |

各レッスンで該当サービスを誘導した時：
- アフィリリンクを `?ref=aischool_{user_id}` 付きで生成
- Webhook で契約完了を検知（手動入力 or APIあれば自動）
- `affiliate_revenues` テーブルにINSERT

## 公開後フロー
1. 受講生が公開URLを `student_products` テーブルに登録
2. AIレビュー実行（Lighthouse + Claude review prompt）
3. 改善アイディア提示
4. ポートフォリオに自動追加
5. `portfolio.aischool.app/{username}` で公開
