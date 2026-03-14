# My AI Partner

## プロジェクト概要

本プロジェクトは、**企画書の簡易作成**および**WEBサイトの簡易構築**を目的としたリポジトリです。

## 目的

- 企画書を簡単に作成できる環境を提供する
- WEBサイトを簡単に構築できる環境を提供する

## 運用方針

### デプロイについて

- 本プロジェクトは**手動デプロイ**を採用しています
- オーナーは非エンジニアのため、デプロイ時には都度手順を案内します

### デプロイ手順（参考）

デプロイが必要になった際は、その時点での構成に合わせた具体的な手順を案内します。
基本的な流れは以下の通りです：

1. 変更内容の確認
2. デプロイ先への反映作業
3. 動作確認

※ 詳細な手順はデプロイ対象（WEBサイト等）が決まった段階で追記します。

## リポジトリ情報

- **リポジトリURL**: https://github.com/RICK-ORPHEN/my-ai-partner

### クローン手順

```bash
git clone https://github.com/RICK-ORPHEN/my-ai-partner.git
cd my-ai-partner
```

### Gemini API セットアップ手順

```bash
# 1. Pythonパッケージのインストール
pip install -r requirements.txt

# 2. 環境変数ファイルの作成
cp .env.example .env

# 3. .envファイルを編集してAPIキーを設定
nano .env

# 4. 接続テスト
python gemini_test.py
```

## 関連ドキュメント

| ファイル | 内容 |
|---------|------|
| [README.md](README.md) | 本ファイル（プロジェクト概要） |
| [BUGFIX_LOG.md](BUGFIX_LOG.md) | バグ修正記録 |
