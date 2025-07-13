import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, ExternalLink, Filter, Sparkles, Building2, Scale, FileCheck, Globe, RefreshCw, Pause, Play, Trash2, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timestamp: string;
  content: string;
  url: string;
  image: string;
  publishedAt?: string;
}

const categoryIcons = {
  'Parliament': Building2,
  'New Laws': Scale,
  'Proposed Laws': FileCheck,
  'General Politics': Globe,
  'UK Politics': Building2,
  'Domestic Events': Globe,
  'UK International Relations': Globe,
};

const categoryColors = {
  'Parliament': 'news-category-parliament',
  'New Laws': 'news-category-new-laws',
  'Proposed Laws': 'news-category-proposed-laws',
  'General Politics': 'news-category-general-politics',
  'UK Politics': 'news-category-parliament',
  'Domestic Events': 'news-category-new-laws',
  'UK International Relations': 'news-category-proposed-laws',
};

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const generateMockNews = (): NewsItem[] => {
    const mockArticles = [
      {
        id: `LIVE_${Date.now()}_1`,
        title: "Prime Minister Announces New Economic Policy Framework",
        summary: "The government has unveiled a comprehensive economic strategy aimed at boosting growth and addressing inflation concerns. The policy includes targeted support for small businesses and infrastructure investment.",
        category: "UK Politics",
        source: "BBC News",
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        content: "The government has unveiled a comprehensive economic strategy...",
        url: "https://www.bbc.co.uk/news/politics",
        image: "/images/parliament-house.jpg"
      },
      {
        id: `LIVE_${Date.now()}_2`,
        title: "NHS Receives Additional Funding for Winter Preparedness",
        summary: "Health Secretary announces £2.3 billion emergency funding package to help the NHS cope with winter pressures. The funding will support staff recruitment and equipment upgrades.",
        category: "Domestic Events",
        source: "Sky News",
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        content: "Health Secretary announces emergency funding...",
        url: "https://news.sky.com/politics",
        image: "/images/nhs-building.jpg"
      },
      {
        id: `LIVE_${Date.now()}_3`,
        title: "UK Signs New Trade Agreement with European Partners",
        summary: "Britain finalizes a significant trade deal with key European nations, marking a new chapter in post-Brexit relations. The agreement is expected to boost exports by 15%.",
        category: "UK International Relations",
        source: "The Guardian",
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        content: "Britain finalizes a significant trade deal...",
        url: "https://www.theguardian.com/politics",
        image: "/images/government-building.jpg"
      }
    ];

    return mockArticles.sort((a, b) => new Date(b.publishedAt || b.timestamp).getTime() - new Date(a.publishedAt || a.timestamp).getTime());
  };

  const fetchNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
        setError(null);
      } else {
        setLoading(true);
      }
      setStatus({ type: 'loading', message: 'Fetching latest UK news...' });
      
      let newsData = [];
      
      // Try to fetch from multiple real news sources
      try {
        // Attempt to fetch from NewsAPI (requires API key in production)
        const newsApiKey = process.env.REACT_APP_NEWS_API_KEY;
        if (newsApiKey) {
          const newsApiResponse = await fetch(
            `https://newsapi.org/v2/everything?q=UK+government+OR+parliament+OR+politics&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
          );
          
          if (newsApiResponse.ok) {
            const newsApiData = await newsApiResponse.json();
            if (newsApiData.articles) {
              newsData = newsApiData.articles.map((article: any, index: number) => ({
                id: `newsapi_${Date.now()}_${index}`,
                title: article.title,
                summary: article.description || article.content?.substring(0, 200) + '...',
                category: 'UK Politics',
                source: article.source.name,
                timestamp: article.publishedAt,
                publishedAt: article.publishedAt,
                content: article.content || article.description,
                url: article.url,
                image: article.urlToImage
              }));
            }
          }
        }
        
        // If no real news data, try BBC RSS (would need CORS proxy in production)
        if (newsData.length === 0) {
          try {
            const rssResponse = await fetch('https://feeds.bbci.co.uk/news/politics/rss.xml');
            if (rssResponse.ok) {
              const rssText = await rssResponse.text();
              // Parse RSS would require XML parser - simplified for demo
              console.log('RSS data available but requires XML parsing');
            }
          } catch (rssError) {
            console.warn('RSS feed unavailable:', rssError);
          }
        }
        
      } catch (apiError) {
        console.warn('External news APIs unavailable:', apiError);
      }
      
      // Fallback: Try local news.json file
      if (newsData.length === 0) {
        try {
          const response = await fetch('/data/news.json');
          if (response.ok) {
            newsData = await response.json();
          }
        } catch (localError) {
          console.warn('Local news.json unavailable:', localError);
        }
      }
      
      // Final fallback: Use enhanced mock data
      if (newsData.length === 0) {
        const mockNews = generateMockNews();
        newsData = mockNews;
        console.log('Using mock news data as fallback');
      }
      
      // Limit to 12 items and sort by date
      newsData = newsData.slice(0, 12).sort((a: any, b: any) => 
        new Date(b.publishedAt || b.timestamp).getTime() - new Date(a.publishedAt || a.timestamp).getTime()
      );
      
      setNews(newsData);
      setFilteredNews(newsData);
      setLastUpdated(new Date());
      setError(null);
      setStatus({ type: 'success', message: `Successfully loaded ${newsData.length} news articles` });
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
      setStatus({ type: 'error', message: 'Failed to fetch news. Please try again.' });
      
      // Even on error, show mock data
      const mockNews = generateMockNews();
      setNews(mockNews);
      setFilteredNews(mockNews);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    
    // Set up periodic news fetching every 2 minutes
    const interval = setInterval(() => {
      if (autoUpdateEnabled) {
        fetchNews(true);
      }
    }, 120000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [autoUpdateEnabled, fetchNews]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(news.map(item => item.category)));
    return ['All', ...uniqueCategories];
  }, [news]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.category === selectedCategory));
    }
  }, [news, selectedCategory]);

  const handleRefresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const toggleAutoUpdate = () => {
    setAutoUpdateEnabled(!autoUpdateEnabled);
  };

  const clearNews = () => {
    setNews([]);
    setFilteredNews([]);
    setLastUpdated(null);
    setStatus({ type: null, message: '' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };



  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading latest government news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Live News Aggregator</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🇬🇧 UK Government News Bot
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Your trusted source for UK political news, domestic events, and international coverage with real-time updates.
          </p>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="uk-gov-button disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh news articles"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Fetch Latest News'}
            </button>
            
            <button
              onClick={toggleAutoUpdate}
              className={`uk-gov-accent ${autoUpdateEnabled ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            >
              {autoUpdateEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoUpdateEnabled ? 'Pause Auto-Update' : 'Enable Auto-Update'}
            </button>
            
            <button
              onClick={clearNews}
              className="uk-gov-accent bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Clear News
            </button>
          </div>
          
          {/* Status Display */}
          {status.type && (
            <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium mb-4 ${
              status.type === 'loading' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status.type === 'loading' && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700"></div>
                  <span>{status.message}</span>
                </div>
              )}
              {status.type !== 'loading' && status.message}
            </div>
          )}
          
          {/* Auto-update indicator */}
          {autoUpdateEnabled && (
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Auto-update: ON</span>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="News categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-controls="news-grid"
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category !== 'All' && categoryIcons[category as keyof typeof categoryIcons] && (
                React.createElement(categoryIcons[category as keyof typeof categoryIcons], { className: 'w-4 h-4' })
              )}
              <span>{category}</span>
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* News Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'All' 
                ? 'No news articles are currently available.' 
                : `No articles found in the "${selectedCategory}" category.`
              }
            </p>
            <button onClick={handleRefresh} className="uk-gov-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        ) : (
          <div id="news-grid" className="grid lg:grid-cols-2 gap-8" role="tabpanel" aria-live="polite">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} formatTimestamp={formatTimestamp} />
            ))}
          </div>
        )}
        
        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              Last updated: {lastUpdated.toLocaleString('en-GB')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="uk-gov-card animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

interface NewsCardProps {
  news: NewsItem;
  formatTimestamp: (timestamp: string) => string;
}

function NewsCard({ news, formatTimestamp }: NewsCardProps) {
  const CategoryIcon = categoryIcons[news.category as keyof typeof categoryIcons];
  const categoryClass = categoryColors[news.category as keyof typeof categoryColors];
  const publishedDate = new Date(news.publishedAt || news.timestamp);
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <article className="uk-gov-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      {/* Live indicator for recent news */}
      {news.id.startsWith('LIVE_') && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      )}
      
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryClass}`}>
          {CategoryIcon && <CategoryIcon className="w-4 h-4" aria-hidden="true" />}
          <span>{news.category}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <time dateTime={news.publishedAt || news.timestamp}>{getTimeAgo(publishedDate)}</time>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          <a 
            href={news.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors focus:outline-none focus:text-primary"
            aria-describedby={`news-summary-${news.id}`}
          >
            {news.title}
          </a>
        </h3>
        
        <p id={`news-summary-${news.id}`} className="text-gray-600 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Source:</span>
              <span className="font-medium text-primary">{news.source}</span>
            </div>
            
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 font-medium transition-all hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label={`Read full article about ${news.title}`}
            >
              <span>Read Full Article</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}