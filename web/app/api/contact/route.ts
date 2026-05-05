import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const name = (fd.get('name') ?? '').toString();
  const email = (fd.get('email') ?? '').toString();
  const message = (fd.get('message') ?? '').toString();
  if (!email || !message) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  // Persist as admin_logs entry (no separate table needed for contact in this MVP)
  const admin = createAdminClient();
  await admin.from('admin_logs').insert({
    action: 'contact_form',
    target_table: 'contact',
    target_id: email,
    diff: { name, email, message }
  });
  return NextResponse.json({ ok: true });
}
