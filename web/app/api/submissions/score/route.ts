import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { aiCompleteJSON } from '@/lib/keyless';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { lesson_id, content_text } = await req.json();
  if (!lesson_id || !content_text) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const { data: lesson } = await supabase.from('lessons').select('*, courses:course_id(title)').eq('id', lesson_id).single();
  if (!lesson) return NextResponse.json({ error: 'lesson_not_found' }, { status: 404 });

  // Insert submission
  const { data: submission, error: subErr } = await supabase.from('submissions').insert({
    user_id: user.id, lesson_id, content_text, status: 'submitted', submitted_at: new Date().toISOString()
  }).select().single();
  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  // AI score via Keyless AI (fallback: simple heuristic if Keyless not set)
  let result: { score: number; feedback_md: string; improvements: string[] } = { score: 0, feedback_md: '', improvements: [] };
  try {
    const r = await aiCompleteJSON(
      `あなたは「${lesson.courses?.title} - ${lesson.title}」の採点者です。受講生の成果物を100点満点で評価し、JSON で返してください。
       スキーマ: { "score": number(0-100), "feedback_md": string(マークダウン形式の総評), "improvements": string[] (具体改善点3〜5点) }`,
      `成果物:\n${content_text}\n\n採点基準:\n- 課題の意図にどれだけ応えているか\n- 具体性\n- 業務で使える完成度\n- 文章/コードの整理`
    );
    result = {
      score: Math.max(0, Math.min(100, parseInt((r.score ?? 0).toString()))),
      feedback_md: r.feedback_md ?? '',
      improvements: Array.isArray(r.improvements) ? r.improvements : []
    };
  } catch (e: any) {
    // Fallback heuristic if Keyless unavailable
    const len = content_text.length;
    result = {
      score: Math.min(80, 30 + Math.floor(len / 20)),
      feedback_md: `Keyless AI に接続できなかったため、長さベースの暫定スコアです。詳細採点は管理画面のAI再採点でやり直せます。`,
      improvements: ['AI採点用のKeyless AIキーを.envに設定してください']
    };
  }

  // Persist score using admin client to bypass RLS for write
  const admin = createAdminClient();
  await admin.from('ai_scores').insert({
    submission_id: submission.id,
    score: result.score,
    feedback_md: result.feedback_md,
    improvements: result.improvements
  });

  // Mark progress complete if score >= 60
  if (result.score >= 60) {
    await admin.from('lesson_progress').upsert({
      user_id: user.id, lesson_id, status: 'completed', completed_at: new Date().toISOString()
    });
    // bump enrollment current_step
    const { data: lessonData } = await admin.from('lessons').select('course_id, step').eq('id', lesson_id).single();
    if (lessonData) {
      await admin.from('enrollments').upsert({
        user_id: user.id, course_id: lessonData.course_id,
        current_step: lessonData.step + 1
      }, { onConflict: 'user_id,course_id' });
    }
  }
  return NextResponse.json(result);
}
