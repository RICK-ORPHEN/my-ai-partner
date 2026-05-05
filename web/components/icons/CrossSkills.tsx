import { type SVGProps } from 'react';
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconSkillsDev(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <rect x="10" y="14" width="44" height="36" rx="2"/>
    <path d="M16 22h32M16 28h22M16 34h28M16 40h18"/>
    <circle cx="50" cy="40" r="6" fill="currentColor" opacity="0.15"/>
    <path d="M48 40l2 2 4-4"/>
  </svg>
); }

export function IconLpDesign(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <rect x="10" y="10" width="44" height="44" rx="2"/>
    <path d="M10 22h44"/>
    <circle cx="16" cy="16" r="1.2"/>
    <circle cx="20" cy="16" r="1.2"/>
    <circle cx="24" cy="16" r="1.2"/>
    <path d="M18 32h28v6H18z"/>
    <path d="M18 44h12"/>
  </svg>
); }

export function IconProposal(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M14 8h28l8 8v40H14z"/>
    <path d="M42 8v8h8"/>
    <path d="M20 30h24M20 36h24M20 42h16"/>
    <path d="M20 22h12"/>
  </svg>
); }

export function IconAutomation(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <rect x="14" y="18" width="36" height="24" rx="2"/>
    <circle cx="24" cy="30" r="2"/>
    <circle cx="40" cy="30" r="2"/>
    <path d="M28 36c2 2 6 2 8 0"/>
    <path d="M32 18v-6"/>
    <path d="M14 50l4-8M50 50l-4-8"/>
  </svg>
); }

export const CROSS_SKILL_ICONS = {
  skills_dev: IconSkillsDev,
  lp_design: IconLpDesign,
  proposal_design: IconProposal,
  automation_chat: IconAutomation
} as const;
