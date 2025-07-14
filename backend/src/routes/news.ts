import express from 'express';
import axios from 'axios';
import { cache } from '../server';
import fs from 'fs';
import path from 'path';
// import { parseStringPromise } from 'xml2js'; // Will implement simple XML parsing

const router = express.Router();

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  source: string;
  category: string;
  url: string;
  imageUrl?: string;
  tags: string[];
  author?: string;
  department?: string;
}

// Generate fallback news data programmatically
function generateFallbackNews(): NewsArticle[] {
  const currentDate = new Date().toISOString();
  return [
    {
      id: 'fallback-1',
      title: 'Government Services Update',
      summary: 'Latest updates on government digital services and citizen engagement platforms.',
      content: 'The government continues to improve digital services for citizens across the UK.',
      publishedAt: currentDate,
      source: 'Gov.uk',
      category: 'Digital Services',
      url: 'https://www.gov.uk/government/news',
      tags: ['digital', 'services', 'government'],
      department: 'Cabinet Office'
    },
    {
      id: 'fallback-2',
      title: 'Parliamentary Updates',
      summary: 'Recent parliamentary proceedings and legislative updates.',
      content: 'Parliament continues its work on important legislation affecting citizens.',
      publishedAt: currentDate,
      source: 'Parliament.uk',
      category: 'Parliament',
      url: 'https://www.parliament.uk/business/news/',
      tags: ['parliament', 'legislation', 'updates'],
      department: 'Parliament'
    }
  ];
}

// Fetch news from multiple open sources
async function fetchNewsFromOpenSources(): Promise<NewsArticle[]> {
  const allNews: NewsArticle[] = [];
  
  try {
    // 1. Gov.UK RSS feeds
    const govukNews = await fetchNewsFromGovUK();
    allNews.push(...govukNews);
    
    // 2. Parliament.UK news
    const parliamentNews = await fetchNewsFromParliament();
    allNews.push(...parliamentNews);
    
    // 3. BBC Politics RSS (free)
    const bbcNews = await fetchNewsFromBBC();
    allNews.push(...bbcNews);
    
  } catch (error) {
    console.error('Error fetching news from open sources:', error);
  }
  
  // Sort by date and remove duplicates
  const uniqueNews = removeDuplicateNews(allNews);
  return uniqueNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Fetch news from Gov.uk RSS feeds
async function fetchNewsFromGovUK(): Promise<NewsArticle[]> {
  try {
    const feeds = [
      {
        url: 'https://www.gov.uk/government/publications.atom',
        category: 'Publications',
        source: 'Gov.uk Publications'
      },
      {
        url: 'https://www.gov.uk/government/news.atom',
        category: 'News',
        source: 'Gov.uk News'
      },
      {
        url: 'https://www.gov.uk/government/announcements.atom',
        category: 'Announcements',
        source: 'Gov.uk Announcements'
      }
    ];

    const allArticles: NewsArticle[] = [];

    for (const feed of feeds) {
      try {
        const response = await axios.get(feed.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'UK-Gov-Services-App/1.0'
          }
        });

        // Simple XML parsing fallback
        const xmlData = response.data;
        const entries = parseSimpleAtomFeed(xmlData);

        const articles = entries.slice(0, 20).map((entry: any, index: number) => {
          const id = entry.id?.[0] || `${feed.category.toLowerCase()}-${Date.now()}-${index}`;
          const title = entry.title?.[0]?._ || entry.title?.[0] || 'Untitled';
          const summary = entry.summary?.[0]?._ || entry.summary?.[0] || entry.content?.[0]?._ || '';
          const content = entry.content?.[0]?._ || entry.content?.[0] || summary;
          const publishedAt = entry.published?.[0] || entry.updated?.[0] || new Date().toISOString();
          const url = entry.link?.[0]?.$.href || entry.id?.[0] || '#';
          const author = entry.author?.[0]?.name?.[0] || 'Gov.uk';
          
          // Extract department from categories or author
          let department = 'Government';
          if (entry.category) {
            const categories = Array.isArray(entry.category) ? entry.category : [entry.category];
            const deptCategory = categories.find((cat: any) => cat.$.term?.includes('department') || cat.$.term?.includes('ministry'));
            if (deptCategory) {
              department = deptCategory.$.term;
            }
          }

          // Generate tags from title and summary
          const tags = extractTags(title + ' ' + summary);

          return {
            id: id.replace(/[^a-zA-Z0-9-]/g, '-'),
            title: cleanText(title),
            summary: cleanText(summary).substring(0, 300),
            content: cleanText(content),
            publishedAt,
            source: feed.source,
            category: feed.category,
            url,
            author,
            department,
            tags,
            imageUrl: '/images/gov-uk-logo.png'
          };
        });

        allArticles.push(...articles);
      } catch (feedError) {
        console.error(`Error fetching ${feed.source}:`, feedError);
      }
    }

    // Sort by published date (newest first)
    return allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error fetching news from Gov.uk:', error);
    return [];
  }
}

// Fetch news from Parliament.UK
async function fetchNewsFromParliament(): Promise<NewsArticle[]> {
  try {
    // Generate parliamentary news items
    return [
      {
        id: `parl_${Date.now()}`,
        title: 'Parliamentary Business Update',
        summary: 'Latest updates from the Houses of Parliament',
        content: 'Stay informed about the latest parliamentary business, debates, and legislative updates.',
        publishedAt: new Date().toISOString(),
        source: 'Parliament.UK',
        category: 'Parliament',
        url: 'https://www.parliament.uk/business/news/',
        author: 'Parliamentary Communications',
        department: 'Parliament',
        tags: ['parliament', 'uk', 'legislation'],
        imageUrl: '/images/parliament-logo.png'
      }
    ];
  } catch (error) {
    console.error('Error fetching news from Parliament:', error);
    return [];
  }
}

