import React, { useRef, useEffect } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/white.css';
import { slides } from '../data/slides';
import gsap from 'gsap';

/**
 * Reveal.js engine with Manim-flavoured motion:
 *  - equations are "written" stroke-by-stroke (MathJax glyph paths drawn,
 *    then the fill eased in) — like Manim's Write;
 *  - SVG curves draw themselves;
 *  - elements enter by moving + scaling (transform), not plain fades;
 *  - slides slide across (directional), so steps feel connected.
 */
export const PresentationEngine: React.FC = () => {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    if (deckRef.current && !revealInstance.current) {
      const deck = new Reveal(deckRef.current, {
        hash: true,
        transition: 'none', // we animate the active slide ourselves (CSS) for reliability
        backgroundTransition: 'none',
        controls: true,
        controlsLayout: 'bottom-right',
        progress: false,
        slideNumber: false,
        center: false,
        width: 1280,
        height: 720,
        margin: 0,
        minScale: 0.2,
        maxScale: 2.0,
      });
      revealInstance.current = deck;

      // Called by Mathx when an equation finishes (async) MathJax rendering —
      // draw it now if it sits in the current slide and isn't a hidden fragment.
      (window as any).__mathWrite = (el: HTMLElement) => {
        const cur = deck.getCurrentSlide();
        if (el && cur && cur.contains(el) && isVisible(el)) {
          writeMath(el.querySelectorAll<SVGPathElement>('path[data-mw]'));
        }
      };

      deck.initialize().then(() => animateSlide(deck.getCurrentSlide()));

      deck.on('slidechanged', (e: any) => animateSlide(e.currentSlide));
      deck.on('fragmentshown', (e: any) => {
        const frag = e.fragment as HTMLElement;
        // move + scale in (transform feel), not just opacity
        gsap.fromTo(
          frag,
          { opacity: 0, y: 22, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
        );
        writeMath(frag.querySelectorAll<SVGPathElement>('path[data-mw]'));
        drawCurves(frag.querySelectorAll<SVGPathElement>('path.curve'));
      });
    }

    return () => {
      try {
        revealInstance.current?.destroy();
        revealInstance.current = null;
      } catch (err) {
        console.warn('Reveal already destroyed', err);
      }
    };
  }, []);

  /** Manim-style "Write": draw each glyph outline, then fade its fill in. */
  const writeMath = (paths: NodeListOf<SVGPathElement>) => {
    paths.forEach((p, i) => {
      let len = 0;
      try {
        len = p.getTotalLength();
      } catch {
        len = 200;
      }
      const delay = 0.15 + i * 0.045;
      const drawT = 0.35 + Math.min(len / 1400, 1) * 0.5;
      p.style.stroke = 'currentColor';
      p.style.strokeWidth = '13';
      p.style.fill = 'currentColor';
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      gsap.to(p, {
        strokeDashoffset: 0,
        duration: drawT,
        ease: 'power1.inOut',
        delay,
      });
      gsap.to(p, {
        fillOpacity: 1,
        duration: 0.25,
        delay: delay + drawT * 0.75,
        onComplete: () => {
          p.style.strokeWidth = '0';
        },
      });
    });
  };

  /** Draw self-drawing SVG curves (charts, schematics). */
  const drawCurves = (curves: NodeListOf<SVGPathElement>) => {
    curves.forEach((path, i) => {
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        len = 1200;
      }
      const dash = path.getAttribute('stroke-dasharray');
      path.style.strokeDasharray = dash && dash !== 'none' ? dash : `${len}`;
      gsap.fromTo(
        path,
        { strokeDashoffset: len, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power2.inOut',
          delay: 0.25 + i * 0.16,
          onComplete: () => {
            path.style.strokeDasharray = dash && dash !== 'none' ? dash : 'none';
          },
        },
      );
    });
  };

  const isVisible = (el: Element) => {
    const frag = el.closest('.fragment');
    return !frag || frag.classList.contains('visible');
  };

  const animateSlide = (slide: HTMLElement | undefined) => {
    if (!slide) return;

    // curves & math that are already visible (not waiting in a fragment)
    drawCurves(
      Array.from(slide.querySelectorAll<SVGPathElement>('path.curve')).filter(
        isVisible,
      ) as unknown as NodeListOf<SVGPathElement>,
    );
    writeMath(
      Array.from(slide.querySelectorAll<SVGPathElement>('path[data-mw]')).filter(
        isVisible,
      ) as unknown as NodeListOf<SVGPathElement>,
    );

    // list items — slide in from the left
    const items = slide.querySelectorAll('ul > li');
    if (items.length) {
      gsap.fromTo(
        items,
        { x: -34, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out', delay: 0.15 },
      );
    }

    // headings — rise + scale
    const heads = slide.querySelectorAll('h1, h2, h3, h4');
    if (heads.length) {
      gsap.fromTo(
        heads,
        { y: 26, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      );
    }

    // blocks / callouts — move + scale in
    const blocks = slide.querySelectorAll('[data-anim="block"]');
    if (blocks.length) {
      gsap.fromTo(
        blocks,
        { opacity: 0, y: 26, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.15 },
      );
    }

    // chart / image cards — grow in
    const cards = slide.querySelectorAll('[data-anim="card"]');
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.93, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 },
      );
    }
  };

  // Transition flavour per slide (CSS animations in index.css, keyed off the
  // .present class so they re-fire on every navigation):
  //   default content -> glide in;  section dividers & finale -> zoom in.
  const SECTIONS = new Set([2, 5, 9, 13, 18]);
  const flavour = (i: number) =>
    i === 0
      ? 'rv-cover'
      : i === slides.length - 1 || SECTIONS.has(i)
        ? 'rv-zoom'
        : 'rv-glide';

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">
        {slides.map((Slide, i) => (
          <section key={i} className={`h-full w-full ${flavour(i)}`}>
            {Slide}
          </section>
        ))}
      </div>
    </div>
  );
};
