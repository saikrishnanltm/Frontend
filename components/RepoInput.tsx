"use client";

import { useState } from "react";

export default function RepoInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (repoUrl: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://github.com/owner/repo"
        disabled={disabled}
        className="focus-ring flex-1 rounded-sm border border-line bg-surface px-4 py-3 font-mono text-sm text-fg placeholder:text-muted"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="focus-ring rounded-sm bg-add px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Load repo
      </button>
    </form>
  );
}
