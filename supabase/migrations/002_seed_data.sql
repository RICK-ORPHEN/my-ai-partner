-- AI School Platform - Seed Data
-- Initial data for industries, goals, courses, lessons, skills, and badges

-- ============================================================================
-- INDUSTRIES (8 industries)
-- ============================================================================

INSERT INTO industries (name, slug, emoji, description) VALUES
('飲食業', 'food-beverage', '🍽️', 'レストラン、カフェ、食品製造などの飲食ビジネス向けAI活用'),
('小売業', 'retail', '🛍️', 'アパレル、百貨店、オンラインストアなどの小売業向けAI活用'),
('不動産業', 'real-estate', '🏢', '不動産仲介、物件管理、建築業向けAI活用'),
('医療・クリニック', 'healthcare', '⚕️', '医療機関、診療所、医療コンサルティング向けAI活用'),
('士業', 'professional-services', '⚖️', '弁護士、税理士、会計士などの専門家向けAI活用'),
('建設・製造業', 'construction-manufacturing', '🏗️', '建設、製造、生産管理向けAI活用'),
('美容・サロン', 'beauty-salon', '💇', '美容室、ネイルサロン、エステ向けAI活用'),
('教育・塾', 'education', '📚', '学習塾、オンライン教育、教育機関向けAI活用')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- INDUSTRY GOALS (5 goals per industry = 40 goals total)
-- ============================================================================

