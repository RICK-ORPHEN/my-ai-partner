Authentication middleware now runs on the stable Next.js Node runtime and initializes the shared certificate trust policy before session refresh or policy requests. Authentication, redirect, cookie, MFA and tenant restrictions are preserved.

The built functions manifest confirms /_middleware uses nodejs. Isolated certificate-policy tests preserve unaffected trust roots and reject all four affected roots. Production deployment and runtime logs must be verified separately. No real customer, payment, trading, notification or scheduled job was executed as a test.
