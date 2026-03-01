import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { draftClient } from "@/sanity/lib/draftClient";
import { postsQuery } from "@/sanity/lib/queries";
import { imageUrl } from "@/sanity/lib/image";
import { Post } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tutorials, and product updates from the SaaSify team.",
};

// Revalidate every 60 seconds so new posts show without redeploying
export const revalidate = 60;

export default async function BlogPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const sanityClient = isDraftMode ? draftClient : client;

  let posts: Post[] = [];
  try {
    posts = await sanityClient.fetch(postsQuery);
  } catch {
    // Sanity not configured yet
  }

  const [featured, ...rest] = posts;

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-5xl font-bold text-gray-900">From the team</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl">
            Insights, tutorials, and product updates to help you build better products.
          </p>
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-16">
            {/* Featured post — larger card */}
            {featured && <FeaturedPost post={featured} />}

            {/* Rest of posts — grid */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-8">More posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="group grid md:grid-cols-2 gap-8 items-center bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {post.mainImage ? (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl(post.mainImage).width(800).height(600).url()}
            alt={post.mainImage.alt || post.title}
            width={800}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-violet-50 to-indigo-100" />
      )}
      <div className="p-8 md:p-10">
        <span className="inline-block bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Featured
        </span>
        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-3 leading-snug">
          {post.title}
        </h2>
        {post.excerpt && <p className="text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>}
        <div className="flex items-center gap-3">
          {post.author?.image && (
            <Image
              src={imageUrl(post.author.image).width(32).height(32).url()}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          )}
          <div className="text-sm text-gray-500">
            {post.author && <span className="font-medium text-gray-900">{post.author.name} · </span>}
            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {post.mainImage ? (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl(post.mainImage).width(600).height(340).url()}
            alt={post.mainImage.alt || post.title}
            width={600}
            height={340}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-violet-50 to-indigo-100" />
      )}
      <div className="p-6 flex flex-col flex-1">
        {post.publishedAt && (
          <p className="text-xs text-gray-400 mb-2">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 leading-snug flex-1">
          {post.title}
        </h3>
        {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mt-2">{post.excerpt}</p>}
        {post.author && (
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
            by {post.author.name}
          </p>
        )}
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-28 border-2 border-dashed border-gray-200 rounded-3xl">
      <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
      <p className="text-gray-400 mb-6">Create your first blog post in Sanity Studio.</p>
      <Link href="/studio" className="inline-flex items-center gap-2 bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-violet-500 transition-colors">
        Open Studio →
      </Link>
    </div>
  );
}
