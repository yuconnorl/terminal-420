/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { allPosts } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({ params }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    console.log("no post");
  }

  console.log(post);

  return (
    <section>
      <h1 className="max-w-[650px] font-serif text-3xl font-bold">
        <Balancer>{post.title}</Balancer>
      </h1>
      <div>{post.date}</div>
    </section>
  );
}
