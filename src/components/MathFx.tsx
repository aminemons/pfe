import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    MathJax: any;
  }
}

/**
 * Renders LaTeX through MathJax's SVG output. Each glyph is a real <path>,
 * so the PresentationEngine can "write" the equation stroke-by-stroke
 * (Manim-style) by animating stroke-dashoffset, then fading the fill in.
 *
 *  - display : block / centred display equation (bigger).
 *  - draw    : mark glyphs so the engine animates the hand-drawn write-on.
 */
export const Mathx: React.FC<{
  tex: string;
  display?: boolean;
  draw?: boolean;
  className?: string;
}> = ({ tex, display = false, draw = true, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const MJ = window.MathJax;
      if (!MJ || !MJ.tex2svgPromise || !MJ.startup) {
        if (!cancelled) setTimeout(render, 120); // wait for the CDN script
        return;
      }
      await MJ.startup.promise;
      const node = await MJ.tex2svgPromise(tex, { display });
      if (cancelled || !ref.current) return;
      const svg: SVGSVGElement | null = node.querySelector("svg");
      if (!svg) return;

      svg.style.overflow = "visible";
      if (draw) {
        svg.querySelectorAll("path").forEach((p) => {
          p.setAttribute("data-mw", "1");
          (p as SVGPathElement).style.fillOpacity = "0";
        });
      }
      ref.current.innerHTML = "";
      ref.current.appendChild(svg);
      // MathJax renders async; tell the engine the glyphs now exist so it can
      // run the write-on if this equation is currently visible.
      if (draw) (window as any).__mathWrite?.(ref.current);
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [tex, display, draw]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: display ? "block" : "inline-block", lineHeight: 0 }}
    />
  );
};
