import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <HowItWorks />
      <CitationExample />
      <ClosingCta />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-medium text-fg">
          codebase12
        </span>
        <Link
          href="/demo"
          className="focus-ring rounded-sm border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-add hover:text-add"
        >
          Try it live
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-14 md:grid-cols-2 md:gap-10">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl font-medium leading-[1.15] text-fg md:text-5xl">
            Ask any repo a question. Get the line that answers it.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
            Paste a public GitHub repo. Ask it something you'd normally ask a
            teammate — "where's auth handled?", "why does this fail on empty
            input?". codebase12 reads the codebase and answers with the exact
            file and line, not a guess.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="focus-ring rounded-sm bg-add px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Try it on a repo
            </Link>
            <a
              href="#how-it-works"
              className="focus-ring rounded-sm px-6 py-3 text-sm font-medium text-fg underline decoration-line underline-offset-4 hover:decoration-add"
            >
              See how it works
            </a>
          </div>
        </div>

        <TerminalPanel />
      </div>
    </section>
  );
}

function TerminalPanel() {
  return (
    <div className="rounded-sm border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-remove/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-add/60" />
        <span className="ml-2 font-mono text-xs text-muted">
          fastapi/fastapi
        </span>
      </div>
      <div className="space-y-4 p-5 font-mono text-[13px] leading-relaxed">
        <p className="text-muted">
          <span className="text-add">?</span> where does request validation
          happen before a route handler runs
        </p>
        <div className="space-y-1.5">
          <p className="text-fg">
            Pydantic models on each path operation are validated in the
            dependency-resolution step, before your function body executes.
          </p>
          <p>
            <span className="rounded-sm bg-addDim px-1.5 py-0.5 text-add">
              fastapi/dependencies/utils.py:589
            </span>
          </p>
          <p>
            <span className="rounded-sm bg-addDim px-1.5 py-0.5 text-add">
              fastapi/routing.py:212
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Paste a repo URL",
      body: "Any public GitHub repo — yours, a candidate's, or one you're evaluating for a dependency.",
    },
    {
      n: "2",
      title: "Ask in plain English",
      body: "No need to know the file structure. Ask what you'd ask a teammate who wrote the code.",
    },
    {
      n: "3",
      title: "Get a cited answer",
      body: "Every answer links back to the exact file and line on GitHub, so you can verify it yourself.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium text-fg">
          How it works
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-line pt-5">
              <span className="font-mono text-sm text-add">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-medium text-fg">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CitationExample() {
  return (
    <section className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-2xl font-medium text-fg">
              Answers you can check, not answers you have to trust
            </h2>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted">
              Most code assistants summarize. codebase12 retrieves. Every
              claim in an answer traces back to a real chunk of the
              repository — the same lines you'd land on if you searched it
              yourself, just without the searching.
            </p>
          </div>
          <div className="rounded-sm border border-line bg-surface p-5 font-mono text-[13px] leading-relaxed">
            <p className="text-muted"># retrieved chunk</p>
            <p className="mt-2 text-fg">
              <span className="text-remove">- </span>def handle_upload(file):
            </p>
            <p className="text-fg">
              <span className="text-add">+ </span>def handle_upload(file:
              UploadFile):
            </p>
            <p className="mt-3 text-muted">
              cited: routes/upload.py:34–41
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-medium text-fg md:text-3xl">
          Try it on a repo you already know
        </h2>
        <p className="mx-auto mt-3 max-w-prose text-[15px] text-muted">
          You'll spot right away whether the answers hold up.
        </p>
        <Link
          href="/demo"
          className="focus-ring mt-8 inline-block rounded-sm bg-add px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
        >
          Open the demo
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
        codebase12
      </div>
    </footer>
  );
}
