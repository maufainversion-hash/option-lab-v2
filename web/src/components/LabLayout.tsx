import type { ReactNode } from "react";

export function LabHeader({
  eyebrow,
  title,
  subtitle,
  hull,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  hull?: string;
}) {
  return (
    <div className="mb-7 animate-rise">
      <div className="eyebrow mb-3 flex items-center gap-3">
        <span className="inline-block h-px w-7 bg-brass" />
        {eyebrow}
        {hull && <span className="chip ml-1">{hull}</span>}
      </div>
      <h1 className="font-display text-[34px] font-medium leading-tight sm:text-[42px]">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">
        {subtitle}
      </p>
    </div>
  );
}

export function LabLayout({
  controls,
  children,
}: {
  controls: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
      <aside className="h-fit lg:sticky lg:top-20">
        <div className="panel space-y-5 p-5">{controls}</div>
      </aside>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-display text-[18px] font-medium">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
