// Server-side helper for calling external APIs through Keyless AI.
// Login is performed once per server boot; bootstrap is cached.

let cachedToken: { access_token: string; expires_at: number } | null = null;
let cachedSession: { session_id: string; aliases: string[]; expires_at: number } | null = null;

const BASE = 'https://app.keyless-ai.com';

async function login(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) return cachedToken.access_token;
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: process.env.KEYLESS_EMAIL,
      password: process.env.KEYLESS_PASSWORD
    })
  });
  if (!res.ok) throw new Error(`Keyless login failed: ${res.status}`);
  const j = await res.json();
  cachedToken = { access_token: j.access_token, expires_at: Date.now() + 50 * 60 * 1000 };
  return j.access_token;
}

async function bootstrap(): Promise<{ session_id: string; aliases: string[] }> {
  if (cachedSession && Date.now() < cachedSession.expires_at) {
    return { session_id: cachedSession.session_id, aliases: cachedSession.aliases };
  }
  const token = await login();
  const res = await fetch(`${BASE}/api/sessions/bootstrap`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      project_id: process.env.KEYLESS_PROJECT_ID,
      environment: 'prod'
    })
  });
  if (!res.ok) throw new Error(`Keyless bootstrap failed: ${res.status}`);
  const j = await res.json();
  cachedSession = {
    session_id: j.session_id,
    aliases: j.available_aliases ?? [],
    expires_at: Date.now() + 25 * 60 * 1000
  };
  return { session_id: j.session_id, aliases: cachedSession.aliases };
}

export async function callKeyless(alias: string, method: string, body: any) {
  const { session_id } = await bootstrap();
  const res = await fetch(`${BASE}/api/mcp`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session_id}`
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { alias, method, body },
      id: Date.now()
    })
  });
  const j = await res.json();
  if (j.error) throw new Error(`Keyless ${alias} ${method}: ${JSON.stringify(j.error)}`);
  return j.result;
}

export async function aiCompleteJSON(systemPrompt: string, userPrompt: string): Promise<any> {
  const result = await callKeyless('global.openai.main', 'chat/completions', {
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });
  const text = result?.choices?.[0]?.message?.content ?? '{}';
  try { return JSON.parse(text); } catch { return { raw: text }; }
}
