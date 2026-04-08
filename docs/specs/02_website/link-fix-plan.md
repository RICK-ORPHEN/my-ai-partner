# リンク切れ修正計画 / Link Fix Plan

## 1. 現状の死んでいるリンク（index.html 起点）
| 現リンク | 状態 | 対処方針 |
|---|---|---|
| pages/talent-db.html | 不在 | `pages/talent.html` にリライト |
| pages/ai-lab.html | 不在 | `pages/lab.html` にリライト |
| pages/case-studies.html | 不在 | `pages/cases.html` にリライト |
| pages/terms.html | 不在 | **新規作成**（利用規約） |
| pages/contact.html | 不在 | **新規作成**（問い合わせ） |
| pages/careers.html | 不在 | ナビから削除 |
| pages/skill-assessment.html | 不在 | ナビから削除（将来 onboarding に統合） |

## 2. 作業手順
1. `grep -rn 'talent-db\|ai-lab\|case-studies\|careers\|skill-assessment' docs/` で全参照を洗う
2. 存在するページへのリライトは一括 sed
3. 新規作成ページ（contact.html, terms.html）は最小テンプレを specs/02_website/templates に置く想定
4. ナビから削除するリンクは `<a>` ごと消す
5. 修正後に HTML lint + リンクチェッカー（例: linkinator）で全ページ検証

## 3. 新規ページの最小仕様

### contact.html
- 目的: 問い合わせ受付
- 内容:
  - 会社・担当者名（必須）
  - メール（必須）
  - 業種
  - 問い合わせ種別（法人 / 個人 / 取材 / その他）
  - 自由記述
- 送信先: 初期は Formspree 等の外部サービス or mailto。後に Supabase 経由に差し替え

### terms.html
- 目的: 利用規約
- 章立て: 総則 / 利用登録 / 禁止事項 / 本サービスの提供停止 / 免責事項 / 知的財産権 / 準拠法・裁判管轄

## 4. 検収条件
- 全ページで 404 を出すリンクがゼロ
- ナビゲーション構造が `public-ia.md` と一致
- リダイレクトチェーンが発生していない
