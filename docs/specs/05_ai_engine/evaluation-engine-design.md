# 評価エンジン設計 / Evaluation Engine Design

## 1. 入力契約
```json
{
  "lesson_id": "chatbot-01",
  "industry": "restaurant",
  "goal": "customer_inquiry",
  "level": "beginner",
  "rubric": { ... evaluation-framework.md の評価軸 ... },
  "submission": "受講者の提出テキスト"
}
```

## 2. 出力契約
`evaluation-framework.md` の JSON 形式に準拠。

## 3. プロンプト骨子
```
あなたはAI SCHOOLの評価エンジンです。
以下のルーブリックに従い、受講者の提出物を評価してください。

評価ルール:
- 0〜20点の5軸で採点
- 合計スコアを返す
- 強み1〜3、足りない視点1〜3、次の問い1〜2 を返す
- 完成答えを返さない
- 「正解」という言葉を使わない
- 個人否定を禁止
- JSON 以外を返さない
```

## 4. スコアの安定性確保
- temperature: 0.2
- 同じ提出物を2回評価した際のスコア差は ±5 以内を目標
- 大幅にぶれる場合は rubric の定義を見直す

## 5. フォールバック
- API 失敗時は「評価保留」メッセージとともに再提出 CTA を表示
- サーバー側で 3 回リトライ、それでも失敗ならキューへ

## 6. ログ保存
- すべての評価結果を DB（将来 Supabase）に保存
- 受講者別・レッスン別・業種別の分布を可視化
