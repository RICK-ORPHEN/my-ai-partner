# アセット最適化計画 / Asset Optimization Plan

## 1. 現状
- `docs/images/` が 64MB / 29枚
- 1枚 2〜3MB の PNG が混在
- LCP / 通信量の観点で重い

## 2. 目標
- images/ 総量 30MB 以下
- ヒーロー画像 LCP 2.0s 以内
- Lighthouse Performance 80 以上

## 3. 施策
1. **WebP 変換**: すべての PNG を WebP に。`cwebp -q 82` 目安
2. **サイズ最適化**: 表示最大幅の 2 倍までにリサイズ（例 hero 1920px）
3. **遅延読み込み**: `loading="lazy"` を hero 以外の全画像に付与
4. **srcset**: hero 画像だけ 1x/2x を用意
5. **不要画像の退役**: v1 ページ専用画像を洗い出し退役フォルダへ
6. **OGP**: 1200x630 PNG を専用に1枚だけ持つ

## 4. 手順
1. `docs/images/` を棚卸し（使用箇所 grep）
2. 未使用を `docs/images/_retired/` へ移動
3. 使用中を WebP 化し、HTML の `src` を一括置換
4. 画像総量を計測し、目標値達成を確認

## 5. 非機能
- フォントは Google Fonts の `display=swap`
- CSS/JS は minify しない（可読性重視、ファイルサイズは許容）
- ルート `/` に `robots.txt` と `sitemap.xml` を配置
