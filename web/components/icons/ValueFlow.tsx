import { type SVGProps } from 'react';
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconIdea(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 48 48" {...base} {...p}>
    <path d="M24 8a12 12 0 0 0-7 21.6V34h14v-4.4A12 12 0 0 0 24 8z"/>
    <path d="M19 38h10M21 42h6"/>
    <path d="M24 14v8M21 18l3 3 3-3"/>
  </svg>
); }
export function IconBuild(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 48 48" {...base} {...p}>
    <path d="M16 14L8 24l8 10M32 14l8 10-8 10"/>
    <path d="M28 12l-8 24"/>
  </svg>
); }
export function IconPublish(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 48 48" {...base} {...p}>
    <circle cx="24" cy="24" r="14"/>
    <path d="M10 24h28M24 10c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14z"/>
  </svg>
); }
export function IconOwn(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 48 48" {...base} {...p}>
    <path d="M10 36V18l8 6 6-12 6 12 8-6v18z"/>
    <path d="M10 40h28"/>
  </svg>
); }
