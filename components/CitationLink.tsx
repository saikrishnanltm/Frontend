import type { Citation } from "@/lib/codesage-client";

export default function CitationLink({ citation }: { citation: Citation }) {
  const label =
    citation.startLine === citation.endLine
      ? `${citation.file}:${citation.startLine}`
      : `${citation.file}:${citation.startLine}-${citation.endLine}`;

  return (
    <a
      href={citation.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-block rounded-sm bg-addDim px-1.5 py-0.5 font-mono text-[13px] text-add hover:opacity-80"
    >
      {label}
    </a>
  );
}
