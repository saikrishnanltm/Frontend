import CitationLink from "./CitationLink";
import type { Citation } from "@/lib/codesage-client";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Citation[];
};

export default function ChatMessage({ message }: { message: Message }) {
  if (message.role === "system") {
    return (
      <p className="font-mono text-[13px] text-muted">{message.content}</p>
    );
  }

  if (message.role === "user") {
    return (
      <p className="font-mono text-[14px] text-fg">
        <span className="text-add">{"> "}</span>
        {message.content}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[15px] leading-relaxed text-fg">{message.content}</p>
      {message.citations && message.citations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.citations.map((c, i) => (
            <CitationLink key={i} citation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