INSERT INTO industry_goals (industry_id, title, description, sort_order)
SELECT id, title, description, sort_order FROM (
  VALUES
  -- 飲食業
  ((SELECT id FROM industries WHERE slug = 'food-beverage'), 'メニュー開発の自動化', 'AIを使って季節メニューや新作メニューを効率的に開発', 1),
  ((SELECT id FROM industries WHERE slug = 'food-beverage'), '顧客データ分析', 'POS連携で顧客の嗜好分析と来店予測を実施', 2),
  ((SELECT id FROM industries WHERE slug = 'food-beverage'), '厨房業務の最適化', 'AIで食材発注量と廃棄量を最小化', 3),
  ((SELECT id FROM industries WHERE slug = 'food-beverage'), '予約システムの機械学習化', 'AIが混雑予測と最適配席を提案', 4),
  ((SELECT id FROM industries WHERE slug = 'food-beverage'), 'SNSマーケティング自動化', 'AIが顧客層別にメニュー紹介を自動生成・配信', 5),

  -- 小売業
  ((SELECT id FROM industries WHERE slug = 'retail'), '商品レコメンド最適化', '購買履歴からAIが最適な商品を提案', 1),
  ((SELECT id FROM industries WHERE slug = 'retail'), '在庫予測・管理', 'AIが季節や流行から最適な在庫量を自動計算', 2),
  ((SELECT id FROM industries WHERE slug = 'retail'), '顧客セグメンテーション', 'AIが購買パターンから顧客層を分類・ターゲティング', 3),
  ((SELECT id FROM industries WHERE slug = 'retail'), '価格最適化', 'AIが需要と競合を分析して価格提案', 4),
  ((SELECT id FROM industries WHERE slug = 'retail'), 'チャットボット導入', '24時間顧客対応のAIチャットボットを構築', 5),

  -- 不動産業
  ((SELECT id FROM industries WHERE slug = 'real-estate'), '物件情報自動作成', 'AIが物件写真からリスティングを自動生成', 1),
  ((SELECT id FROM industries WHERE slug = 'real-estate'), '顧客適合度スコアリング', 'AIが物件と顧客マッチスコアを自動算出', 2),
  ((SELECT id FROM industries WHERE slug = 'real-estate'), '価格査定の自動化', 'AIが周辺相場から物件価格を提案', 3),
  ((SELECT id FROM industries WHERE slug = 'real-estate'), 'リード育成の自動化', 'AIが見込み客に最適なフォローアップを自動実施', 4),
  ((SELECT id FROM industries WHERE slug = 'real-estate'), 'VRツアー動画生成', 'AIが物件画像からVR/3D情報を自動生成', 5),

  -- 医療・クリニック
  ((SELECT id FROM industries WHERE slug = 'healthcare'), '患者受付の自動化', 'AIが予約管理と初診問診を自動処理', 1),
  ((SELECT id FROM industries WHERE slug = 'healthcare'), '診療記録のテキスト化', '音声から医師の診療記録を自動生成', 2),
  ((SELECT id FROM industries WHERE slug = 'healthcare'), '画像診断の補助', 'AIが医療画像を初期スクリーニング', 3),
  ((SELECT id FROM industries WHERE slug = 'healthcare'), '患者教育資料自動生成', 'AIが診断結果から患者向け説明資料を作成', 4),
  ((SELECT id FROM industries WHERE slug = 'healthcare'), '医療文書作成の効率化', 'AIが診療録から保険請求書類を自動生成', 5),

  -- 士業
  ((SELECT id FROM industries WHERE slug = 'professional-services'), '契約書自動作成', 'AIテンプレートから案件別に契約書を生成', 1),
  ((SELECT id FROM industries WHERE slug = 'professional-services'), '法令データベース検索', '法律・税務情報をAI検索で高速に取得', 2),
  ((SELECT id FROM industries WHERE slug = 'professional-services'), '顧問料設定の自動化', 'AIが企業規模から最適な顧問料を提案', 3),
  ((SELECT id FROM industries WHERE slug = 'professional-services'), '各種申請書類の自動作成', 'AI補助で設立登記申請等の書類を効率化', 4),
  ((SELECT id FROM industries WHERE slug = 'professional-services'), 'クライアント向けレポート自動作成', 'AIが決算書から経営分析レポートを自動生成', 5),

  -- 建設・製造業
  ((SELECT id FROM industries WHERE slug = 'construction-manufacturing'), '工程管理の最適化', 'AIが工事工程を分析し最適スケジュール提案', 1),
  ((SELECT id FROM industries WHERE slug = 'construction-manufacturing'), '安全管理の向上', 'AIが現場画像から危険を検知・警告', 2),
  ((SELECT id FROM industries WHERE slug = 'construction-manufacturing'), '資材発注の自動化', 'AIが工程から必要な資材を予測・発注', 3),
  ((SELECT id FROM industries WHERE slug = 'construction-manufacturing'), '品質検査の自動化', 'AIが製品画像から品質不良を自動判定', 4),
  ((SELECT id FROM industries WHERE slug = 'construction-manufacturing'), '技能伝承の効率化', 'AI動画を使った職人技の学習システム構築', 5),

  -- 美容・サロン
  ((SELECT id FROM industries WHERE slug = 'beauty-salon'), '来客予測と指名割当最適化', 'AIが来店パターンから最適スタッフ配置を提案', 1),
  ((SELECT id FROM industries WHERE slug = 'beauty-salon'), 'カウンセリングの自動化', 'AIが顧客顔型から最適スタイル提案', 2),
  ((SELECT id FROM industries WHERE slug = 'beauty-salon'), 'SNSコンテンツ自動生成', 'AIがメニューから魅力的なビジュアル制作', 3),
  ((SELECT id FROM industries WHERE slug = 'beauty-salon'), 'リテンション施策の自動化', 'AIが顧客の来店間隔から再来店キャンペーン自動配信', 4),
  ((SELECT id FROM industries WHERE slug = 'beauty-salon'), 'レセプト管理の自動化', 'AIが施術内容から請求書と売上管理を自動作成', 5),

  -- 教育・塾
  ((SELECT id FROM industries WHERE slug = 'education'), '生徒の学習進度分析', 'AIが解答パターンから苦手分野を自動検知', 1),
  ((SELECT id FROM industries WHERE slug = 'education'), 'カスタマイズ教材自動生成', 'AIが生徒レベル別に最適な問題をリアルタイム作成', 2),
  ((SELECT id FROM industries WHERE slug = 'education'), '親への進捗報告の自動化', 'AIが学習データから保護者向けレポート自動作成', 3),
  ((SELECT id FROM industries WHERE slug = 'education'), 'オンライン授業の大規模化', 'AIが生徒提出課題をリアルタイム採点・フィードバック', 4),
  ((SELECT id FROM industries WHERE slug = 'education'), '受験対策の個別最適化', 'AIが過去問と実力から志望校別カリキュラム提案', 5)
) AS data(industry_id, title, description, sort_order);

