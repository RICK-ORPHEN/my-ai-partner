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

### VPSサーバー情報

- **サーバーIP**: 45.77.18.95
- **パスワード**: `.env` ファイルの `VPS_PASSWORD` を参照（セキュリティのためGit管理外に保存）

### VPSへの手動デプロイ手順

#### 初回セットアップ（1回だけ実行）

```bash
# 1. VPSにSSH接続する（パスワードは .env の VPS_PASSWORD を確認）
ssh root@45.77.18.95

# 2. VPS上でPythonとgitがインストールされているか確認
python3 --version
git --version

# 3. なければインストール（Ubuntu/Debianの場合）
apt update && apt install -y python3 python3-pip git

# 4. リポジトリをクローン
git clone https://github.com/RICK-ORPHEN/my-ai-partner.git
cd my-ai-partner

# 5. Pythonパッケージをインストール
pip install -r requirements.txt

# 6. .envファイルを作成してAPIキーを設定
cp .env.example .env
nano .env
# → GEMINI_API_KEY にAPIキーを貼り付けて保存（Ctrl+O → Enter → Ctrl+X）

# 7. 接続テスト
python3 gemini_test.py
```

#### 更新時のデプロイ手順（変更があるたびに実行）

```bash
# 1. VPSにSSH接続
ssh root@45.77.18.95

# 2. プロジェクトフォルダに移動
cd my-ai-partner

# 3. 最新のコードを取得
git pull origin main

# 4. 必要に応じてパッケージを更新
pip install -r requirements.txt

# 5. 動作確認
python3 gemini_test.py
```

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
