import { type SVGProps } from 'react';

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconRestaurant(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M10 38c0-10 8-18 22-18s22 8 22 18Z"/>
    <path d="M10 38h44"/>
    <path d="M16 44h32"/>
    <circle cx="22" cy="30" r="2"/>
    <path d="M28 24c4-6 12-6 16 0"/>
  </svg>
); }

export function IconRetail(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M14 22h36l-3 28H17z"/>
    <path d="M22 22a10 10 0 0 1 20 0"/>
    <path d="M28 32v8M36 32v8"/>
  </svg>
); }

export function IconRealEstate(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M10 30 32 14l22 16"/>
    <path d="M16 28v22h32V28"/>
    <path d="M28 50V36h8v14"/>
    <path d="M40 18v6"/>
  </svg>
); }

export function IconMedical(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M16 14v18a8 8 0 0 0 16 0V14"/>
    <path d="M32 32a8 8 0 0 0 16 0v-4"/>
    <circle cx="48" cy="22" r="6"/>
    <circle cx="16" cy="14" r="2"/>
    <circle cx="32" cy="14" r="2"/>
  </svg>
); }

export function IconLegal(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M32 10v44"/>
    <path d="M14 16h36"/>
    <path d="M22 16 14 36h16Z"/>
    <path d="M42 16l8 20H34Z"/>
    <path d="M22 50h20"/>
    <path d="M30 50v-8h4v8"/>
  </svg>
); }

export function IconConstruction(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M10 50V20l22-8 22 8v30"/>
    <path d="M10 50h44"/>
    <path d="M22 30h8v20h-8z"/>
    <path d="M36 30h8v8h-8z"/>
    <path d="M14 24h6M44 24h6"/>
  </svg>
); }

export function IconBeauty(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <circle cx="32" cy="22" r="10"/>
    <path d="M22 22c0-6 4-14 10-14s10 8 10 14"/>
    <path d="M22 30c-4 6-6 14-6 24h32c0-10-2-18-6-24"/>
    <path d="M28 22h.01M36 22h.01"/>
  </svg>
); }

export function IconEducation(p: SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 64 64" {...base} {...p}>
    <path d="M8 24 32 14l24 10-24 10z"/>
    <path d="M16 28v12c0 2 7 6 16 6s16-4 16-6V28"/>
    <path d="M56 24v14"/>
    <circle cx="56" cy="40" r="2"/>
  </svg>
); }

export const INDUSTRY_ICONS = {
  restaurant:   IconRestaurant,
  retail:       IconRetail,
  realestate:   IconRealEstate,
  medical:      IconMedical,
  legal:        IconLegal,
  construction: IconConstruction,
  beauty:       IconBeauty,
  education:    IconEducation
} as const;