-- ============================================================================
-- COURSES (10 core courses)
-- ============================================================================

INSERT INTO courses (title, description, category, level, published) VALUES
('プロンプトエンジニアリング基礎', 'AIに効果的に指示を与えるプロンプト設計の基本を学ぶ', 'core', 1, true),
('AI API統合の基礎', 'OpenAI、Claude、Gemini等のAPIを活用してアプリケーションを構築', 'core', 1, true),
('業種別AI活用戦略', '業種ごとのAI導入ロードマップと実装パターンを学ぶ', 'core', 1, true),
('Cowork開発基礎', 'Coworkプラットフォームを使った自動化ワークフロー構築', 'core', 2, true),
('データ分析とAI予測', 'AIで顧客データを分析し意思決定に活用する方法', 'core', 2, true),
('AIチャットボット開発', '顧客対応用チャットボットの設計・構築・運用', 'core', 2, true),
('画像生成AIの活用', 'DALL-E、Midjourney等を活用したビジュアルコンテンツ制作', 'advanced', 3, true),
('AIエージェント設計', 'タスク自動実行型AIエージェントの設計と実装', 'advanced', 3, true),
('AIシステムの運用と最適化', '本番運用でのモニタリング、フィードバックループの構築', 'advanced', 3, true),
('業種特化型AI構想ワークショップ', '社内で実装するAIビジネスモデルの設計と戦略立案', 'strategy', 3, true)
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- LESSONS (7 lessons per course = 70 lessons total)
-- ============================================================================

