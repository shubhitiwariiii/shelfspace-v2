import { cn } from "@/lib/utils";

// CSS-only reveal: works without JavaScript and doesn't delay the first paint
export function FadeIn({
  children,
  delay = 0,
  className,
  mode = "scroll",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  mode?: "load" | "scroll";
}) {
  return (
    <div
      className={cn(mode === "load" ? "fade-up" : "reveal", className)}
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}