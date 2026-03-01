import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { draftClient } from "@/sanity/lib/draftClient";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import { imageUrl } from "@/sanity/lib/image";
import { Post } from "@/types";

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await client.fetch(postBySlugQuery, { slug });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const sanityClient = isDraftMode ? draftClient : client;
  const post: Post | null = await sanityClient.fetch(postBySlugQuery, { slug });
  if (!post) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-12">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            {post.author?.image && (
              <Image
                src={imageUrl(post.author.image).width(48).height(48).url()}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            )}
            <div>
              {post.author && <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>}
              {post.publishedAt && (
                <time className="text-sm text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              )}
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.mainImage && (
          <div className="mb-14 rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100">
            <Image
              src={imageUrl(post.mainImage).width(1200).height(675).url()}
              alt={post.mainImage.alt || post.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        {post.body && (
          <div className="prose prose-lg max-w-none text-gray-700">
            <PortableText
              value={post.body}
              components={{
                block: {
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-5">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
                  normal: ({ children }) => <p className="mb-6 leading-8 text-gray-600">{children}</p>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-violet-400 pl-6 italic text-gray-500 my-8 text-lg">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => <ul className="list-disc list-outside pl-5 mb-6 space-y-2 text-gray-600">{children}</ul>,
                  number: ({ children }) => <ol className="list-decimal list-outside pl-5 mb-6 space-y-2 text-gray-600">{children}</ol>,
                },
                marks: {
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-100 text-violet-700 text-sm px-1.5 py-0.5 rounded font-mono">{children}</code>,
                  link: ({ value, children }) => (
                    <a href={value?.href} className="text-violet-600 underline underline-offset-2 hover:text-violet-500" target={value?.blank ? "_blank" : "_self"} rel={value?.blank ? "noopener noreferrer" : undefined}>
                      {children}
                    </a>
                  ),
                },
                types: {
                  image: ({ value }) => (
                    <figure className="my-10">
                      <div className="rounded-2xl overflow-hidden bg-gray-100">
                        <Image src={imageUrl(value).width(900).url()} alt={value.alt || ""} width={900} height={500} className="w-full" />
                      </div>
                      {value.alt && <figcaption className="text-center text-sm text-gray-400 mt-3">{value.alt}</figcaption>}
                    </figure>
                  ),
                },
              }}
            />
          </div>
        )}

        {/* Author bio */}
        {post.author?.bio && (
          <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-5">
            {post.author.image && (
              <Image src={imageUrl(post.author.image).width(64).height(64).url()} alt={post.author.name} width={64} height={64} className="rounded-full object-cover shrink-0" />
            )}
            <div>
              <p className="font-semibold text-gray-900 mb-1">About {post.author.name}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-500">
            ← All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
