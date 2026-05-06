import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.6,
  stroke: 'currentColor',
};

export function IconObjectives(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
export function IconWhy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.4-1.5 2.4v.5" />
      <circle cx="12" cy="17.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconConcept(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h13a3 3 0 0 1 3 3v11a1 1 0 0 1-1 1H7a3 3 0 0 1-3-3V5z" />
      <path d="M4 16a3 3 0 0 1 3-3h13" />
      <path d="M8 9h7" />
    </svg>
  );
}
export function IconExample(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h12l5 5v9H3z" />
      <path d="M15 6v5h5" />
      <path d="M7 14h7M7 17h5" />
    </svg>
  );
}
export function IconLibrary(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="3.5" height="16" />
      <rect x="9" y="4" width="3.5" height="16" />
      <path d="M14 4l3.5 1 3 14.5-3.5 1z" />
    </svg>
  );
}
export function IconHandsOn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 11V6a2 2 0 1 1 4 0v6" />
      <path d="M13 9V5a2 2 0 1 1 4 0v9" />
      <path d="M17 9.5a2 2 0 1 1 4 0V14a7 7 0 0 1-7 7h-2a7 7 0 0 1-6-3.5L4 14a2 2 0 1 1 3-2.5l2 2" />
    </svg>
  );
}
export function IconSubmission(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4h11l5 5v11H4z" />
      <path d="M9 13l2 2 4-4.5" />
    </svg>
  );
}
export function IconNext(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
export function IconCopy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </svg>
  );
}
export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4 4 10-10" />
    </svg>
  );
}
export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}
export function IconBranch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      <path d="M12 13v3" />
    </svg>
  );
}
export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}
export function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M5.5 5.5l3.5 3.5M14.5 14.5l4 4M5.5 18.5l3.5-3.5M14.5 9.5l4-4" />
    </svg>
  );
}