INSERT INTO lessons (course_id, title, description, order_index, duration_minutes)
SELECT course_id, title, description, order_index, duration_minutes FROM (
  -- Course 1: Prompt Engineering Basics (7 lessons)
  VALUES
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'プロンプトとは何か', 'AIプロンプトの基本概念と重要性を理解', 1, 15),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'プロンプト構造の設計', 'タスク、コンテキスト、期待値を含めた構造設計', 2, 20),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'Few-shotプロンプティング', '例を示すことで精度を上げるテクニック', 3, 20),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'チェーン・オブ・ソート', 'ステップバイステップの思考をAIに促す方法', 4, 25),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), '実践ワークショップ: ビジネス提案書生成', '実際に業種別の提案書をプロンプトで生成', 5, 30),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'プロンプトライブラリの構築', '再利用可能なプロンプトテンプレートの管理', 6, 20),
  ((SELECT id FROM courses WHERE title = 'プロンプトエンジニアリング基礎'), 'チェックポイント: プロンプト最適化', 'プロンプトの品質評価と改善ポイント', 7, 15),

  -- Course 2: AI API Integration (7 lessons)
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'API基礎とREST', 'Web APIの基本概念とRESTful設計', 1, 25),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'OpenAI APIの使い方', 'ChatGPT APIの認証、リクエスト、レスポンス処理', 2, 30),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'Claude APIの統合', 'AnthropicのClaudeAPIの接続と活用', 3, 25),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'エラーハンドリングとレート制限', 'API呼び出しのエラー処理とスケーラビリティ', 4, 20),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), '実装ワークショップ: シンプルなチャットボット', 'Python/JavaScriptでAIチャットボットを構築', 5, 40),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'APIコスト管理と最適化', 'トークンコストの計算と効率化戦略', 6, 15),
  ((SELECT id FROM courses WHERE title = 'AI API統合の基礎'), 'チェックポイント: APIプロジェクト完成', 'APIを活用した実践的なアプリケーション構築', 7, 30),

  -- Course 3: Industry-specific AI Strategy (7 lessons)
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), '業種別の課題分析フレームワーク', 'あなたの業種の課題をAIで解決する視点', 1, 25),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), '飲食業のAI活用事例', 'メニュー開発から顧客分析まで', 2, 20),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), '小売業・ECのAI活用事例', 'レコメンド、在庫管理、価格最適化', 3, 20),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), '不動産業・医療・士業のAI活用事例', '専門業種のAI導入パターン', 4, 25),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), 'ROI計算とビジネスケース作成', 'AI投資の効果測定と経営層への説得', 5, 20),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), '実装ロードマップの作成', '3ヶ月～12ヶ月の導入計画を立案', 6, 25),
  ((SELECT id FROM courses WHERE title = '業種別AI活用戦略'), 'チェックポイント: あなたの業種AI戦略', '自社向けのAI導入計画書を作成', 7, 30),

  -- Course 4: Cowork Development Basics (7 lessons)
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'Coworkプラットフォームの概要', 'Coworkの機能と活用可能性', 1, 15),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'ワークフロー設計の基礎', 'Input → Process → Output の流れを理解', 2, 25),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'ノーコード自動化の実装', 'Coworkで簡単な業務フローを自動化', 3, 30),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'Cowork × AI連携', 'CoworkからAI APIを呼び出すワークフロー', 4, 25),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), '実装ワークショップ: メール自動化', 'コンテキストに応じたメール生成・送信の自動化', 5, 35),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'テストと運用管理', 'ワークフローのテストと監視、ログ分析', 6, 20),
  ((SELECT id FROM courses WHERE title = 'Cowork開発基礎'), 'チェックポイント: あなただけの自動化ワークフロー', '業務改善ワークフローを構築・納入', 7, 40),

  -- Course 5: Data Analysis and AI Prediction (7 lessons)
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), 'ビジネスデータの種類と構造', 'CRMデータ、売上データ、顧客行動データの理解', 1, 20),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), 'Excelとデータベースの活用', 'SQLでのデータ抽出とExcel分析の基本', 2, 25),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), 'AIを使った予測分析', '回帰分析、分類、クラスタリングの概念と活用', 3, 30),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), '顧客データの分析と予測', 'チャーン予測、LTV計算、セグメンテーション', 4, 25),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), '実装ワークショップ: 顧客予測モデル構築', 'Pythonで簡単な予測モデルを構築', 5, 40),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), 'ダッシュボードと可視化', 'BigQueryやTableauでの分析結果の可視化', 6, 25),
  ((SELECT id FROM courses WHERE title = 'データ分析とAI予測'), 'チェックポイント: データドリブン意思決定', 'データから洞察を導き出し経営判断に活用', 7, 30),

  -- Course 6: AI Chatbot Development (7 lessons)
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), 'チャットボット基礎と設計パターン', 'ルールベース型 vs 学習型チャットボット', 1, 20),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), 'カスタマーサポートボット設計', 'よくある質問、エスカレーション、FAQの自動対応', 2, 25),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), 'LINE・Slack・Web チャットボットの実装', '各プラットフォーム別の実装方法', 3, 30),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), ' 会話文脈の管理とメモリー', 'ユーザー情報の保存と過去の会話への対応', 4, 25),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), '実装ワークショップ: LINEチャットボット構築', 'LINE Official Account APIを使ったボット構築', 5, 40),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), 'チャットボットの分析と改善', 'ユーザー満足度測定と継続的改善', 6, 20),
  ((SELECT id FROM courses WHERE title = 'AIチャットボット開発'), 'チェックポイント: 運用可能なチャットボット', 'サポート業務を自動化する本番チャットボット構築', 7, 30),

  -- Course 7: Image Generation AI (7 lessons)
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), '画像生成AIの種類と特性', 'DALL-E、Midjourney、Stable Diffusion の違い', 1, 20),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), '効果的なプロンプト設計（画像版）', 'スタイル、構図、配色を指定するテクニック', 2, 25),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), 'マーケティング素材の自動生成', 'SNS投稿、バナー、チラシの自動制作', 3, 25),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), '商品画像とeコマース活用', 'モックアップ、背景削除、360度ビュー生成', 4, 25),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), '実装ワークショップ: ブランドガイドラインの確立', 'AI画像生成時のスタイルガイド作成と運用', 5, 30),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), '動画フレーム生成とアニメーション', 'AIで動画フレームを生成し編集する方法', 6, 25),
  ((SELECT id FROM courses WHERE title = '画像生成AIの活用'), 'チェックポイント: ビジュアルコンテンツの自動化', 'マーケティング全体のビジュアル制作を自動化', 7, 30),

  -- Course 8: AI Agent Design (7 lessons)
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'AIエージェントの基本原理', 'Goal → Plan → Execute → Observe のループ', 1, 25),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'タスク分解とプランニング', '複雑なタスクを段階的に自動実行', 2, 25),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'ツール統合と外部API連携', 'エージェントにツール群（Web、DB、API）を提供', 3, 30),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'メモリシステムと学習', 'エージェント内の知識蓄積と継続的改善', 4, 25),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), '実装ワークショップ: リード獲得エージェント', 'Webスクレイピング→分析→連絡を自動実行するエージェント', 5, 45),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'エージェントの安全性と制御', 'リスク管理、権限制御、監視とロールバック', 6, 25),
  ((SELECT id FROM courses WHERE title = 'AIエージェント設計'), 'チェックポイント: 多機能エージェント構築', '複数の業務を自動実行する実践的エージェント構築', 7, 40),

  -- Course 9: AI Systems Operation and Optimization (7 lessons)
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'プロダクション環境へのデプロイ', 'ローカルから本番環境へのAIシステム展開', 1, 25),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'モニタリングとロギング', 'エラー検知、パフォーマンス監視、ユーザー行動追跡', 2, 25),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'フィードバックループの構築', 'ユーザー反応とモデルの継続的改善', 3, 25),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'コスト最適化とスケーリング', 'APIコスト削減、キャッシング、バッチ処理の活用', 4, 25),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), '実装ワークショップ: 本番運用システムの構築', 'CloudRunやLambdaでAIシステムを24/7運用', 5, 40),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'セキュリティとコンプライアンス', 'データ保護、監査ログ、規制遵守', 6, 25),
  ((SELECT id FROM courses WHERE title = 'AIシステムの運用と最適化'), 'チェックポイント: 自動化された運用体制', '自社システムの24/7自動運用を実現', 7, 35),

  -- Course 10: Industry-specific AI Construction Workshop (7 lessons)
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), '現状分析ワークショップ', '自社の課題と機会を整理し優先順位付け', 1, 45),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), 'AI活用シナリオの策定', '短期（3ヶ月）、中期（1年）、長期（3年）計画', 2, 50),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), 'ROI計算と投資判断', 'AI導入効果の定量化と経営層への説得資料作成', 3, 40),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), '実装体制づくり', 'チーム構成、予算配分、タイムライン設定', 4, 40),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), 'リスク管理とステークホルダー対応', ' 失敗事例から学び、社内反対意見への対応', 5, 40),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), 'パイロットプロジェクトの実装', 'MVP構築から成功事例化までの流れ', 6, 50),
  ((SELECT id FROM courses WHERE title = '業種特化型AI構想ワークショップ'), 'チェックポイント: AI経営構想書の完成', '社長に認可される実行可能なAI経営計画策定', 7, 60)
) AS data(course_id, title, description, order_index, duration_minutes);

