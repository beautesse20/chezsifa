'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Fait apparaître les éléments [data-reveal] quand ils entrent à l'écran. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const scan = () => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);
  return null;
}

/** Halo lumineux qui suit la souris dans le hero. */
export function HeroSpot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener('pointermove', move);
    return () => { el.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={ref} className="spot" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

/** Tampon circulaire « prêt en 48 h » qui tourne. */
export function Stamp({ text, center }: { text: string; center: string }) {
  return (
    <div className="stamp" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs><path id="stamp-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text fill="#1E1714" fontSize="11.5" fontWeight="800" letterSpacing="2.6" fontFamily="Manrope, system-ui, sans-serif">
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
      </svg>
      <b>{center}</b>
    </div>
  );
}