// Fetch BBC Politics RSS (free)
async function fetchNewsFromBBC(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('http://feeds.bbci.co.uk/news/politics/rss.xml', {
      timeout: 10000,
      headers: {
        'User-Agent': 'UK-Gov-Services-App/1.0'
      }
    });
    
    const entries = parseSimpleAtomFeed(response.data);
    return entries.slice(0, 15).map((entry: any, index: number) => ({
      id: `bbc_${index}_${Date.now()}`,
      title: cleanText(entry.title?.[0] || 'BBC Politics News'),
      summary: cleanText(entry.description?.[0] || entry.summary?.[0] || ''),
      content: cleanText(entry.description?.[0] || entry.summary?.[0] || ''),
      publishedAt: entry.pubDate?.[0] || entry.published?.[0] || new Date().toISOString(),
      source: 'BBC Politics',
      category: 'Politics',
      url: entry.link?.[0] || '',
      author: 'BBC News',
      department: 'BBC',
      tags: ['politics', 'bbc', 'news'],
      imageUrl: '/images/bbc-logo.png'
    }));
  } catch (error) {
    console.error('Error fetching news from BBC:', error);
    return [];
  }
}

// Remove duplicate news articles
function removeDuplicateNews(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    const key = article.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Clean HTML/XML text
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Simple Atom feed parser (fallback for xml2js)
function parseSimpleAtomFeed(xmlData: string): any[] {
  try {
    const entries: any[] = [];
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xmlData)) !== null) {
      const entryXml = match[1];
      
      const entry = {
        id: [extractXmlValue(entryXml, 'id')],
        title: [extractXmlValue(entryXml, 'title')],
        summary: [extractXmlValue(entryXml, 'summary')],
        content: [extractXmlValue(entryXml, 'content')],
        published: [extractXmlValue(entryXml, 'published')],
        updated: [extractXmlValue(entryXml, 'updated')],
        link: [{ $: { href: extractXmlAttribute(entryXml, 'link', 'href') } }],
        author: [{ name: [extractXmlValue(entryXml, 'name')] }],
        category: extractXmlCategories(entryXml)
      };
      
      entries.push(entry);
    }
    
    return entries;
  } catch (error) {
    console.error('Error parsing Atom feed:', error);
    return [];
  }
}

// Extract XML element value
function extractXmlValue(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\s\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
}

// Extract XML attribute value
function extractXmlAttribute(xml: string, tagName: string, attrName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*${attrName}=["']([^"']*)["'][^>]*>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

// Extract categories from XML
function extractXmlCategories(xml: string): any[] {
  const categories: any[] = [];
  const categoryRegex = /<category[^>]*term=["']([^"']*)["'][^>]*>/g;
  let match;
  
  while ((match = categoryRegex.exec(xml)) !== null) {
    categories.push({ $: { term: match[1] } });
  }
  
  return categories;
}

// Extract relevant tags from text
function extractTags(text: string): string[] {
  const keywords = [
    'housing', 'health', 'education', 'transport', 'economy', 'brexit', 'immigration',
    'environment', 'energy', 'defence', 'justice', 'welfare', 'tax', 'budget',
    'parliament', 'legislation', 'bill', 'policy', 'announcement', 'consultation'
  ];
  
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword));
}

// Get news with fallback strategy
async function getNews(): Promise<NewsArticle[]> {
  const cacheKey = 'aggregated_news';
  let news = cache.get(cacheKey) as NewsArticle[];

  if (!news) {
    // Try open sources first
    news = await fetchNewsFromOpenSources();
    
    // If all sources fail, use programmatic fallback data
    if (news.length === 0) {
      console.log('All news sources unavailable, using fallback news data');
      news = generateFallbackNews();
    }
    
    // Cache for 30 minutes
    cache.set(cacheKey, news, 1800);
  }

  return news;
}

// GET /api/news - Get latest news
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { category, source, limit = 50, offset = 0, search } = req.query;
    
    let news = await getNews();
    
    // Apply filters
    if (category && typeof category === 'string') {
      news = news.filter(article => 
        article.category.toLowerCase() === category.toLowerCase() ||
        article.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
    }
    
    if (source && typeof source === 'string') {
      news = news.filter(article => 
        article.source.toLowerCase().includes(source.toLowerCase())
      );
    }
    
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      news = news.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply pagination
    const total = news.length;
    const startIndex = parseInt(offset as string) || 0;
    const limitNum = Math.min(parseInt(limit as string) || 50, 100);
    const paginatedNews = news.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedNews,
      pagination: {
        total,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < total
      },
      filters: {
        category,
        source,
        search
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news'
    });
  }
});

// GET /api/news/:id - Get specific news article
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const news = await getNews();
    const article = news.find(item => item.id === id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'News article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news article'
    });
  }
});

// GET /api/news/categories - Get available news categories
router.get('/meta/categories', async (req: express.Request, res: express.Response) => {
  try {
    const news = await getNews();
    const categories = [...new Set(news.map(article => article.category))];
    const tags = [...new Set(news.flatMap(article => article.tags))];
    
    res.json({
      success: true,
      data: {
        categories,
        tags
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

export default router;
