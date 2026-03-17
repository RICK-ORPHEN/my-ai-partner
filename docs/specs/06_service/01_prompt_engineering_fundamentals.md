# 01 Prompt Engineering Fundamentals

AI School Core Curriculum

---

## 1 Overview

本講座では、AIに対して意図したアウトプットを生成させるための「プロンプト設計」を学ぶ。

受講後は以下ができる状態を目指す：

- AIの出力を安定してコントロールできる
- 再現性のあるプロンプトを作成できる
- 業務にそのまま使えるプロンプトを設計できる

---

## 2 Why It Matters

AIは「何を入力するか」で性能が決まる。

同じAIでも：

Bad Prompt → 使えない出力
Good Prompt → 実務レベルの成果物

つまり、プロンプトは「スキル」であり、最も重要な基礎能力。

---

## 3 Core Concepts

### 3.1 Prompt Structure

基本構造：

- Instruction（指示）
- Context（文脈）
- Input Data（入力）
- Output Format（出力形式）

---

### 3.2 Instruction Design

曖昧な指示はNG。

❌ 悪い例
「いい感じにまとめて」

✅ 良い例
「以下の文章を、ビジネス向けに300文字以内で要約してください」

---

### 3.3 Output Control

出力形式を指定することで品質が安定する。

例：

- 箇条書き
- JSON
- 表形式

---

## 4 Examples

### 4.1 Bad Example

「この文章まとめて」

→ 問題点：

- 指示が曖昧
- 出力形式不明
- 再現性なし

---

### 4.2 Good Example

以下の文章を要約してください。

条件：

- 200文字以内
- ビジネス用途
- 箇条書きで出力

文章：
{{TEXT}}

---

### 4.3 Structured Output Example

以下の内容をJSON形式で出力してください。

項目：

- title
- summary
- keywords（3つ）

---

## 5 Prompt Patterns

### Pattern 1: Role Assignment

「あなたはプロのマーケターです。」

---

### Pattern 2: Constraint

「100文字以内で」

---

### Pattern 3: Format Control

「JSON形式で出力してください」

---

### Pattern 4: Step-by-Step

「ステップごとに説明してください」

---

### Pattern 5: Few-shot

例を与える：

Example:
Input:
Output:

---

## 6 Assignment

以下のプロンプトを作成せよ。

### Task 1

ビジネス提案書を生成するプロンプト

---

### Task 2

長文記事を要約するプロンプト

---

### Task 3

文章を構造化データ（JSON）に変換するプロンプト

---

### Task 4

SNS投稿を生成するプロンプト

---

### Task 5

自分の業務に使えるプロンプトを1つ作成

---

## 7 Expected Output

提出物：

- プロンプト5本
- 各プロンプトの用途説明
- 実行結果

---

## 8 Solution (Example)

### Task 2 模範解答

以下の文章を要約してください。

条件：

- 150文字以内
- ビジネス用途
- 箇条書き形式

文章：
{{TEXT}}

---

### Task 3 模範解答

以下の文章をJSON形式で出力してください。

項目：

- title
- summary
- category

文章：
{{TEXT}}

---

## 9 Evaluation Criteria

評価基準：

### 1 明確性（20点）

指示が具体的か

### 2 再現性（20点）

同じ結果が出るか

### 3 実用性（20点）

実務で使えるか

### 4 構造化（20点）

出力形式が整理されているか

### 5 創造性（20点）

工夫があるか

---

## 10 Skill & Reputation Link

この課題をクリアすると：

Skill:
Prompt Engineering +20

Reputation:
+5（レビューあり）

---

## 11 Advanced Challenge（任意）

以下を満たすプロンプトを作成：

- 入力：商品情報
- 出力：LP（ランディングページ）

条件：

- セールスライティング形式
- 見出し構造あり
- 感情訴求あり

---

## 12 Summary

- プロンプトはAIの性能を決める最重要スキル
- 構造化・制約・役割付与が鍵
- 再現性のある設計が重要

次の講座では、APIを使ってAIをシステムに組み込む方法を学ぶ
