import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aiCompleteJSON } from '@/lib/keyless';

export const runtime = 'nodejs';

const INDUSTRY_LABEL: Record<string, string> = {
  restaurant: '飲食',
  retail: '小売',
  realestate: '不動産',
  medical: '医療',
  legal: '士業',
  construction: '建設・製造',
  beauty: '美容',
  education: '教育',
};

type CoachReq = {
  lesson_id: string;
  history: { role: 'student' | 'coach'; content: string }[];
  stage?: 'kickoff' | 'continue';
};

type CoachResp = {
  coach_message: string;
  options?: string[];
  next_branch: 'awaiting_input' | 'ready_to_submit' | 'continue';
  hint?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await req.json()) as CoachReq;
  if (!body?.lesson_id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // 1) Profile context — never ask basic info we already know
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, industry, goal, coding_experience, learner_track')
    .eq('id', user.id)
    .single();

  // 2) Lesson body
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, course_id, step, body, courses:course_id(title)')
    .eq('id', body.lesson_id)
    .single();
  if (!lesson) return NextResponse.json({ error: 'lesson_not_found' }, { status: 404 });

  const lb = (lesson.body ?? {}) as Record<string, any>;
  const persona = {
    name: profile?.display_name ?? '受講生',
    industry: INDUSTRY_LABEL[profile?.industry ?? ''] ?? profile?.industry ?? '一般',
    goal: profile?.goal ?? '',
    coding_level:
      (profile?.coding_experience ?? 0) >= 3 ? '経験あり' : (profile?.coding_experience ?? 0) >= 1 ? '少しある' : '未経験',
    track: profile?.learner_track ?? 'a',
  };

  const sys = `あなたは「${(lesson.courses as { title?: string } | null)?.title ?? ''} - ${
    lesson.title
  }」を教える AI コーチです。\n\n受講生プロフィール（既に登録済み・絶対に同じ質問をしない）:\n- 名前: ${persona.name}\n- 業種: ${persona.industry}\n- 目標: ${
    persona.goal || '未設定'
  }\n- コーディング: ${persona.coding_level}\n- Track: ${persona.track === 'b' ? 'Squarespace（ノーコード）' : 'Vercel + Supabase（コード）'}\n\nレッスンの本質:\n${(lb.concept ?? '').slice(0, 500)}\n\nハンズオン手順:\n${(lb.hands_on?.steps ?? []).map((s: string, i: number) => `${i + 1}. ${(s as string).replace(/^手順\\d+[.:：]?\\s*/, '').replace(/^ステップ\\d+[.:：]?\\s*/, '')}`).join('\n')}\n\nゴール成果物:\n${typeof lb.deliverable === 'object' ? lb.deliverable?.what ?? '' : lb.deliverable ?? ''}\n\nルール:\n- 絵文字は絶対に使わない（サイトデザインに合わせる）\n- 同じ質問を二度しない。受講生の回答ごとに次のステップへ深く分岐\n- 「会社名は？」など登録済みの情報を再質問しない。プロフィールから推論\n- 短く、1ターンで2-4文。具体的な選択肢があれば最大3つ提示\n- 受講生が「分からない」「教えて」と言ったら、業種に合わせた具体例で先に見せてから質問\n- レッスンの目的（成果物作成）に向けて毎ターン1歩前進させる\n- ${persona.industry}業界の文脈で例える`;

  const userPrompt = `これまでの会話:\n${
    body.history.map((h) => `[${h.role === 'student' ? persona.name : 'コーチ'}]: ${h.content}`).join('\n') ||
    '（まだ会話なし。kickoff してください）'
  }\n\n上記をふまえ、次のコーチ発言を JSON で返してください。\nスキーマ: { "coach_message": string, "options": string[] | null, "next_branch": "awaiting_input" | "ready_to_submit" | "continue", "hint": string | null }\n- options は受講生が選びやすい3択を返す場合のみ（自由記述で良ければ null）\n- ready_to_submit は手を動かす段が終わって成果物を貼る準備ができたとき`;

  let resp: CoachResp;
  try {
    const j = await aiCompleteJSON(sys, userPrompt);
    resp = {
      coach_message: typeof j.coach_message === 'string' ? j.coach_message : '次のステップに進みましょう。',
      options: Array.isArray(j.options) ? j.options.slice(0, 3) : undefined,
      next_branch:
        j.next_branch === 'ready_to_submit' || j.next_branch === 'continue' ? j.next_branch : 'awaiting_input',
      hint: typeof j.hint === 'string' ? j.hint : undefined,
    };
  } catch (e) {
    // Static fallback that still uses the lesson content
    const coachTurns = body.history.filter((h) => h.role === 'coach').length;
    const stepCount = lb.hands_on?.steps?.length ?? 0;
    const stepIdx = Math.min(coachTurns, Math.max(stepCount - 1, 0));
    const rawStep = (lb.hands_on?.steps?.[stepIdx] ?? lb.next_action ?? '次のステップに進みましょう。') as string;
    const step = rawStep.replace(/^手順\d+[\.:]?\s*/, '').replace(/^ステップ\d+[\.:]?\s*/, '');
    const isLast = stepCount > 0 && stepIdx >= stepCount - 1;
    // Fallback options vary by step phase to give branching feel even without Keyless AI
    const options = isLast
      ? ['できた、提出に進む', 'まだ不安、もう少し例を見たい']
      : coachTurns === 0
      ? ['具体例を見せて', 'プロンプトの型を教えて', '進めてみる']
      : ['次へ進む', '別の業務で考えたい', 'AIに任せる範囲を相談したい'];
    resp = {
      coach_message: `${persona.industry}の現場で考えてみましょう。${step}`,
      options,
      next_branch: isLast ? 'ready_to_submit' : 'awaiting_input',
    };
  }

  return NextResponse.json(resp);
}
