export function PageHeading({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-clay">{eyebrow}</p>}
      <h2 className="text-2xl font-black leading-tight text-ink">{title}</h2>
      {children && <p className="mt-1 text-sm leading-6 text-ink/70">{children}</p>}
    </div>
  );
}
