# カリキュラム共通骨格 / Curriculum Framework

## 1. 原則
- **レッスンは HTML ページ単位で量産しない**
- 量産単位は「レッスンテンプレート × 差分モジュール」
- 業種別レッスンは `lesson-interactive-v2.html` に **カリキュラム JSON を注入して出し分け**

## 2. 1レッスンのブロック構造
| ブロック | 内容 | 必須 |
|---|---|---|
| title | レッスンタイトル | ✅ |
| goal | このレッスンの到達目標 | ✅ |
| prerequisites | 前提知識・前レッスン | ✅ |
| question | 今回考える問い（1つに絞る） | ✅ |
| hints | 段階的ヒント（Mode A→D） | ✅ |
| ng_examples | ありがちなNG例 | ✅ |
| deliverable | 提出物の形式と粒度 | ✅ |
| evaluation | 評価基準（3〜5軸） | ✅ |
| next_link | 次レッスンへの接続 | ✅ |
| industry_diff | 業種差分（任意） | 任意 |
| goal_diff | 目的差分（任意） | 任意 |
| level_diff | レベル差分（任意） | 任意 |

## 3. レッスン JSON スキーマ（抜粋）
```json
{
  "id": "chatbot-01",
  "course": "chatbot",
  "title": "課題の定義",
  "goal": "botが解くべき課題を1文で言える",
  "prerequisites": [],
  "question": "あなたの現場で、人がやる必要のない質問対応は何ですか？",
  "hints": {
    "A": ["1日に何回、同じ質問に答えているか数えてみよう"],
    "B": ["質問を「定型」「半定型」「個別」に分類してみよう"],
    "C": ["人→bot に渡すのは『定型』だけでよい理由を3つ"],
    "D": ["提出された定義文を読み、抽象度・粒度・実行可能性で評価"]
  },
  "ng_examples": [
    "『AIでなんでも答える』のように対象が無限定",
    "人がやるべき部分とbotの役割が混ざっている"
  ],
  "deliverable": {
    "format": "markdown",
    "minLength": 120,
    "required_sections": ["対象質問", "対象外質問", "導入効果仮説"]
  },
  "evaluation": [
    "対象範囲が絞られているか",
    "人とbotの役割分担が明確か",
    "導入効果が定量で語られているか"
  ],
  "next_link": "chatbot-02",
  "industry_diff": {
    "medical": "誤案内リスクを明示すること",
    "legal": "守秘義務の観点を含めること",
    "restaurant": "営業時間・繁忙帯の想定を含めること"
  },
  "goal_diff": {
    "internal_support": "社員の質問を想定",
    "customer_inquiry": "顧客の一次質問を想定"
  },
  "level_diff": {
    "beginner": "質問例を3つ挙げるだけでOK",
    "advanced": "質問→意図→回答のマップを作る"
  }
}
```

## 4. 差分注入ロジック
1. オンボーディング結果から `{industry, goal, level}` を取得
2. レッスン JSON をロード
3. `industry_diff[industry]` を goal セクションにマージ
4. `goal_diff[goal]` を question セクションにマージ
5. `level_diff[level]` を hints セクションにマージ
6. 最終構造を `lesson-interactive-v2.html` にレンダリング

## 5. 骨格に対する禁止事項
- 完成コードを hints に埋め込むこと
- goal をふわっとした精神論にすること
- evaluation を主観だけにすること（少なくとも1軸は定量）
- next_link を分岐だらけにすること（基本は1本、分岐は最大2本）
