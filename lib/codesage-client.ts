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

export type IngestJob = {
  job_id: string;
  status: string;
  source?: string;
  repo_name?: string;
  result?: unknown;
  error?: string;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
};

const TERMINAL_SUCCESS = new Set(["completed", "success", "done", "finished"]);
const TERMINAL_FAILURE = new Set(["failed", "error"]);

async function getIngestStatus(jobId: string): Promise<IngestJob> {
  const res = await fetch(`${BASE_URL}/ingest/status/${jobId}`);
  if (!res.ok) {
    throw new Error(`Status check failed: ${res.status}`);
  }
  return res.json();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ingestRepo(
  repoUrl: string,
  opts?: { onStatus?: (job: IngestJob) => void; timeoutMs?: number }
): Promise<IngestJob> {
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
  const { job_id: jobId } = (await res.json()) as { job_id: string };

  const timeoutMs = opts?.timeoutMs ?? 900_000;
  const start = Date.now();
  let delay = 1000;

  while (true) {
    const job = await getIngestStatus(jobId);
    opts?.onStatus?.(job);

    const status = job.status?.toLowerCase();
    if (status && TERMINAL_SUCCESS.has(status)) {
      return job;
    }
    if (status && TERMINAL_FAILURE.has(status)) {
      throw new Error(job.error || `Ingestion failed (status: ${job.status})`);
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Ingestion timed out. The repo may be large — try again shortly.");
    }
    await sleep(delay);
    delay = Math.min(delay * 1.5, 5000);
  }
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
