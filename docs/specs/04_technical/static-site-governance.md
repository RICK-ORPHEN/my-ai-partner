# 静的サイト運用ガバナンス / Static Site Governance

## 1. 基本方針
- 当面は GitHub Pages + 静的 HTML で運用する
- 動的処理は最小限（localStorage / fetch / JSON 読み込み）
- いきなり Next.js 移行を主計画にしない

## 2. ディレクトリ構成（確定）
```
docs/
  index.html
  css/
    style.css         # 共通
    dashboard.css     # 学習面
    lesson.css        # レッスン実行面
  js/
    main.js           # ナビ・共通UI
    onboarding.js     # 導入フロー（新規）
    lesson-engine.js  # レッスン差分注入（新規）
  images/             # 画像（最適化必須）
  pages/              # 正規ページ群
  data/               # JSON（新規）
    courses/
      chatbot.json
    industries.json
    goals.json
    rules/
      industry-diff.json
      goal-diff.json
  specs/              # 本仕様書群
```

## 3. コーディング規約
- すべて UTF-8 / LF
- インデント 2 スペース
- HTML は W3C 検証をパス
- CSS は既存の lp-03 変数（`--or`, `--bk`, `--wh`）を再利用
- JS は vanilla のみ、外部ライブラリ追加は Issue で承認制
- ファイル命名は kebab-case

## 4. Git 運用
- main 直 push は禁止（Phase 2 以降）。feature ブランチ → PR → レビュー
- docs/ 以下の変更はビルド不要で即反映される前提で扱う
- specs/ 以下の変更は実装に先行して PR を分ける

## 5. デプロイ
- GitHub Pages: main ブランチ / /docs フォルダ
- デプロイ後は `deploy-verify` スキルで死活監視
- 公開URL: https://rick-orphen.github.io/my-ai-partner/

## 6. 品質ゲート
- リンク切れゼロ（link-fix-plan.md 参照）
- Lighthouse: Performance 80 / Accessibility 90 / SEO 90 以上
- 画像総量 30MB 以下（Phase 1 で達成）

## 7. 禁止事項
- 新 UI を `v3`, `v4` で増やすこと
- 別世界観の独立ディレクトリを切ること
- specs 未更新のまま実装を走らせること
