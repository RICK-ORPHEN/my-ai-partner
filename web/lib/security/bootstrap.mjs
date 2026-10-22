import { applyTlsTrustPolicy } from './tls-trust-policy.mjs';
console.info('[security-ca-trust]', JSON.stringify({ node: process.version, ...applyTlsTrustPolicy() }));
