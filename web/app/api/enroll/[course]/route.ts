import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export const runtime = 'nodejs';
export async function POST(req: NextRequest, { params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  await supabase.from('enrollments').upsert({ user_id: user.id, course_id: course });
  // Find first lesson and redirect there
  const { data: l } = await supabase.from('lessons').select('id').eq('course_id', course).order('step').limit(1).single();
  if (l) return NextResponse.redirect(new URL(`/lesson/${l.id}`, req.url));
  return NextResponse.redirect(new URL(`/courses/${course}`, req.url));
}
