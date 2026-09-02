"use client";

import { useState } from "react";
import Link from "next/link";
import RepoInput from "@/components/RepoInput";
import ChatMessage, { Message } from "@/components/ChatMessage";
import { ingestRepo, queryRepo } from "@/lib/codesage-client";

type Status = "idle" | "ingesting" | "ready" | "querying" | "error";

export default function DemoPage() {
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");

  async function handleRepoSubmit(url: string) {
    setRepoUrl(url);
    setStatus("ingesting");
    setMessages([
      { role: "system", content: `Ingesting ${url} ...` },
    ]);
    try {
      await ingestRepo(url, {
        onStatus: (job) => {
          setMessages((m) => [
            ...m.filter((msg) => !msg.content.startsWith("Status:")),
            { role: "system", content: `Status: ${job.status}` },
          ]);
        },
      });
      setStatus("ready");
      setMessages((m) => [
        ...m,
        { role: "system", content: "Ready. Ask a question about this repo." },
      ]);
    } catch (err) {
      setStatus("error");
      setMessages((m) => [
        ...m,
        {
          role: "system",
          content:
            err instanceof Error && err.message
              ? err.message
              : "Couldn't reach the backend. Check NEXT_PUBLIC_CODESAGE_API_URL is set and the API is running.",
        },
      ]);
    }
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !repoUrl) return;
    const q = question.trim();
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setStatus("querying");
    try {
      const result = await queryRepo(repoUrl, q);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ]);
      setStatus("ready");
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "system",
          content: "That query failed. Try again in a moment.",
        },
      ]);
      setStatus("ready");
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg font-medium text-fg">
            codebase12
          </Link>
          <span className="font-mono text-xs text-muted">demo</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-2xl font-medium text-fg">
          Ask a public repo something
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Paste any public GitHub repo URL to get started.
        </p>

        <div className="mt-8">
          <RepoInput
            onSubmit={handleRepoSubmit}
            disabled={status === "ingesting" || status === "querying"}
          />
        </div>

        {messages.length > 0 && (
          <div className="mt-10 space-y-6 border-t border-line pt-8">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleAsk} className="mt-8 flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Where's auth handled?"
              className="focus-ring flex-1 rounded-sm border border-line bg-surface px-4 py-3 font-mono text-sm text-fg placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="focus-ring rounded-sm bg-add px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Ask
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
