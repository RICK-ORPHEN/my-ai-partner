export function TrackCompareDiagram() {
  return (
    <svg viewBox="0 0 1200 320" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Track A vs B">
      <defs>
        <marker id="ar2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#D3300A"/>
        </marker>
      </defs>

      {/* Center starting point */}
      <circle cx="600" cy="40" r="14" fill="#060E31"/>
      <text x="600" y="45" textAnchor="middle" fill="#FAF9F6" fontSize="11" fontFamily="'Inter Tight'">START</text>
      <text x="600" y="20" textAnchor="middle" fill="#5A618A" fontSize="10" fontFamily="'JetBrains Mono'" letterSpacing="2">YOUR PROJECT</text>

      {/* Track A path (left) */}
      <path d="M 600,54 Q 600,90 350,90 T 150,160" fill="none" stroke="#0941E1" strokeWidth="2"/>
      <text x="280" y="80" fontSize="11" fill="#0941E1" fontFamily="'JetBrains Mono'" letterSpacing="2">TRACK A</text>
      <g>
        <rect x="60" y="160" width="200" height="120" fill="none" stroke="#0941E1" strokeWidth="1.5"/>
        <text x="160" y="190" textAnchor="middle" fontFamily="'Noto Serif JP'" fontWeight="700" fontSize="20" fill="#060E31">コーディング派</text>
        <text x="160" y="216" textAnchor="middle" fontFamily="'Inter Tight'" fontSize="12" fill="#5A618A">Next.js + Supabase</text>
        <text x="160" y="234" textAnchor="middle" fontFamily="'Inter Tight'" fontSize="12" fill="#5A618A">+ Vercel</text>
        <text x="160" y="262" textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize="9" fill="#D3300A" letterSpacing="2">→ FULL CONTROL</text>
      </g>

      {/* Track B path (right) */}
      <path d="M 600,54 Q 600,90 850,90 T 1050,160" fill="none" stroke="#D3300A" strokeWidth="2"/>
      <text x="800" y="80" fontSize="11" fill="#D3300A" fontFamily="'JetBrains Mono'" letterSpacing="2">TRACK B</text>
      <g>
        <rect x="940" y="160" width="200" height="120" fill="none" stroke="#D3300A" strokeWidth="1.5"/>
        <text x="1040" y="190" textAnchor="middle" fontFamily="'Noto Serif JP'" fontWeight="700" fontSize="20" fill="#060E31">ノーコード派</text>
        <text x="1040" y="216" textAnchor="middle" fontFamily="'Inter Tight'" fontSize="12" fill="#5A618A">Squarespace</text>
        <text x="1040" y="234" textAnchor="middle" fontFamily="'Inter Tight'" fontSize="12" fill="#5A618A">+ AI生成コンテンツ</text>
        <text x="1040" y="262" textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize="9" fill="#D3300A" letterSpacing="2">→ FAST LAUNCH</text>
      </g>

      {/* Both lead to */}
      <text x="600" y="200" textAnchor="middle" fontSize="13" fontFamily="'Noto Serif JP'" fill="#5A618A">どちらも</text>
      <text x="600" y="225" textAnchor="middle" fontSize="20" fontFamily="'Noto Serif JP'" fontWeight="700" fill="#060E31">公開URLが残る</text>
      <line x1="540" y1="240" x2="660" y2="240" stroke="#D3300A" strokeWidth="2"/>
    </svg>
  );
}
