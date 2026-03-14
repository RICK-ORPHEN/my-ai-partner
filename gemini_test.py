"""
Gemini API 接続テスト用スクリプト
.envファイルからAPIキーを読み込み、Geminiに簡単な質問を送信して動作確認を行う
"""

import os
import sys
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "ここにAPIキーを貼り付ける":
    print("エラー: .envファイルにGEMINI_API_KEYを設定してください")
    print("手順: .env.example を .env にコピーし、APIキーを記入してください")
    sys.exit(1)

client = genai.Client(api_key=api_key)

print("Gemini APIに接続テスト中...")
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="こんにちは！簡単に自己紹介してください。",
)
print("--- Gemini からの応答 ---")
print(response.text)
print("--- 接続テスト成功 ---")
