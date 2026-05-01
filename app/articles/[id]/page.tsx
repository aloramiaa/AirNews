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
      <div className="single-container single-not-found">
        <h2 className="single-title">
          Article Not Found
        </h2>
        <p className="single-not-found-text">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link href="/" className="btn">
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
    <article className="single-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={18} />
        Back to News
      </Link>

      <header className="single-header">
        <div className="article-tags">
          {tagArray.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="single-title">
          {article.rewritten_headline}
        </h1>

        <div className="single-meta">
          <div className="single-meta-item">
            <Clock size={16} />
            <time>{timeAgo}</time>
          </div>
          {article.published_date && (
            <span className="single-meta-item">
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
        <div className="single-image-wrapper">
          <Image
            src={article.image_url}
            alt={article.rewritten_headline}
            fill
            className="single-image"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 768px"
          />
        </div>
      )}

      <div className="single-summary">
        {article.rewritten_summary}
      </div>

      <div className="single-body">
        {bodyParagraphs.map((paragraph, idx) => (
          <p key={idx}>
            {paragraph.trim()}
          </p>
        ))}
      </div>


    </article>
  );
}
