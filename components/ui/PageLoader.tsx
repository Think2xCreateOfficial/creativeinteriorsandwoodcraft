"use client";

import { useEffect, useState } from "react";

/**
 * Animated Character Page Loader (inspired by Uiverse)
 * Features the animated smiling and winking SVG character with dual gradient layers.
 * Uses camelCase `stopColor` to eliminate the React DOM property console warning.
 */
export default function PageLoader() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Respect reduced motion preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setMounted(false);
      return;
    }

    // Fast fade-out so initial hero content and LCP render without artificial delays
    const fadeTimer = window.setTimeout(() => {
      setFading(true);
    }, 300);

    const unmountTimer = window.setTimeout(() => {
      setMounted(false);
    }, 600);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Creative Interiors & Woodcraft website"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Uiverse Character SVG */}
        <div className="relative flex items-center justify-center">
          <svg
            height="108px"
            width="108px"
            viewBox="0 0 128 128"
            className="uiverse-loader"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="loader-eyes">
                <circle
                  transform="rotate(-40,64,64) translate(0,-56)"
                  r={8}
                  cy={64}
                  cx={64}
                  className="uiverse-loader__eye1"
                />
                <circle
                  transform="rotate(40,64,64) translate(0,-56)"
                  r={8}
                  cy={64}
                  cx={64}
                  className="uiverse-loader__eye2"
                />
              </clipPath>
              <linearGradient y2={1} x2={0} y1={0} x1={0} id="loader-grad">
                <stop stopColor="#000" offset="0%" />
                <stop stopColor="#fff" offset="100%" />
              </linearGradient>
              <mask id="loader-mask">
                <rect fill="url(#loader-grad)" height={128} width={128} y={0} x={0} />
              </mask>
            </defs>

            <g strokeDasharray="175.93 351.86" strokeWidth={12} strokeLinecap="round">
              <g>
                <rect
                  clipPath="url(#loader-eyes)"
                  height={64}
                  width={128}
                  fill="#49372b"
                />
                <g stroke="#49372b" fill="none">
                  <circle
                    transform="rotate(180,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="uiverse-loader__mouth1"
                  />
                  <circle
                    transform="rotate(0,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="uiverse-loader__mouth2"
                  />
                </g>
              </g>

              <g mask="url(#loader-mask)">
                <rect
                  clipPath="url(#loader-eyes)"
                  height={64}
                  width={128}
                  fill="#806653"
                />
                <g stroke="#806653" fill="none">
                  <circle
                    transform="rotate(180,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="uiverse-loader__mouth1"
                  />
                  <circle
                    transform="rotate(0,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="uiverse-loader__mouth2"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Brand Caption */}
        <div className="mt-6 text-center">
          <p className="font-sans text-[13px] font-bold uppercase tracking-[0.25em] text-charcoal-black">
            Creative Interiors
          </p>
          <p className="mt-1 font-serif text-[11.5px] italic tracking-widest text-medium-brown">
            &amp; Woodcraft
          </p>
        </div>
      </div>
    </div>
  );
}
