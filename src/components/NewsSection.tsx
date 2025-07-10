import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, Filter, Sparkles, Building2, Scale, FileCheck, Globe } from 'lucide-react';

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
}

const categoryIcons = {
  'Parliament': Building2,
  'New Laws': Scale,
  'Proposed Laws': FileCheck,
  'General Politics': Globe,
};

const categoryColors = {
  'Parliament': 'news-category-parliament',
  'New Laws': 'news-category-new-laws',
  'Proposed Laws': 'news-category-proposed-laws',
  'General Politics': 'news-category-general-politics',
};

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    
    // Set up periodic news fetching every 2 minutes
    const interval = setInterval(fetchNews, 120000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.category === selectedCategory));
    }
  }, [news, selectedCategory]);

  const fetchNews = async () => {
    try {
      const response = await fetch('/data/news.json');
      const data = await response.json();
      setNews(data);
      setFilteredNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
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
            <span>AI-Powered Summaries</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            British Government News & Updates
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with concise, AI-generated summaries of parliamentary sessions, 
            new legislation, and important political developments.
          </p>
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

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No news found for the selected category.</p>
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

  return (
    <article className="uk-gov-card hover:shadow-lg transition-shadow">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryClass}`}>
          {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
          <span>{news.category}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formatTimestamp(news.timestamp)}</span>
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
              className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 font-medium"
            >
              <span>Read more</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}