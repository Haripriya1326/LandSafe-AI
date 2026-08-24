export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="text-xl md:text-2xl font-semibold text-ink-hi">{title}</h2>
        {description && <p className="text-sm text-ink-mid mt-1 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
