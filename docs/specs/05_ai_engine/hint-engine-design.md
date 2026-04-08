# ヒントエンジン設計 / Hint Engine Design

## 1. 4段階ヒントモード
| Mode | 役割 | 例 |
|---|---|---|
| A | 問いだけ | 「今一番多い質問は何ですか？」 |
| B | 軽いヒント | 「質問を『定型 / 半定型 / 個別』に分けてみよう」 |
| C | 構造ヒント | 「bot化対象は『定型のみ』と置くと楽です。理由を3つ」 |
| D | 評価フィードバック | 提出物を評価して足りない観点を返す |

受講者が要求したときのみ、Mode B → C と段階的に開示する。
Mode A で先に進める設計を標準とし、C は「本当に詰まった」フラグが立ったときのみ。

## 2. 状態遷移
```
[開始] → Mode A 提示
  → 受講者操作:
       "考える" → 提出フロー
       "ヒント" → Mode B
       "もう一段" → Mode C
       "評価" → Mode D
  → 提出 → Evaluation Engine → 結果表示
  → スコアに応じて:
       Pass → 次レッスン
       Revise → Mode C を追加で出して再提出
       Retry → Mode A を別角度で再提示
```

## 3. プロンプト設計
System Prompt: `gpt54-role-definition.md` 参照。
User Prompt テンプレート:
```
LESSON: {lesson_id} - {title}
CONTEXT: {industry}/{goal}/{level}
MODE: {A|B|C}
PREVIOUS_HINTS: {配列}
```

## 4. 禁止事項
- 同じ Mode で同じ文言を繰り返さない
- Mode C で完成コードを示さない
- Mode B を飛ばして Mode C を出さない

## 5. ログ
- Mode 別の開示回数をセッションに記録
- `admin-ai-evaluations.html` で後から分析可能にする
