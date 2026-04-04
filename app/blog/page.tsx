import { allPosts } from "content-collections";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and building products people return to.",
  canonical: "https://milind.app/blog",
});

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Milind Mishra - Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and building products people return to.",
  url: "https://milind.app/blog",
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milind.app",
  },
};

const author = {
  name: "Milind Mishra",
  role: "Product Engineer",
  href: "https://milind.app",
  imageUrl: "https://avatars.githubusercontent.com/u/28717686?v=4",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const filteredPosts = category
    ? sortedPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase(),
      )
    : sortedPosts;

  const posts = filteredPosts.map((post) => ({
    id: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    description: post.description,
    date: formatDate(post.date),
    datetime: post.date,
    category: {
      title: post.category,
      href: `/blog?category=${post.category.toLowerCase()}`,
    },
    author,
  }));

  const categories = [...new Set(allPosts.map((post) => post.category))];

  return (
    <>
      <JsonLd data={blogSchema} />

      <div className="py-12 sm:py-16">
        <header className="pb-12 sm:pb-14">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Blog
          </p>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl sm:max-w-[30ch]">
                {category
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles`
                  : "Notes on building products."}
              </h1>
              <p className="mt-5 text-base text-pretty text-muted-foreground sm:text-lg sm:max-w-[48ch]">
                {category
                  ? `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? "post" : "posts"} in ${category}.`
                  : "Product engineering, AI interfaces, developer tools, and the craft of making things people return to."}
              </p>
            </div>
            {category ? (
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-fit",
                )}
              >
                All posts
              </Link>
            ) : null}
          </div>

          {!category && categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${cat.toLowerCase()}`}
                  className="inline-flex rounded-full bg-muted/50 px-3 py-1 text-sm font-medium hover:bg-muted hover:text-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </header>

        <section className="divide-y divide-border">
          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                No posts found in this category.
              </p>
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-8",
                )}
              >
                View all posts
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="group py-8 sm:grid sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-10"
              >
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground sm:mb-0 sm:flex-col sm:items-start sm:gap-3">
                  <time dateTime={post.datetime}>{post.date}</time>
                  <Link
                    href={post.category.href}
                    className="inline-flex rounded-full bg-muted/50 px-3 py-1 text-sm font-medium hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    {post.category.title}
                  </Link>
                </div>
                <div className="relative">
                  <h2 className="text-xl font-semibold tracking-tight text-balance text-foreground group-hover:text-foreground/75 sm:text-2xl">
                    <Link
                      href={post.href}
                      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm text-pretty text-muted-foreground sm:text-base sm:max-w-[56ch]">
                    {post.description}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                    <Image
                      alt={post.author.name}
                      src={post.author.imageUrl}
                      width={24}
                      height={24}
                      className="size-6 rounded-full bg-muted/70 outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
                    />
                    <div className="flex items-center gap-2">
                      <span>{post.author.name}</span>
                      <span className="text-muted-foreground/50">/</span>
                      <span className="text-muted-foreground/70">
                        {post.author.role}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </>
  );
}
