import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as tls from 'node:tls';
import { applyTlsTrustPolicy, filterTrustedCertificates } from '../lib/security/tls-trust-policy.mjs';

const fixtures = fs.readFileSync(new URL('./fixtures/emudhra-roots.pem', import.meta.url), 'utf8')
  .match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
assert.equal(fixtures?.length, 4);
const original = tls.getCACertificates('default');
const safe = filterTrustedCertificates(original).certificates;
assert.ok(safe.length > 50);
const filtered = filterTrustedCertificates([...safe, ...fixtures]);
assert.equal(filtered.removed, 4);
assert.deepEqual(filtered.certificates, safe, 'unaffected and custom certificates must be preserved');
try {
  // Only this short-lived offline test process trusts the public fixtures.
  tls.setDefaultCACertificates([...safe, ...fixtures]);
  const result = applyTlsTrustPolicy();
  assert.equal(result.removed, 4);
  assert.equal(result.affectedRootsRemaining, 0);
  assert.equal(applyTlsTrustPolicy().removed, 0, 'repeated startup registration must be harmless');
} finally {
  tls.setDefaultCACertificates(original);
}
console.log('Certificate trust checks passed: affected roots rejected, other roots preserved, repeated setup safe.');
