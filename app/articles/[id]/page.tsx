import { getArticleById } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    };
  }

  return {
    title: article.rewritten_headline,
    description: article.rewritten_summary,
    openGraph: {
      title: article.rewritten_headline,
      description: article.rewritten_summary,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return (
      <div className="max-w-[820px] mx-auto px-10 text-center py-16 max-md:px-5">
        <h2 className="font-serif text-[2rem] font-extrabold leading-[1.1] mb-4 tracking-[-0.02em] text-[var(--text-primary)]">
          Article Not Found
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link href="/" className="border-none bg-[var(--accent-color)] text-white py-[0.9rem] px-[1.4rem] rounded-[999px] font-sans font-bold cursor-pointer shadow-[var(--shadow-md)] transition-all duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-[1px]">
          Return Home
        </Link>
      </div>
    );
  }

  const getTags = (tags: any): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseBody = (bodyText: string | undefined): string[] => {
    if (!bodyText) return [];
    return bodyText
      .split(/NEWPARA|\n\n/)
      .filter((p) => p.trim().length > 0);
  };

  const timeAgo = formatDistanceToNow(new Date(article.processed_at), {
    addSuffix: true,
  });

  const tagArray = getTags(article.tags);
  const bodyParagraphs = parseBody(article.rewritten_body);

  return (
    <article className="max-w-[820px] mx-auto px-10 max-md:px-5">
      <Link href="/" className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[var(--text-secondary)] mb-10 py-2 px-4 rounded-[50px] bg-[var(--bg-tertiary)] border border-[var(--border-color)] transition-all duration-300 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:-translate-x-1 max-md:text-[0.85rem] max-md:mb-6">
        <ArrowLeft size={18} />
        Back to News
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap gap-2.5 mb-4">
          {tagArray.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="text-[0.75rem] font-bold py-1 px-3 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-[50px] uppercase tracking-[0.05em] transition-all duration-200 border border-transparent hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:-translate-y-0.5">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-[3.8rem] font-extrabold leading-[1.1] mb-6 tracking-[-0.02em] text-[var(--text-primary)] max-md:text-[2.4rem] max-[1100px]:text-[1.8rem] max-[480px]:text-[1.5rem] max-[360px]:text-[1.5rem]">
          {article.rewritten_headline}
        </h1>

        <div className="flex flex-wrap items-center gap-8 text-[0.95rem] text-[var(--text-tertiary)] border-y border-[var(--border-color)] py-5 mb-12 font-medium max-[1100px]:flex-col max-[1100px]:gap-2 max-[1100px]:items-start">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <time>{timeAgo}</time>
          </div>
          {article.published_date && (
            <span className="flex items-center gap-2">
              Published:{' '}
              {new Date(article.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </header>

      {article.image_url && (
        <div className="relative rounded-[16px] overflow-hidden mb-6 shadow-[var(--shadow-lg)] aspect-video min-h-[280px]">
          <Image
            src={article.image_url}
            alt={article.rewritten_headline}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 768px"
          />
        </div>
      )}

      <div className="text-[1.4rem] font-sans text-[var(--text-secondary)] mb-10 leading-[1.6] font-normal border-l-4 border-[var(--accent-color)] pl-6 max-md:text-[1.15rem] max-md:pl-4">
        {article.rewritten_summary}
      </div>

      <div className="text-[1.2rem] font-serif leading-[1.9] text-[var(--text-primary)] break-words [&>p]:mb-7 [&>p:first-child::first-letter]:text-[4rem] [&>p:first-child::first-letter]:font-extrabold [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:leading-[0.85] [&>p:first-child::first-letter]:pr-3 [&>p:first-child::first-letter]:pt-2 [&>p:first-child::first-letter]:text-[var(--accent-color)] max-md:[&>p:first-child::first-letter]:text-[3rem] max-md:[&>p:first-child::first-letter]:pr-2 max-md:[&>p:first-child::first-letter]:pt-1 max-[480px]:[&>p:first-child::first-letter]:text-[2.5rem] max-[480px]:[&>p:first-child::first-letter]:pr-1.5 max-[480px]:[&>p:first-child::first-letter]:pt-1">
        {bodyParagraphs.map((paragraph, idx) => (
          <p key={idx}>
            {paragraph.trim()}
          </p>
        ))}
      </div>


    </article>
  );
}
