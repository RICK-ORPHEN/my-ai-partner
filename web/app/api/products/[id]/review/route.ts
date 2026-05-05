import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { aiCompleteJSON } from '@/lib/keyless';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', _req.url));

  const { data: p } = await supabase.from('student_products').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!p) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let score = 0; let md = '';
  try {
    const r = await aiCompleteJSON(
      `あなたは公開Webプロダクトのレビュアーです。完成度・UX・公開しても恥ずかしくないか・収益化見込みを100点満点で評価しJSONで返してください。スキーマ: { "score": number, "feedback_md": string }`,
      `タイトル: ${p.title}\n概要: ${p.description ?? ''}\n公開URL: ${p.public_url ?? '未公開'}\n技術: ${(p.tech_stack ?? []).join(', ')}`
    );
    score = Math.max(0, Math.min(100, parseInt((r.score ?? 0).toString())));
    md = r.feedback_md ?? '';
  } catch {
    score = 60;
    md = 'Keyless AI が未接続のため簡易レビュー。.envにKEYLESS_*を設定すると本格レビューが動きます。';
  }

  const admin = createAdminClient();
  await admin.from('student_products').update({ ai_review_score: score, ai_review_md: md }).eq('id', id);

  return NextResponse.redirect(new URL(`/dashboard/products/${id}`, _req.url));
}
