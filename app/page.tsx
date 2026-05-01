import { getArticles } from '@/lib/api';
import { HomeClient } from '@/components/HomeClient';

interface HomePageProps {
  searchParams: Promise<{ q?: string; feed?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.q;
  const feedType = (params.feed === 'international' ? 'international' : 'india') as 'india' | 'international';

  const { articles } = await getArticles(1, feedType, searchQuery);

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-10 max-md:py-6 max-md:px-4 max-[480px]:py-4 max-[480px]:px-3">
      {/* Feed control moved to header to avoid duplicate controls */}
      <HomeClient initialArticles={articles} feedType={feedType} searchQuery={searchQuery} />
    </div>
  );
}
