import { useState, useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "fade";
  delay?: number;
}

export const ScrollReveal = ({ children, className = "", direction = "up", delay = 0 }: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animClass = direction === "up" ? "animate-reveal-up"
    : direction === "left" ? "animate-slide-left"
    : direction === "right" ? "animate-slide-right"
    : "animate-fade-in";

  return (
    <div
      ref={ref}
      className={`${isVisible ? animClass : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
