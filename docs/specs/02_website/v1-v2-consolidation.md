# v1 / v2 統廃合方針 / Consolidation Plan

## 1. 原則
- 正規は **v2 系** に統一する
- v1 ページは **削除しない**。退役案内ページに書き換える
- v3 は作らない。以後の改修は v2 を更新する形で進める

## 2. 正規ページ（v2）
| ページ | 役割 |
|---|---|
| dashboard-v2.html | 学習ダッシュボード本体 |
| dashboard-skills-v2.html | 獲得スキル / 評価履歴 |
| dashboard-matching-v2.html | 業種・目的別マッチング |
| lesson-interactive-v2.html | 問い・ヒント・提出・評価の実行面 |

## 3. 退役ページと誘導先
| 退役ページ | 誘導先 |
|---|---|
| dashboard.html | dashboard-v2.html |
| dashboard-courses.html | dashboard-v2.html |
| dashboard-skills.html | dashboard-skills-v2.html |
| dashboard-assignments.html | dashboard-v2.html |
| dashboard-projects.html | dashboard-v2.html |
| dashboard-history.html | dashboard-v2.html |
| dashboard-offers.html | dashboard-matching-v2.html |
| dashboard-community.html | dashboard-v2.html |
| dashboard-profile.html | dashboard-v2.html |
| dashboard-settings.html | dashboard-v2.html |
| dashboard-billing.html | dashboard-v2.html |
| lesson-01.html / lesson01.html / lesson02.html | lesson-interactive-v2.html |
| lesson-{industry}-01.html (8本) | lesson-interactive-v2.html |

## 4. 退役案内ページのテンプレート
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="3; url={{ 誘導先 }}">
  <link rel="canonical" href="{{ 誘導先 }}">
  <title>このページは移動しました - AI SCHOOL</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="retired-page">
  <main class="retired-wrap">
    <p class="retired-badge">移動しました</p>
    <h1>このページは新しい学習面へ統合されました</h1>
    <p>3秒後に自動で新しいページに移動します。</p>
    <a class="btn btn-primary" href="{{ 誘導先 }}">今すぐ移動する</a>
  </main>
</body>
</html>
```

## 5. 統廃合の実施順
1. v2 正規ページの最終チェック（リンク・導線）
2. 退役テンプレートを 1 枚作る
3. 旧ページを一括で退役テンプレートに差し替える
4. index.html / nav から旧ページへのリンクを全消しする
5. sitemap.xml を更新（あれば）

## 6. company / corporate の重複整理
- `company.html` = 会社情報（代表・沿革・所在地）
- `corporate.html` = 法人向けサービス紹介（プラン・事例・CTA）
ナビ表記は「法人向け = corporate」「会社情報 = footer → company」で分離する。
