'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArticlePreview } from '@/types/article';

interface HomeClientProps {
  initialArticles: ArticlePreview[];
  feedType: 'india' | 'international';
  searchQuery?: string;
}

export function HomeClient({ initialArticles, feedType, searchQuery }: HomeClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticlePreview[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length === 15);
  const [currentPage, setCurrentPage] = useState(1);
  const [breakingNews, setBreakingNews] = useState<{ id: string; rewritten_headline: string } | null>(null);
  const [showBreakingAlert, setShowBreakingAlert] = useState(false);

  // Subscribe to real-time breaking news
  useEffect(() => {
    const channel = supabase
      .channel('public:articles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'articles' }, (payload) => {
        const newArticle = payload.new as { id: string; rewritten_headline: string };
        setBreakingNews(newArticle);
        setShowBreakingAlert(true);
        setTimeout(() => setShowBreakingAlert(false), 5000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMore = useCallback(async () => {
    setLoading(true);
    const nextPage = currentPage + 1;
    const ITEMS_PER_PAGE = 15;
    const from = (nextPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      let query = supabase
        .from('articles')
        .select('id, original_title, original_url, image_url, rewritten_headline, rewritten_summary, tags, processed_at')
        .order('processed_at', { ascending: false })
        .range(from, to);

      if (searchQuery) {
        query = query.ilike('rewritten_headline', `%${searchQuery}%`);
      } else if (feedType === 'india') {
        query = query.ilike('original_url', '%/india/%');
      } else {
        query = query.not('original_url', 'ilike', '%/india/%');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const typedData = data as ArticlePreview[];
        const existingIds = new Set(articles.map((a) => a.id));
        const newUnique = typedData.filter((a) => !existingIds.has(a.id));
        setArticles((prev) => [...prev, ...newUnique]);
        setHasMore(typedData.length === ITEMS_PER_PAGE);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [articles, currentPage, feedType, searchQuery]);

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

  return (
    <>
      {showBreakingAlert && breakingNews && (
        <div className="breaking-banner" onClick={() => router.push(`/articles/${breakingNews.id}`)}>
          <span className="breaking-label">Breaking</span>
          <span className="breaking-title">{breakingNews.rewritten_headline}</span>
          <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </div>
      )}

      {searchQuery ? (
        <>
          <div className="section-header">
            <h2>Search Results for "{searchQuery}"</h2>
          </div>

          {articles.length === 0 ? (
            <div className="empty-state">No articles found matching your search.</div>
          ) : (
            <div className="sub-grid" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
              {articles.map((article) => (
                <Link href={`/articles/${article.id}`} key={article.id} className="article-item">
                  {article.image_url && (
                    <div className="article-thumb-wrapper" style={{ height: '220px' }}>
                      <Image
                        src={article.image_url}
                        alt={article.rewritten_headline}
                        fill
                        className="article-thumb"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <div className="article-meta">
                      <span className="article-tag">{getTags(article.tags)[0]}</span>
                      {article.processed_at && (
                        <span>{formatDistanceToNow(new Date(article.processed_at), { addSuffix: true })}</span>
                      )}
                    </div>
                    <h3 className="article-title">{article.rewritten_headline}</h3>
                    <p className="article-summary">{article.rewritten_summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="pagination">
              <button className="btn" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More Stories'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {articles.length === 0 ? null : (() => {
            const featured = articles[0];
            const sidebars = articles.slice(1, 4);
            const remaining = articles.slice(4);

            return (
              <>
                <div className="news-grid">
                  <div className="main-col">
                    {featured && (
                      <Link href={`/articles/${featured.id}`} className="featured-article">
                        {featured.image_url && (
                          <div className="image-wrapper">
                            <Image
                              src={featured.image_url}
                              alt="Featured"
                              fill
                              className="featured-image"
                              priority
                              sizes="(max-width: 1024px) 100vw, 70vw"
                            />
                          </div>
                        )}
                        <div className="article-meta">
                          <span className="article-tag">{getTags(featured.tags)[0]}</span>
                          {featured.processed_at && (
                            <span>{formatDistanceToNow(new Date(featured.processed_at), { addSuffix: true })}</span>
                          )}
                        </div>
                        <h1 className="featured-title">{featured.rewritten_headline}</h1>
                        <p className="featured-summary">{featured.rewritten_summary}</p>
                      </Link>
                    )}
                  </div>

                  <div className="sidebar">
                    <div className="section-header" style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                      <h2>Trending</h2>
                    </div>
                    {sidebars.map((article) => (
                      <Link href={`/articles/${article.id}`} key={article.id} className="article-item">
                        {article.image_url && (
                          <div className="article-thumb-wrapper">
                            <Image
                              src={article.image_url}
                              alt="Thumbnail"
                              fill
                              className="article-thumb"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="article-content">
                          <div className="article-meta" style={{ marginTop: '0.5rem' }}>
                            <span className="article-tag">{getTags(article.tags)[0]}</span>
                          </div>
                          <h3 className="article-title">{article.rewritten_headline}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {remaining.length > 0 && (
                  <div className="sub-grid">
                    {remaining.map((article) => (
                      <Link href={`/articles/${article.id}`} key={article.id} className="article-item">
                        <div className="article-item-row">
                          {article.image_url && (
                            <div className="article-thumb-wrapper">
                              <Image
                                src={article.image_url}
                                alt="Thumbnail"
                                fill
                                className="article-thumb"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          <div className="article-content">
                            <div className="article-meta">
                              {article.processed_at && (
                                <span>{formatDistanceToNow(new Date(article.processed_at), { addSuffix: true })}</span>
                              )}
                            </div>
                            <h3 className="article-title">{article.rewritten_headline}</h3>
                            <p className="article-summary" style={{ WebkitLineClamp: 3 }}>{article.rewritten_summary}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="pagination">
                    <button className="btn" onClick={loadMore} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More Stories'}
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </>
      )}
    </>
  );
}
