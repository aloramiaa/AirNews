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
        <div className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] text-white py-2.5 px-10 flex items-center gap-6 text-[0.95rem] font-medium cursor-pointer animate-[slideDown_0.4s_cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:[&_.breaking-title]:translate-x-[5px] max-[480px]:py-2 max-[480px]:px-3 max-[480px]:gap-2 max-[480px]:text-[0.82rem]" onClick={() => router.push(`/articles/${breakingNews.id}`)}>
          <span className="font-extrabold uppercase tracking-[0.1em] bg-white text-[var(--accent-color)] py-1 px-3 rounded-[50px] text-[0.75rem] shadow-[0_2px_4px_rgba(0,0,0,0.1)] shrink-0 max-[480px]:text-[0.65rem] max-[480px]:px-2 max-[480px]:py-0.5">Breaking</span>
          <span className="transition-transform duration-200 overflow-hidden text-ellipsis line-clamp-2 max-[480px]:whitespace-normal breaking-title">{breakingNews.rewritten_headline}</span>
          <ArrowRight size={16} className="ml-auto" />
        </div>
      )}

      {searchQuery ? (
        <>
          <div className="border-b border-[var(--border-color)] mb-6 pb-3">
            <h2 className="font-sans text-[0.9rem] font-extrabold uppercase tracking-[0.16em]">Search Results for "{searchQuery}"</h2>
          </div>

          {articles.length === 0 ? (
            <div className="py-16 px-4 text-center text-[var(--text-secondary)] text-[1.05rem]">No articles found matching your search.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mt-10 max-md:grid-cols-1 border-t-0 mt-0 pt-0">
              {articles.map((article) => (
                <Link href={`/articles/${article.id}`} key={article.id} className="flex flex-col gap-3 text-inherit max-[480px]:py-4 max-[480px]:px-2">
                  {article.image_url && (
                    <div className="relative w-full h-[170px] rounded-[14px] overflow-hidden bg-[var(--bg-tertiary)] max-md:h-[220px] h-[220px] group">
                      <Image
                        src={article.image_url}
                        alt={article.rewritten_headline}
                        fill
                        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                      <span className="text-[var(--accent-color)]">{getTags(article.tags)[0]}</span>
                      {article.processed_at && (
                        <span>{formatDistanceToNow(new Date(article.processed_at), { addSuffix: true })}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-[1.5rem] leading-[1.2] tracking-[-0.02em] max-[480px]:text-[1.25rem]">{article.rewritten_headline}</h3>
                    <p className="line-clamp-2 text-[var(--text-secondary)] text-[0.98rem] leading-[1.7] mt-2.5">{article.rewritten_summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-10 max-[480px]:mt-12 max-[480px]:pt-8">
              <button className="border-none bg-[var(--accent-color)] text-white py-3 px-6 rounded-full font-sans font-bold cursor-pointer shadow-[var(--shadow-md)] transition-all duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-[1px] disabled:opacity-65 disabled:cursor-wait" onClick={loadMore} disabled={loading}>
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
                <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(300px,1fr)] gap-8 items-start max-[1100px]:grid-cols-1 max-md:grid-cols-1">
                  <div className="min-w-0">
                    {featured && (
                      <Link href={`/articles/${featured.id}`} className="flex flex-col gap-4">
                        {featured.image_url && (
                          <div className="relative w-full h-[clamp(320px,52vw,560px)] rounded-[18px] overflow-hidden shadow-[var(--shadow-lg)] bg-[var(--bg-tertiary)] group">
                            <Image
                              src={featured.image_url}
                              alt="Featured"
                              fill
                              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                              priority
                              sizes="(max-width: 1024px) 100vw, 70vw"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mb-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                          <span className="text-[var(--accent-color)]">{getTags(featured.tags)[0]}</span>
                          {featured.processed_at && (
                            <span>{formatDistanceToNow(new Date(featured.processed_at), { addSuffix: true })}</span>
                          )}
                        </div>
                        <h1 className="font-serif text-[clamp(2.6rem,4vw,4.6rem)] leading-[1.1] tracking-[-0.04em] mt-1.5 max-md:text-[clamp(2.1rem,8vw,3rem)] max-[480px]:text-[1.7rem] max-[360px]:text-[1.5rem]">{featured.rewritten_headline}</h1>
                        <p className="text-[1.05rem] leading-[1.8] text-[var(--text-secondary)] max-w-[68ch] max-md:text-[1rem] max-[480px]:text-[1.05rem]">{featured.rewritten_summary}</p>
                      </Link>
                    )}
                  </div>

                  <div className="border-l border-[var(--border-color)] pl-8 min-w-0 max-[1100px]:border-l-0 max-[1100px]:pl-0 max-[1100px]:border-t max-[1100px]:pt-6 max-md:border-l-0 max-md:pl-0 max-md:border-t max-md:pt-6">
                    <div className="border-b border-[var(--border-color)] mb-6 pb-2">
                      <h2 className="font-sans text-[0.9rem] font-extrabold uppercase tracking-[0.16em]">Trending</h2>
                    </div>
                    {sidebars.map((article) => (
                      <Link href={`/articles/${article.id}`} key={article.id} className="flex flex-col gap-3 text-inherit mb-8 last:mb-0 max-[480px]:py-4 max-[480px]:px-2">
                        {article.image_url && (
                          <div className="relative w-full h-[160px] rounded-[14px] overflow-hidden bg-[var(--bg-tertiary)] group max-md:h-[220px]">
                            <Image
                              src={article.image_url}
                              alt="Thumbnail"
                              fill
                              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)] mt-2">
                            <span className="text-[var(--accent-color)]">{getTags(article.tags)[0]}</span>
                          </div>
                          <h3 className="font-serif text-[1.1rem] leading-[1.2] tracking-[-0.02em] max-[480px]:text-[1.25rem]">{article.rewritten_headline}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {remaining.length > 0 && (
                  <div className="grid grid-cols-2 gap-6 mt-10 max-md:grid-cols-1">
                    {remaining.map((article) => (
                      <Link href={`/articles/${article.id}`} key={article.id} className="flex flex-col gap-3 text-inherit max-[480px]:py-4 max-[480px]:px-2">
                        <div className="flex gap-4 items-start max-md:flex-col">
                          {article.image_url && (
                            <div className="relative w-[140px] h-[170px] rounded-[14px] overflow-hidden bg-[var(--bg-tertiary)] group max-md:w-full max-md:h-[220px] shrink-0">
                              <Image
                                src={article.image_url}
                                alt="Thumbnail"
                                fill
                                className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                              {article.processed_at && (
                                <span>{formatDistanceToNow(new Date(article.processed_at), { addSuffix: true })}</span>
                              )}
                            </div>
                            <h3 className="font-serif text-[1.5rem] leading-[1.2] tracking-[-0.02em] max-[480px]:text-[1.25rem]">{article.rewritten_headline}</h3>
                            <p className="line-clamp-2 text-[var(--text-secondary)] text-[0.98rem] leading-[1.7] mt-2.5 max-[480px]:line-clamp-3" style={{ WebkitLineClamp: 3 }}>{article.rewritten_summary}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="flex justify-center mt-10 max-[480px]:mt-12 max-[480px]:pt-8">
                    <button className="border-none bg-[var(--accent-color)] text-white py-3 px-6 rounded-full font-sans font-bold cursor-pointer shadow-[var(--shadow-md)] transition-all duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-[1px] disabled:opacity-65 disabled:cursor-wait" onClick={loadMore} disabled={loading}>
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
