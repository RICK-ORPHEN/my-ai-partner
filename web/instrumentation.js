export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { applyTlsTrustPolicy } = await import('./lib/security/tls-trust-policy.mjs');
    console.info('[security-ca-trust]', JSON.stringify({ node: process.version, ...applyTlsTrustPolicy() }));
  }
}
