"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImmersiveBackdrop } from "@/components/immersive/immersive-backdrop";

gsap.registerPlugin(ScrollTrigger);

export function HomeImmersiveRoot({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroEls = gsap.utils.toArray<HTMLElement>("[data-immersive-hero]");
      const scrollEls = gsap.utils.toArray<HTMLElement>("[data-immersive-scroll]");
      const floatEls = gsap.utils.toArray<HTMLElement>("[data-immersive-float]");

      if (reduceMotion) {
        gsap.set([...heroEls, ...scrollEls], { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set([...heroEls, ...scrollEls, ...floatEls], { willChange: "transform, opacity" });

      gsap.fromTo(
        heroEls,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.88,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.04,
        }
      );

      scrollEls.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 62%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.to(floatEls, {
        y: -8,
        duration: 3.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen">
      <div className="fixed inset-0 z-[1]">
        <ImmersiveBackdrop variant="home" className="h-full w-full" />
      </div>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
