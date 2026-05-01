export interface Article {
  id: string;
  original_title: string;
  original_url: string;
  original_source?: string;
  published_date?: string;
  image_url: string;
  rewritten_headline: string;
  rewritten_summary: string;
  rewritten_body?: string;
  tags: string[] | string;
  processed_at: string;
}

export interface ArticlePreview {
  id: string;
  original_title: string;
  original_url: string;
  image_url: string;
  rewritten_headline: string;
  rewritten_summary: string;
  tags: string[] | string;
  processed_at: string;
}
