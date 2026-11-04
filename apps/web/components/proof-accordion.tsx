import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function ProofAccordion({
  title,
  meta,
  children,
  id,
  level = 2,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  id?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <details
      className={`proof-accordion ${level === 3 ? "proof-accordion-nested" : "proof-section"}`}
      id={id}
    >
      <summary>
        <div className="accordion-heading">
          <Heading>{title}</Heading>
          {meta && <span className="accordion-meta">{meta}</span>}
        </div>
        <span className="accordion-toggle" aria-hidden="true">
          <ChevronDown size={20} />
        </span>
      </summary>
      <div className="accordion-content">{children}</div>
    </details>
  );
}
