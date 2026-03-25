import type { PropsWithChildren, ReactNode } from "react";

interface SurfaceCardProps extends PropsWithChildren {
  eyebrow?: string;
  title?: string;
  description?: string;
  aside?: ReactNode;
  className?: string;
}

export function SurfaceCard({
  eyebrow,
  title,
  description,
  aside,
  className = "",
  children,
}: SurfaceCardProps) {
  return (
    <section className={`surface-card ${className}`.trim()}>
      {eyebrow || title || description || aside ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="surface-eyebrow">{eyebrow}</p> : null}
            {title ? <h3 className="surface-title">{title}</h3> : null}
            {description ? <p className="surface-description">{description}</p> : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
