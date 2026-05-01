import { supabase } from '@/lib/supabase';
import { Article, ArticlePreview } from '@/types/article';

export async function getArticles(
  pageNumber: number = 1,
  feedType: 'india' | 'international' = 'india',
  searchQuery?: string
): Promise<{ articles: ArticlePreview[]; hasMore: boolean }> {
  const ITEMS_PER_PAGE = 15;
  const from = (pageNumber - 1) * ITEMS_PER_PAGE;
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

    return {
      articles: (data || []) as ArticlePreview[],
      hasMore: (data?.length || 0) === ITEMS_PER_PAGE,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], hasMore: false };
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data || null) as Article | null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
