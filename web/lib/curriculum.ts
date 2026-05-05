export type Industry = 'restaurant'|'retail'|'realestate'|'medical'|'legal'|'construction'|'beauty'|'education';
export type CrossSkill = 'skills_dev'|'lp_design'|'proposal_design'|'automation_chat';
export type CourseId = Industry | CrossSkill;

export const INDUSTRIES: { id: Industry; title: string; subtitle: string; icon: string }[] = [
  { id: 'restaurant',   title: '飲食',         subtitle: '来店予測・SNS集客・予約自動化', icon: '🍣' },
  { id: 'retail',       title: '小売',         subtitle: '商品レコメンド・在庫予測・EC',   icon: '🛍️' },
  { id: 'realestate',   title: '不動産',       subtitle: '物件紹介・内見予約・CRM自作',   icon: '🏠' },
  { id: 'medical',      title: '医療',         subtitle: '問診支援・予約自動化',           icon: '🩺' },
  { id: 'legal',        title: '士業',         subtitle: '法令要約・契約書比較',           icon: '⚖️' },
  { id: 'construction', title: '建設・製造',   subtitle: '現場記録・工程管理',             icon: '🏗️' },
  { id: 'beauty',       title: '美容',         subtitle: '予約bot・SNS戦略',               icon: '💇' },
  { id: 'education',    title: '教育',         subtitle: '教材生成・成績分析',             icon: '📚' }
];

export const CROSS_SKILLS: { id: CrossSkill; title: string; subtitle: string; icon: string }[] = [
  { id: 'skills_dev',     title: 'スキル開発',         subtitle: 'Claude Skillsで業務を組み込む', icon: '🧠' },
  { id: 'lp_design',      title: 'LP制作',             subtitle: 'コピー × デザイン × 公開',     icon: '🎨' },
  { id: 'proposal_design',title: '企画書・提案書',     subtitle: 'PPTX/PDFで配布できる量産化',   icon: '📑' },
  { id: 'automation_chat',title: '自動オペレーション', subtitle: 'Slack/LINE bot で業務自動化',  icon: '🤖' }
];

export const STEP_TITLES = [
  'AI活用入門',
  'プロンプト基礎',
  'データ整理・自動化',
  '顧客対応自動化',
  'コンテンツ生成',
  '業務システム制作',
  '公開・運用'
];

export const ALL_COURSES = [
  ...INDUSTRIES.map(i=>({ ...i, kind: 'industry' as const })),
  ...CROSS_SKILLS.map(c=>({ ...c, kind: 'cross_skill' as const }))
];

export function lessonId(course: CourseId, step: number) {
  return `${course}_${String(step).padStart(2,'0')}`;
}
