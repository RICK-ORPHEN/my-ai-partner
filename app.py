"""
AI Slide Generator - メインアプリケーション
テンプレートベースのAIスライド生成＆編集ツール
"""

import json
import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)

# Gemini APIクライアント初期化
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash"


@app.route("/")
def index():
    """メインページ - テンプレート選択＆入力画面"""
    return render_template("index.html")


@app.route("/editor")
def editor():
    """スライド編集エディタ"""
    return render_template("editor.html")


@app.route("/api/generate", methods=["POST"])
def generate_slides():
    """AIスライド生成API"""
    data = request.get_json()
    template_id = data.get("template_id", "business-blue")
    content = data.get("content", "")
    slide_count = data.get("slide_count", 5)

    if not content:
        return jsonify({"error": "コンテンツを入力してください"}), 400

    template_styles = get_template_styles(template_id)

    prompt = f"""あなたはプロのプレゼンテーションデザイナーです。
以下の内容をもとに、{slide_count}枚のスライドを生成してください。

【入力内容】
{content}

【出力形式】
以下のJSON形式で出力してください。JSONのみを出力し、他のテキストは含めないでください。

{{
  "slides": [
    {{
      "type": "title",
      "title": "プレゼンテーションタイトル",
      "subtitle": "サブタイトル"
    }},
    {{
      "type": "content",
      "title": "スライドタイトル",
      "bullets": ["ポイント1", "ポイント2", "ポイント3"],
      "note": "補足説明（任意）"
    }},
    {{
      "type": "two-column",
      "title": "比較スライド",
      "left_title": "左列タイトル",
      "left_items": ["項目1", "項目2"],
      "right_title": "右列タイトル",
      "right_items": ["項目1", "項目2"]
    }},
    {{
      "type": "image-text",
      "title": "画像付きスライド",
      "text": "説明テキスト",
      "image_placeholder": "画像の説明"
    }},
    {{
      "type": "closing",
      "title": "まとめ",
      "bullets": ["要点1", "要点2"],
      "closing_message": "ご清聴ありがとうございました"
    }}
  ]
}}

スライドの種類は上記の5タイプ（title, content, two-column, image-text, closing）から適切に選んでください。
内容に合わせて、各スライドに適切なテキストを生成してください。
すべてのテキストは日本語で書いてください。"""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

        response_text = response.text.strip()
        # コードブロックの除去
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

        slides_data = json.loads(response_text)
        slides_data["template"] = template_styles

        return jsonify(slides_data)

    except json.JSONDecodeError:
        return jsonify({"error": "AIの応答を解析できませんでした。もう一度お試しください。"}), 500
    except Exception as e:
        return jsonify({"error": f"エラーが発生しました: {str(e)}"}), 500


def get_template_styles(template_id):
    """テンプレートのスタイル情報を返す"""
    templates = {
        "business-blue": {
            "id": "business-blue",
            "name": "ビジネスブルー",
            "primary": "#1a73e8",
            "secondary": "#4285f4",
            "accent": "#fbbc04",
            "bg": "#ffffff",
            "text": "#202124",
            "light_bg": "#e8f0fe",
            "font": "'Noto Sans JP', sans-serif",
        },
        "modern-dark": {
            "id": "modern-dark",
            "name": "モダンダーク",
            "primary": "#bb86fc",
            "secondary": "#03dac6",
            "accent": "#cf6679",
            "bg": "#121212",
            "text": "#e1e1e1",
            "light_bg": "#1e1e1e",
            "font": "'Noto Sans JP', sans-serif",
        },
        "nature-green": {
            "id": "nature-green",
            "name": "ナチュラルグリーン",
            "primary": "#2e7d32",
            "secondary": "#66bb6a",
            "accent": "#ff8f00",
            "bg": "#fafafa",
            "text": "#212121",
            "light_bg": "#e8f5e9",
            "font": "'Noto Sans JP', sans-serif",
        },
        "elegant-red": {
            "id": "elegant-red",
            "name": "エレガントレッド",
            "primary": "#c62828",
            "secondary": "#ef5350",
            "accent": "#ffd600",
            "bg": "#ffffff",
            "text": "#212121",
            "light_bg": "#ffebee",
            "font": "'Noto Sans JP', sans-serif",
        },
        "minimal-gray": {
            "id": "minimal-gray",
            "name": "ミニマルグレー",
            "primary": "#424242",
            "secondary": "#757575",
            "accent": "#ff6f00",
            "bg": "#fafafa",
            "text": "#212121",
            "light_bg": "#f5f5f5",
            "font": "'Noto Sans JP', sans-serif",
        },
    }
    return templates.get(template_id, templates["business-blue"])


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
