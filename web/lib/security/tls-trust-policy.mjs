import * as tls from 'node:tls';
import { X509Certificate } from 'node:crypto';

// Public SHA-256 fingerprints of the roots identified by the eMudhra incident.
// Source: https://emudhra.we-have-a-problem.com/roots.json
const affectedRoots = new Set([
  '7DD78D5F4F13459A83DFF9ABBBA62EDBAF6F2D102BF257FD712F4D9F2746ED8D',
  'F2EDAAFF3D9B701FB4D14C9F285F8C0BAD90FC3BCC1FA07D47F4718EDABA34A5',
  'D7A7A0FB5D7E2731D771E9484EBCDEF71D5F0C3E0A2948782BC83EE0EA699EF4',
  '86A1ECBA089C4A8D3BBE2734C612BA341D813E043CF9E8A862CD5C57A36BBE6B',
]);

/** @param {readonly string[]} certificates */
export function filterTrustedCertificates(certificates) {
  const trusted = certificates.filter(certificate => !affectedRoots.has(
    new X509Certificate(certificate).fingerprint256.replaceAll(':', ''),
  ));
  return { certificates: trusted, removed: certificates.length - trusted.length };
}

/** Apply before request handlers can establish or cache outbound TLS sessions. */
export function applyTlsTrustPolicy() {
  if (typeof tls.getCACertificates !== 'function' || typeof tls.setDefaultCACertificates !== 'function') {
    throw new Error('The server runtime cannot enforce the certificate trust policy');
  }
  const before = tls.getCACertificates('default');
  const filtered = filterTrustedCertificates(before);
  if (filtered.certificates.length === 0) throw new Error('The certificate trust store is empty');
  if (filtered.removed > 0) tls.setDefaultCACertificates(filtered.certificates);
  const remaining = filterTrustedCertificates(tls.getCACertificates('default')).removed;
  if (remaining !== 0) throw new Error('Affected certificate roots remain trusted');
  return { removed: filtered.removed, affectedRootsRemaining: remaining };
}
