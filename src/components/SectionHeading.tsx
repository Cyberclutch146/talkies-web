interface SectionHeadingProps {
  title: string;
  tag?: string;
  className?: string;
}

export function SectionHeading({ title, tag, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {tag && (
        <span className="inline-block bg-red text-cream text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
          {tag}
        </span>
      )}
      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink">
        {title}
      </h2>
      <div className="mt-4 h-px bg-rule w-full" />
    </div>
  );
}
