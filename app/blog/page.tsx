import { allPosts } from "contentlayer/generated";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog posts",
  description: "blog postas",
};

const BlogPage = () => {
  console.log(allPosts);

  return (
    <section>
      <h1 className="mb-5 font-serif text-3xl font-bold">Blog</h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) {
            return -1;
          }
          return 1;
        })
        .map((post) => {
          console.log(`slug A ${post.slug}`);

          return (
            <Link
              key={post.slug}
              className="mb-4 flex flex-col space-y-1"
              href={`/blog/${post.slug}`}
            >
              <div className="flex w-full flex-col">
                <p>{post.title}</p>
                {/* <ViewCounter slug={post.slug} trackView={false} /> */}
              </div>
            </Link>
          );
        })}
    </section>
  );
};

export default BlogPage;
