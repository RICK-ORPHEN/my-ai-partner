-- =========================================
-- AI School v3 — Seed Data
-- =========================================
-- Insert all 8 industries × 7 lessons (56) + 4 cross-skill courses × 7 (28)
-- Idempotent (on conflict do nothing).

-- Courses ---------------------------------
insert into courses (id, kind, title, subtitle, sort_order) values
('restaurant',   'industry', '飲食×AI', '来店予測・SNS集客・予約自動化を学ぶ', 1),
('retail',       'industry', '小売×AI', '商品レコメンド・在庫予測・EC運用', 2),
('realestate',   'industry', '不動産×AI', '物件紹介・内見予約・CRM自作', 3),
('medical',      'industry', '医療×AI', '問診支援・予約自動化・情報配慮', 4),
('legal',        'industry', '士業×AI', '法令要約・契約書比較・面談記録', 5),
('construction', 'industry', '建設・製造×AI', '現場記録・工程管理・案件進捗', 6),
('beauty',       'industry', '美容×AI', '予約bot・SNS戦略・顧客カルテ', 7),
('education',    'industry', '教育×AI', '教材生成・成績分析・講座LP', 8),
('skills_dev',     'cross_skill', 'スキル開発コース',  'Claude Skillsを作って業務に組み込む', 10),
('lp_design',      'cross_skill', 'LP制作コース',      'コピー × デザイン × 公開 まで', 11),
('proposal_design','cross_skill', '企画書・提案書コース','PPTX/PDFで配布できる提案書を量産', 12),
('automation_chat','cross_skill', '自動オペレーション チャットツール','Slack/Telegram/LINE bot で業務自動化', 13)
on conflict (id) do nothing;

-- Lessons (industry × 7) ----------------
-- 共通の7段テンプレ
do $$
declare
  industries text[] := array['restaurant','retail','realestate','medical','legal','construction','beauty','education'];
  industry_titles text[] := array['飲食','小売','不動産','医療','士業','建設・製造','美容','教育'];
  step_titles text[] := array[
    'AI活用入門',
    'プロンプト基礎',
    'データ整理・自動化',
    '顧客対応自動化',
    'コンテンツ生成',
    '業務システム制作',
    '公開・運用'
  ];
  step_summaries text[] := array[
    '業種特有のユースケースと、AIで何が変わるかを見渡す',
    'プロンプトの基本構造とコツ。具体タスクで実践',
    'スプレッドシート × AI で日常業務を自動化',
    'チャットボットで予約・問い合わせを24時間化',
    'LP・SNS・メールをAIで生成する型を学ぶ',
    '自分の業務を解くサービスを実装する（Track分岐）',
    'Vercel/Supabase または Squarespace で公開し運用に入る'
  ];
  i int; s int;
  ind text; ind_title text;
  step_title text; step_summary text;
  publish_track text; affiliate text;
begin
  for i in 1..array_length(industries,1) loop
    ind := industries[i]; ind_title := industry_titles[i];
    for s in 1..7 loop
      step_title := step_titles[s];
      step_summary := step_summaries[s];
      publish_track := null; affiliate := null;
      if s = 6 then publish_track := 'track_a'; affiliate := 'supabase'; end if;
      if s = 7 then publish_track := 'track_a'; affiliate := 'vercel'; end if;
      insert into lessons (id, course_id, step, title, summary, duration_min, publishing_track, affiliate_link_target, body)
      values (
        ind || '_' || lpad(s::text, 2, '0'),
        ind, s,
        ind_title || ' — ' || step_title,
        step_summary,
        20 + (s*2),
        publish_track, affiliate,
        jsonb_build_object(
          'intro', step_summary,
          'objectives', jsonb_build_array(
            'このレッスンを終えると' || step_title || 'を実務でできる',
            ind_title || '業界の典型例で具体的に学ぶ',
            '成果物を提出してAI採点を受ける'
          ),
          'chat_script', jsonb_build_array(
            jsonb_build_object('role','assistant','msg','こんにちは！' || ind_title || ' × ' || step_title || ' のレッスンへようこそ。'),
            jsonb_build_object('role','assistant','msg','今日の目的は「' || step_summary || '」です。準備はいいですか？'),
            jsonb_build_object('role','prompt_user','msg','「はい」と返信してください'),
            jsonb_build_object('role','assistant','msg','では実際にやってみましょう。下の入力欄に、あなたのお店/会社の名前を入れてください'),
            jsonb_build_object('role','prompt_user','msg','店舗・会社名を入力'),
            jsonb_build_object('role','assistant','msg','素晴らしい！次に、あなたが今困っていることを1つ教えてください'),
            jsonb_build_object('role','prompt_user','msg','課題を1つ入力'),
            jsonb_build_object('role','assistant','msg','OK、それを' || step_title || 'で解いていきます。'),
            jsonb_build_object('role','task','msg','以下の手順を実施 → 成果物を貼り付けて提出')
          ),
          'deliverable', step_title || ' の成果物を提出する'
        )
      ) on conflict (id) do nothing;
    end loop;
  end loop;
end $$;

-- Lessons (cross-skill × 7) ----------------
do $$
declare
  courses text[] := array['skills_dev','lp_design','proposal_design','automation_chat'];
  titles text[][] := array[
    array[
      'Skillsとは何か',
      'SKILL.md構造',
      '守備範囲を決める',
      'プロンプト＋テンプレ設計',
      'references/ サブファイル',
      'テスト・評価',
      'プラグイン化＋公開'
    ],
    array[
      'LP=コンバージョン装置',
      'ヒーロー設計',
      'デザインシステム適用',
      'コピーライティング × AI',
      'ヒーロー画像生成',
      'レスポンシブ調整',
      '公開 × 計測'
    ],
    array[
      '企画書の役割と構造',
      'オーディエンス分析',
      '構成テンプレ',
      'AIで一次ドラフト',
      '図解（mermaid/フロー）',
      '数値根拠（市場・ROI）',
      '配布形式（PPTX/PDF/HTML）'
    ],
    array[
      'なぜチャットツールが効くか',
      'プラットフォーム比較',
      'ボット骨格（Webhook）',
      'AI連携（Keyless AI）',
      '業務テンプレ実装',
      'DB連携（Supabase）',
      '運用＆監視'
    ]
  ];
  c int; s int;
begin
  for c in 1..4 loop
    for s in 1..7 loop
      insert into lessons (id, course_id, step, title, summary, duration_min, body)
      values (
        courses[c] || '_' || lpad(s::text, 2, '0'),
        courses[c], s,
        titles[c][s],
        titles[c][s] || ' を実例で学ぶ',
        25,
        jsonb_build_object(
          'intro', titles[c][s] || ' を取り扱います',
          'objectives', jsonb_build_array(
            titles[c][s] || ' の本質を理解する',
            '実例として自分のドメインで一つ完成させる',
            'AI採点で改善点を受け取る'
          ),
          'chat_script', jsonb_build_array(
            jsonb_build_object('role','assistant','msg','このレッスンでは「' || titles[c][s] || '」をやります。'),
            jsonb_build_object('role','prompt_user','msg','準備OKなら「はい」'),
            jsonb_build_object('role','task','msg','成果物を作成して提出')
          ),
          'deliverable', titles[c][s] || ' の成果物'
        )
      ) on conflict (id) do nothing;
    end loop;
  end loop;
end $$;

