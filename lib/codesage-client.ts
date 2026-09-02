// Thin wrapper around the CodeSage backend (deployed separately on Railway).
// Set NEXT_PUBLIC_CODESAGE_API_URL in your Vercel project's environment
// variables to your Railway URL, e.g. https://codesage-production.up.railway.app

const BASE_URL =
  process.env.NEXT_PUBLIC_CODESAGE_API_URL ?? "http://localhost:8000";

export type Citation = {
  file: string;
  startLine: number;
  endLine: number;
  githubUrl: string;
};

export type QueryResult = {
  answer: string;
  citations: Citation[];
};

function repoNameFromUrl(repoUrl: string): string {
  // e.g. https://github.com/someuser/somerepo(.git) -> "somerepo"
  const cleaned = repoUrl.replace(/\.git$/, "").replace(/\/+$/, "");
  const parts = cleaned.split("/");
  return parts[parts.length - 1] || cleaned;
}

export async function ingestRepo(repoUrl: string): Promise<{ jobId: string }> {
  const res = await fetch(`${BASE_URL}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: repoUrl,
      repo_name: repoNameFromUrl(repoUrl),
    }),
  });
  if (!res.ok) {
    throw new Error(`Ingest failed: ${res.status}`);
  }
  return res.json();
}

export async function queryRepo(
  repoUrl: string,
  question: string
): Promise<QueryResult> {
  const res = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      repo_filter: repoNameFromUrl(repoUrl),
    }),
  });
  if (!res.ok) {
    throw new Error(`Query failed: ${res.status}`);
  }
  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