-- ============================================================================
-- SKILLS (6 core skills)
-- ============================================================================

INSERT INTO skills (name, category, description) VALUES
('AIプロダクティビティ', 'productivity', '業務効率化・自動化系のAI活用スキル'),
('AI開発', 'development', 'API統合・プログラミングスキル'),
('AIクリエイティブ', 'creative', '画像生成・動画編集・コンテンツ制作スキル'),
('AIマーケティング', 'marketing', 'SEO・コンテンツマーケティング・広告最適化スキル'),
('AI自動化', 'automation', 'ワークフロー設計・ノーコード自動化スキル'),
('AIデータ分析', 'data', '顧客分析・予測モデル・BI活用スキル')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- BADGES (10 badges)
-- ============================================================================

INSERT INTO badges (name, description, icon, criteria) VALUES
('プロンプトエンジニアリング基礎', 'プロンプト設計の基本をマスターした', '🔤', '{"lesson_completed": "プロンプトエンジニアリング基礎"}'::jsonb),
('AI開発者', 'API統合とプログラミングに習熟', '💻', '{"lesson_completed": "AI API統合の基礎"}'::jsonb),
('業種別AI活用戦略家', '業種ごとのAI導入戦略を理解', '🎯', '{"lesson_completed": "業種別AI活用戦略"}'::jsonb),
('Cowork自動化マスター', 'Coworkでの自動化ワークフロー構築が得意', '⚙️', '{"lesson_completed": "Cowork開発基礎"}'::jsonb),
('データ分析家', 'ビジネスデータから洞察を導き出せる', '📊', '{"lesson_completed": "データ分析とAI予測"}'::jsonb),
('チャットボット開発者', 'AIチャットボット開発と運用に習熟', '🤖', '{"lesson_completed": "AIチャットボット開発"}'::jsonb),
('ビジュアルクリエイター', '画像生成AIを使いこなすスキル', '🎨', '{"lesson_completed": "画像生成AIの活用"}'::jsonb),
('AIエージェントエンジニア', '複雑なAIエージェント構築に習熟', '🦾', '{"lesson_completed": "AIエージェント設計"}'::jsonb),
('AI運用エンジニア', 'AIシステム本番運用に習熟', '🛠️', '{"lesson_completed": "AIシステムの運用と最適化"}'::jsonb),
('AIストラテジスト', '企業全体のAI戦略立案能力を持つ', '👑', '{"lesson_completed": "業種特化型AI構想ワークショップ"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SAMPLE COMPANIES (3 companies)
-- ============================================================================

INSERT INTO companies (company_name, industry, website, description) VALUES
('テックコンサルティング株式会社', '士業', 'https://tech-consulting.example.com', 'AI導入支援を行う経営コンサルタント'),
('フード・デジタル・ジャパン', '飲食業', 'https://food-digital.example.com', 'レストランチェーン向けAI導入支援'),
('リテール・テック・ソリューション', '小売業', 'https://retail-tech.example.com', 'ECサイト向けAI分析ツール提供')
ON CONFLICT (company_name) DO NOTHING;

-- ============================================================================
-- SAMPLE OPPORTUNITIES (5 opportunities)
-- ============================================================================

INSERT INTO opportunities (company_id, title, description, required_skills, required_industries, status) VALUES
((SELECT id FROM companies LIMIT 1), 'AI導入プロジェクト マネージャー', '中堅企業向けのAI導入プロジェクト全体をマネジメント', 'AI開発,業種別AI活用戦略', 'all', 'open'),
((SELECT id FROM companies LIMIT 1 OFFSET 1), 'メニュー開発AI設計者', 'レストランチェーンのメニュー開発AIシステムを構築', 'AI開発,AIデータ分析', '飲食業', 'open'),
((SELECT id FROM companies LIMIT 1 OFFSET 2), 'レコメンド機能開発', 'ECサイトの商品レコメンドAIを開発・運用', 'AI開発,AIデータ分析', '小売業', 'open'),
((SELECT id FROM companies LIMIT 1), '自動化ワークフロー設計', 'Coworkを使った企業業務の自動化フロー構築', 'AI自動化,Cowork開発基礎', 'all', 'open'),
((SELECT id FROM companies LIMIT 1 OFFSET 1), 'チャットボット導入プロジェクト', '顧客サポートAIチャットボット導入・運用', 'AIチャットボット開発,AIプロダクティビティ', '飲食業', 'open')
ON CONFLICT (company_id, title) DO NOTHING;
