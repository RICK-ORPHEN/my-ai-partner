export function SevenStepDiagram() {
  const steps = [
    { n: '01', t: 'AI活用入門' },
    { n: '02', t: 'プロンプト基礎' },
    { n: '03', t: 'データ整理・自動化' },
    { n: '04', t: '顧客対応自動化' },
    { n: '05', t: 'コンテンツ生成' },
    { n: '06', t: '業務システム制作' },
    { n: '07', t: '公開・運用' }
  ];
  return (
    <svg viewBox="0 0 1200 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-label="7段プロセス">
      <defs>
        <marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#D3300A"/>
        </marker>
      </defs>
      {/* Track line */}
      <line x1="60" y1="100" x2="1140" y2="100" stroke="#FAF9F6" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="2 6"/>
      <line x1="60" y1="100" x2="1080" y2="100" stroke="#D3300A" strokeWidth="2" markerEnd="url(#ar)"/>

      {steps.map((s, i) => {
        const x = 60 + i * 170;
        const isLast = i >= 5;
        return (
          <g key={s.n}>
            {/* Node circle */}
            <circle cx={x} cy="100" r="22" fill={isLast ? '#D3300A' : '#FAF9F6'} stroke="#D3300A" strokeWidth="2"/>
            <text x={x} y="105" textAnchor="middle" fontFamily="'Noto Serif JP', serif" fontWeight="700" fontSize="14" fill={isLast ? '#FAF9F6' : '#060E31'}>{s.n}</text>
            {/* Title above */}
            <text x={x} y="60" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontWeight="500" fontSize="13" fill="#FAF9F6" opacity="0.9">{s.t}</text>
            {/* Below subtitle */}
            <text x={x} y="155" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#FAF9F6" opacity="0.45" letterSpacing="2">
              {isLast ? 'PUBLISH' : `STEP ${s.n}`}
            </text>
          </g>
        );
      })}

      {/* Mark end */}
      <text x="600" y="190" textAnchor="middle" fontFamily="'Inter Tight'" fontSize="11" fill="#D3300A" letterSpacing="3">→ 公開URL所有</text>
    </svg>
  );
}
