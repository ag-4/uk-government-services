import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Share2,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Plus,
  Edit,
  Trash2,
  Send,
  BookOpen,
  Award,
  Target,
  Zap,
  Heart,
  Globe,
  Lock,
  Unlock,
  Timer,
  UserCheck,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  lastUpdated: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
  urgent: boolean;
  imageUrl?: string;
  source: string;
  relatedArticles: string[];
}

interface NewsCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
}

const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Mock news data
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'New Digital Services Portal Launches for UK Citizens',
      summary: 'The government announces the launch of a comprehensive digital services portal designed to streamline access to public services.',
      content: 'The UK government has officially launched a new digital services portal that will revolutionize how citizens access public services. This comprehensive platform brings together over 200 government services under one roof, making it easier than ever for citizens to interact with various government departments. The portal features advanced search capabilities, personalized dashboards, and real-time application tracking. Citizens can now apply for passports, driving licenses, benefits, and much more through a single, user-friendly interface. The platform has been designed with accessibility in mind, ensuring that all citizens, regardless of their technical abilities, can easily navigate and use the services.',
      category: 'digital-services',
      author: 'Department for Digital, Culture, Media & Sport',
      publishedDate: '2024-01-15T10:00:00Z',
      lastUpdated: '2024-01-15T10:00:00Z',
      readTime: 5,
      views: 15420,
      likes: 892,
      comments: 156,
      tags: ['Digital Services', 'Government Portal', 'Public Services', 'Technology'],
      featured: true,
      urgent: false,
      source: 'GOV.UK',
      relatedArticles: ['2', '3']
    },
    {
      id: '2',
      title: 'NHS Announces Expansion of Mental Health Services',
      summary: 'Significant investment in mental health support services across England, with new facilities and increased staffing.',
      content: 'The NHS has announced a major expansion of mental health services across England, with a £2.3 billion investment over the next three years. This expansion will include the opening of 50 new mental health facilities, the recruitment of 5,000 additional mental health professionals, and the introduction of innovative digital therapy platforms. The initiative aims to reduce waiting times for mental health services and provide more accessible support for those in need. New services will include specialized support for young people, veterans, and individuals experiencing crisis situations. The expansion also includes enhanced training programs for existing staff and the implementation of new evidence-based treatment approaches.',
      category: 'healthcare',
      author: 'NHS England',
      publishedDate: '2024-01-14T14:30:00Z',
      lastUpdated: '2024-01-14T14:30:00Z',
      readTime: 7,
      views: 23156,
      likes: 1247,
      comments: 289,
      tags: ['NHS', 'Mental Health', 'Healthcare', 'Investment'],
      featured: true,
      urgent: false,
      source: 'NHS England',
      relatedArticles: ['4', '5']
    },
    {
      id: '3',
      title: 'UK Launches Green Energy Initiative for 2024',
      summary: 'Ambitious new renewable energy targets set as part of the UK\'s commitment to net-zero emissions by 2050.',
      content: 'The UK government has unveiled an ambitious green energy initiative for 2024, setting new renewable energy targets as part of its commitment to achieving net-zero emissions by 2050. The initiative includes plans for the construction of 40 new offshore wind farms, significant investments in solar energy infrastructure, and the development of innovative energy storage solutions. The government has allocated £15 billion for this initiative, which is expected to create over 100,000 new jobs in the renewable energy sector. The plan also includes support for households to install solar panels and heat pumps, with grants and subsidies available to make green energy more accessible to all citizens.',
      category: 'environment',
      author: 'Department for Business, Energy & Industrial Strategy',
      publishedDate: '2024-01-13T09:15:00Z',
      lastUpdated: '2024-01-13T09:15:00Z',
      readTime: 6,
      views: 18734,
      likes: 967,
      comments: 203,
      tags: ['Green Energy', 'Environment', 'Net Zero', 'Renewable Energy'],
      featured: false,
      urgent: false,
      source: 'GOV.UK',
      relatedArticles: ['6', '7']
    },
    {
      id: '4',
      title: 'Education Reform: New Curriculum Standards Announced',
      summary: 'Comprehensive updates to the national curriculum focusing on digital literacy and practical skills.',
      content: 'The Department for Education has announced comprehensive reforms to the national curriculum, with new standards that emphasize digital literacy, critical thinking, and practical skills. The updated curriculum will be implemented across all state schools in England starting from September 2024. Key changes include mandatory coding classes from primary school, enhanced focus on financial literacy, and the introduction of climate science as a core subject. The reforms also include new assessment methods that better reflect real-world skills and competencies. Teachers will receive extensive training and support to implement these changes effectively.',
      category: 'education',
      author: 'Department for Education',
      publishedDate: '2024-01-12T11:45:00Z',
      lastUpdated: '2024-01-12T11:45:00Z',
      readTime: 8,
      views: 12456,
      likes: 734,
      comments: 167,
      tags: ['Education', 'Curriculum', 'Digital Literacy', 'Schools'],
      featured: false,
      urgent: false,
      source: 'Department for Education',
      relatedArticles: ['8', '9']
    },
    {
      id: '5',
      title: 'Transport Infrastructure: Major Rail Network Upgrade',
      summary: 'Multi-billion pound investment in rail infrastructure to improve connectivity and reduce journey times.',
      content: 'The government has announced a major upgrade to the UK\'s rail network, with a £25 billion investment program that will significantly improve connectivity and reduce journey times across the country. The upgrade includes the electrification of key routes, the introduction of new high-speed trains, and the modernization of stations and signaling systems. The project is expected to be completed by 2030 and will create thousands of jobs in the construction and engineering sectors. The improvements will particularly benefit northern England and Wales, with new direct services and reduced travel times to major cities.',
      category: 'transport',
      author: 'Department for Transport',
      publishedDate: '2024-01-11T16:20:00Z',
      lastUpdated: '2024-01-11T16:20:00Z',
      readTime: 6,
      views: 9876,
      likes: 543,
      comments: 98,
      tags: ['Transport', 'Rail', 'Infrastructure', 'Investment'],
      featured: false,
      urgent: false,
      source: 'Department for Transport',
      relatedArticles: ['10', '11']
    },
    {
      id: '6',
      title: 'Housing Crisis: New Affordable Housing Program Launched',
      summary: 'Government announces ambitious plan to build 300,000 new affordable homes over the next five years.',
      content: 'In response to the ongoing housing crisis, the government has launched an ambitious affordable housing program aimed at building 300,000 new homes over the next five years. The program includes a mix of social housing, shared ownership properties, and first-time buyer schemes. Local authorities will receive increased funding and powers to acquire land for development, while new planning regulations will streamline the approval process for affordable housing projects. The initiative also includes support for innovative construction methods and sustainable building practices to ensure new homes are energy-efficient and environmentally friendly.',
      category: 'housing',
      author: 'Ministry of Housing, Communities & Local Government',
      publishedDate: '2024-01-10T13:30:00Z',
      lastUpdated: '2024-01-10T13:30:00Z',
      readTime: 7,
      views: 21345,
      likes: 1156,
      comments: 234,
      tags: ['Housing', 'Affordable Housing', 'Social Housing', 'Planning'],
      featured: true,
      urgent: true,
      source: 'GOV.UK',
      relatedArticles: ['12', '13']
    }
  ]);

  const categories: NewsCategory[] = [
    { id: 'all', name: 'All News', description: 'All government news and updates', count: newsArticles.length, color: 'bg-gray-100 text-gray-800' },
    { id: 'digital-services', name: 'Digital Services', description: 'Technology and digital government initiatives', count: newsArticles.filter(a => a.category === 'digital-services').length, color: 'bg-blue-100 text-blue-800' },
    { id: 'healthcare', name: 'Healthcare', description: 'NHS and health-related announcements', count: newsArticles.filter(a => a.category === 'healthcare').length, color: 'bg-green-100 text-green-800' },
    { id: 'education', name: 'Education', description: 'Schools, universities, and learning initiatives', count: newsArticles.filter(a => a.category === 'education').length, color: 'bg-purple-100 text-purple-800' },
    { id: 'environment', name: 'Environment', description: 'Climate change and environmental policies', count: newsArticles.filter(a => a.category === 'environment').length, color: 'bg-emerald-100 text-emerald-800' },
    { id: 'transport', name: 'Transport', description: 'Infrastructure and transport updates', count: newsArticles.filter(a => a.category === 'transport').length, color: 'bg-orange-100 text-orange-800' },
    { id: 'housing', name: 'Housing', description: 'Housing policies and development', count: newsArticles.filter(a => a.category === 'housing').length, color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const featuredArticles = newsArticles.filter(article => article.featured);
  const urgentArticles = newsArticles.filter(article => article.urgent);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Government News & Updates</h1>
          <p className="text-xl text-gray-600 mb-6">
            Stay informed with the latest government announcements, policy updates, and public service news.
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search news articles, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="date">Sort by Date</option>
                <option value="views">Sort by Views</option>
                <option value="likes">Sort by Likes</option>
                <option value="title">Sort by Title</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Urgent News Alert */}
        {urgentArticles.length > 0 && (
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Urgent Updates</span>
                </div>
                <div className="space-y-2">
                  {urgentArticles.map(article => (
                    <div key={article.id} className="flex items-center justify-between">
                      <span className="text-red-700">{article.title}</span>
                      <Button variant="outline" size="sm" onClick={() => setSelectedArticle(article)}>
                        Read More
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="latest">Latest News</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          {/* Latest News Tab */}
          <TabsContent value="latest" className="space-y-6">
            <div className="grid gap-6">
              {sortedArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Article Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(article.category)}>
                              {categories.find(c => c.id === article.category)?.name}
                            </Badge>
                            {article.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {article.urgent && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <h2 className="text-2xl font-semibold mb-3 hover:text-primary cursor-pointer" 
                            onClick={() => setSelectedArticle(article)}>
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Article Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{article.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{article.comments} comments</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          Published by: <span className="font-medium">{article.author}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="lg:w-48 space-y-3">
                        <Button className="w-full" onClick={() => setSelectedArticle(article)}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Full Article
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div className="grid gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Featured Article</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">{article.title}</h2>
                    <p className="text-gray-600 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(article.publishedDate)}</span>
                        <span>{article.readTime} min read</span>
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                      <Button onClick={() => setSelectedArticle(article)}>
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(c => c.id !== 'all').map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedTab('latest');
                      }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={category.color}>{category.name}</Badge>
                      <span className="text-2xl font-bold text-gray-600">{category.count}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="text-sm text-gray-500">
                      {category.count} article{category.count !== 1 ? 's' : ''} available
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Archive Tab */}
          <TabsContent value="archive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Archive</CardTitle>
                <CardDescription>
                  Browse historical government news and announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">2024</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>January</span>
                        <span className="text-gray-500">6 articles</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">2023</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>December</span>
                        <span className="text-gray-500">12 articles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>November</span>
                        <span className="text-gray-500">8 articles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>October</span>
                        <span className="text-gray-500">15 articles</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Popular Topics</h3>
                    <div className="space-y-2">
                      <Badge variant="secondary">Digital Services</Badge>
                      <Badge variant="secondary">Healthcare</Badge>
                      <Badge variant="secondary">Education</Badge>
                      <Badge variant="secondary">Environment</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getCategoryColor(selectedArticle.category)}>
                    {categories.find(c => c.id === selectedArticle.category)?.name}
                  </Badge>
                  <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                    Close
                  </Button>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>By {selectedArticle.author}</span>
                  <span>{formatDate(selectedArticle.publishedDate)}</span>
                  <span>{selectedArticle.readTime} min read</span>
                </div>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-lg text-gray-600 mb-4">{selectedArticle.summary}</p>
                  <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="outline">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like ({selectedArticle.likes})
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;