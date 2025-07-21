import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  websiteTraffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    topPages: { page: string; views: number; change: number }[];
  };
  serviceUsage: {
    totalServices: number;
    activeUsers: number;
    completedApplications: number;
    avgProcessingTime: string;
    popularServices: { name: string; usage: number; satisfaction: number }[];
  };
  citizenEngagement: {
    petitionsSigned: number;
    forumPosts: number;
    feedbackSubmitted: number;
    newsletterSubscribers: number;
    engagementTrends: { month: string; engagement: number }[];
  };
  governmentMetrics: {
    responseTime: string;
    resolutionRate: number;
    citizenSatisfaction: number;
    costSavings: string;
    efficiencyGains: number;
  };
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock analytics data
  useEffect(() => {
    const loadAnalyticsData = () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          websiteTraffic: {
            totalVisitors: 125847,
            uniqueVisitors: 98234,
            pageViews: 456789,
            bounceRate: 32.5,
            avgSessionDuration: '4m 32s',
            topPages: [
              { page: '/mp-search', views: 45678, change: 12.5 },
              { page: '/bill-tracker', views: 34567, change: -3.2 },
              { page: '/services', views: 28934, change: 8.7 },
              { page: '/petitions', views: 23456, change: 15.3 },
              { page: '/news', views: 19876, change: 5.1 }
            ]
          },
          serviceUsage: {
            totalServices: 156,
            activeUsers: 78234,
            completedApplications: 12456,
            avgProcessingTime: '3.2 days',
            popularServices: [
              { name: 'Passport Application', usage: 8934, satisfaction: 4.2 },
              { name: 'Universal Credit', usage: 7823, satisfaction: 3.8 },
              { name: 'Driving Test Booking', usage: 6745, satisfaction: 4.5 },
              { name: 'Council Tax Support', usage: 5678, satisfaction: 3.9 },
              { name: 'NHS Registration', usage: 4567, satisfaction: 4.3 }
            ]
          },
          citizenEngagement: {
            petitionsSigned: 234567,
            forumPosts: 12345,
            feedbackSubmitted: 8976,
            newsletterSubscribers: 45678,
            engagementTrends: [
              { month: 'Jan', engagement: 65 },
              { month: 'Feb', engagement: 72 },
              { month: 'Mar', engagement: 68 },
              { month: 'Apr', engagement: 78 },
              { month: 'May', engagement: 85 },
              { month: 'Jun', engagement: 92 }
            ]
          },
          governmentMetrics: {
            responseTime: '2.3 hours',
            resolutionRate: 87.5,
            citizenSatisfaction: 4.1,
            costSavings: '£2.3M',
            efficiencyGains: 34.7
          }
        };
        
        setAnalyticsData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    loadAnalyticsData();
  }, [selectedTimeframe]);

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">Advanced Analytics Dashboard</h2>
          <p className="text-xl text-gray-600 mt-2">
            Comprehensive insights into government digital services performance and citizen engagement.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeframes.map(timeframe => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(analyticsData.websiteTraffic.totalVisitors)}
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12.5% from last period</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analyticsData.serviceUsage.totalServices}
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+8 new services</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citizen Satisfaction</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analyticsData.governmentMetrics.citizenSatisfaction}/5.0
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+0.3 improvement</span>
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analyticsData.governmentMetrics.costSavings}
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+15% efficiency</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
          <TabsTrigger value="services">Service Usage</TabsTrigger>
          <TabsTrigger value="engagement">Citizen Engagement</TabsTrigger>
          <TabsTrigger value="performance">Government Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Traffic Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unique Visitors</span>
                    <span className="font-semibold">{formatNumber(analyticsData.websiteTraffic.uniqueVisitors)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Page Views</span>
                    <span className="font-semibold">{formatNumber(analyticsData.websiteTraffic.pageViews)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bounce Rate</span>
                    <span className="font-semibold">{analyticsData.websiteTraffic.bounceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Session Duration</span>
                    <span className="font-semibold">{analyticsData.websiteTraffic.avgSessionDuration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages in the selected timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.websiteTraffic.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          #{index + 1}
                        </div>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{formatNumber(page.views)}</span>
                        <div className={`flex items-center space-x-1 ${getChangeColor(page.change)}`}>
                          {getChangeIcon(page.change)}
                          <span className="text-xs">{Math.abs(page.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold">{formatNumber(analyticsData.serviceUsage.activeUsers)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed Applications</span>
                    <span className="font-semibold">{formatNumber(analyticsData.serviceUsage.completedApplications)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Processing Time</span>
                    <span className="font-semibold">{analyticsData.serviceUsage.avgProcessingTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolution Rate</span>
                    <span className="font-semibold">{analyticsData.governmentMetrics.resolutionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most used government services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.serviceUsage.popularServices.map((service, index) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{service.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">{formatNumber(service.usage)} users</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-yellow-600">★</span>
                            <span className="text-xs">{service.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={(service.usage / analyticsData.serviceUsage.popularServices[0].usage) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Petitions Signed</span>
                    <span className="font-semibold">{formatNumber(analyticsData.citizenEngagement.petitionsSigned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Forum Posts</span>
                    <span className="font-semibold">{formatNumber(analyticsData.citizenEngagement.forumPosts)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Feedback Submitted</span>
                    <span className="font-semibold">{formatNumber(analyticsData.citizenEngagement.feedbackSubmitted)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Newsletter Subscribers</span>
                    <span className="font-semibold">{formatNumber(analyticsData.citizenEngagement.newsletterSubscribers)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Monthly engagement score (0-100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.citizenEngagement.engagementTrends.map(trend => (
                    <div key={trend.month} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{trend.month}</span>
                        <span className="font-semibold">{trend.engagement}%</span>
                      </div>
                      <Progress value={trend.engagement} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {analyticsData.governmentMetrics.responseTime}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Average response time</p>
                  <Badge className="mt-3 bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Target: &lt;4 hours
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Resolution Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {analyticsData.governmentMetrics.resolutionRate}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Cases resolved successfully</p>
                  <Progress 
                    value={analyticsData.governmentMetrics.resolutionRate} 
                    className="mt-3 h-3"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Gains */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Efficiency Gains</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    +{analyticsData.governmentMetrics.efficiencyGains}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Process improvement</p>
                  <Badge className="mt-3 bg-purple-100 text-purple-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Year over year
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Performance Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">High Traffic Alert</p>
                    <p className="text-sm text-yellow-700">MP Search service experiencing 150% normal traffic</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Performance Improvement</p>
                    <p className="text-sm text-green-700">Petition system response time improved by 25%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">System Update</p>
                    <p className="text-sm text-blue-700">New analytics features deployed successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;