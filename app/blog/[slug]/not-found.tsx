import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Post not found
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        Sorry, we couldn't find the post you're looking for.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center text-sm font-medium text-foreground hover:text-foreground/80"
      >
        ← Back to blog
      </Link>
    </div>
  );
}
