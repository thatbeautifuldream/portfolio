const REPO_URL = "https://github.com/thatbeautifuldream/portfolio";

export function Footer() {
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA;
  const shortSha = sha?.slice(0, 7);

  if (!shortSha) return null;

  return (
    <footer className="py-6 text-center">
      <a
        href={`${REPO_URL}/commit/${sha}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {shortSha}
      </a>
    </footer>
  );
}
