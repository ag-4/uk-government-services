import express from 'express';
import { cache } from '../server';

const router = express.Router();

// Mock news data
const mockNews = [
  {
    id: 'news001',
    title: 'Parliament Debates New Digital Rights Bill',
    summary: 'MPs discuss comprehensive digital privacy legislation.',
    content: 'The House of Commons today began debates on the Digital Rights and Privacy Bill...',
    category: 'Technology',
    publishedAt: new Date().toISOString(),
    source: 'Parliament.uk',
    url: 'https://parliament.uk/news/digital-rights-bill'
  }
];

// GET /api/news - Get latest news
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const cacheKey = 'latest_news';
    let news = cache.get(cacheKey);

    if (!news) {
      news = mockNews;
      cache.set(cacheKey, news, 600); // Cache for 10 minutes
    }

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

export default router;
