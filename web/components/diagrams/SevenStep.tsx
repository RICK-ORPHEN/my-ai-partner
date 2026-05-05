const STEPS = [
  { n: '01', t: 'AI活用入門',           sub: '業種特有のユースケースを見渡す',         dur: '24m' },
  { n: '02', t: 'プロンプト基礎',       sub: '基本構造とコツを実タスクで習得',         dur: '26m' },
  { n: '03', t: 'データ整理・自動化',   sub: 'スプレッドシート × AIで日常自動化',     dur: '28m' },
  { n: '04', t: '顧客対応自動化',       sub: 'チャットボットで予約・問い合わせ',       dur: '30m' },
  { n: '05', t: 'コンテンツ生成',       sub: 'LP・SNS・メールをAIで生成する型',        dur: '32m' },
  { n: '06', t: '業務システム制作',     sub: '自分の業務を解くサービスを実装（Track分岐）', dur: '34m' },
  { n: '07', t: '公開・運用',           sub: 'Vercel/Supabase or Squarespace で世に出す', dur: '36m' }
];

export function SevenStepIndex() {
  return (
    <div className="border-t border-cream-50/15 mt-12">
      {STEPS.map((s, i)=>{
        const isPublish = s.n === '07';
        return (
          <div key={s.n} className="grid grid-cols-12 gap-4 md:gap-8 items-baseline py-5 md:py-7 border-b border-cream-50/15 group hover:bg-cream-50/[0.03] transition-colors -mx-3 md:-mx-6 px-3 md:px-6">
            <div className="col-span-2 md:col-span-1">
              <div className={`h-display tracking-tightest leading-none text-3xl md:text-5xl ${isPublish ? 'text-vermilion':'text-cream-50/85'}`}>{s.n}</div>
            </div>
            <div className="col-span-7 md:col-span-7">
              <div className="font-serif text-lg md:text-2xl tracking-editorial">{s.t}</div>
              <div className="text-cream-50/55 text-xs md:text-sm mt-1">{s.sub}</div>
            </div>
            <div className="col-span-3 md:col-span-4 flex items-baseline justify-end gap-3 text-cream-50/45 text-xs">
              <span className="hidden md:inline-block flex-1 border-b border-dotted border-cream-50/25 mb-1.5"></span>
              {isPublish ? <span className="tag text-vermilion">公開</span> : <span className="tag">{s.dur}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
