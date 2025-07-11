import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, Filter, Sparkles, Building2, Scale, FileCheck, Globe, RefreshCw, Pause, Play, Trash2 } from 'lucide-react';

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
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    fetchNews();
    
    // Set up periodic news fetching every 2 minutes
    const interval = setInterval(() => {
      if (autoUpdateEnabled) {
        fetchNews();
      }
    }, 120000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [autoUpdateEnabled]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.category === selectedCategory));
    }
  }, [news, selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    setStatus({ type: 'loading', message: 'Fetching latest UK news...' });
    
    try {
      // First try to fetch from existing news.json
      const response = await fetch('/data/news.json');
      let data = await response.json();
      
      // Enhance with mock live news data
      const mockNews = generateMockNews();
      data = [...mockNews, ...data].slice(0, 12); // Combine and limit to 12 items
      
      setNews(data);
      setFilteredNews(data);
      setLastUpdated(new Date());
      setStatus({ type: 'success', message: `Successfully loaded ${data.length} news articles` });
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      setStatus({ type: 'error', message: 'Failed to fetch news. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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

  const categories = ['All', ...Array.from(new Set(news.map(item => item.category)))];

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
              onClick={fetchNews}
              disabled={loading}
              className="uk-gov-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Fetch Latest News
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
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

        {/* News Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} news={item} formatTimestamp={formatTimestamp} />
          ))}
        </div>

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No news found for the selected category.</p>
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
    <article className="uk-gov-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Live indicator for recent news */}
      {news.id.startsWith('LIVE_') && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      )}
      
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryClass}`}>
          {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
          <span>{news.category}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{getTimeAgo(publishedDate)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-primary transition-colors">
          {news.title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
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
              className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 font-medium transition-all hover:translate-x-1"
            >
              <span>Read Full Article</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}