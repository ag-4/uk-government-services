import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Clock,
  Activity,
  Eye,
  MousePointer,
  Download,
  Share2,
  Filter,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsData {
  websiteTraffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    topPages: Array<{
      page: string;
      views: number;
      change: number;
    }>;
    trafficSources: Array<{
      source: string;
      visitors: number;
      percentage: number;
    }>;
  };
  serviceUsage: {
    totalApplications: number;
    completedApplications: number;
    averageCompletionTime: string;
    successRate: number;
    topServices: Array<{
      service: string;
      applications: number;
      completionRate: number;
      avgTime: string;
    }>;
  };
  citizenEngagement: {
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    satisfactionScore: number;
    feedbackCount: number;
    engagementMetrics: Array<{
      metric: string;
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
  performance: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    apiCalls: number;
    dataProcessed: string;
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: string;
    }>;
  };
}

const AnalyticsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock analytics data - in real implementation, this would come from analytics APIs
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    websiteTraffic: {
      totalVisitors: 2847392,
      uniqueVisitors: 1923847,
      pageViews: 8472639,
      bounceRate: 34.2,
      avgSessionDuration: '4m 32s',
      topPages: [
        { page: '/services', views: 1247893, change: 12.3 },
        { page: '/parliament', views: 892456, change: -3.2 },
        { page: '/ai-assistant', views: 734829, change: 28.7 },
        { page: '/petitions', views: 623847, change: 15.9 },
        { page: '/mp-search', views: 456789, change: 8.4 }
      ],
      trafficSources: [
        { source: 'Direct', visitors: 1138957, percentage: 40.0 },
        { source: 'Search Engines', visitors: 854078, percentage: 30.0 },
        { source: 'Social Media', visitors: 569386, percentage: 20.0 },
        { source: 'Referrals', visitors: 284739, percentage: 10.0 }
      ]
    },
    serviceUsage: {
      totalApplications: 456789,
      completedApplications: 389234,
      averageCompletionTime: '12m 45s',
      successRate: 85.2,
      topServices: [
        { service: 'Passport Application', applications: 89234, completionRate: 92.1, avgTime: '8m 23s' },
        { service: 'Universal Credit', applications: 67891, completionRate: 78.4, avgTime: '15m 12s' },
        { service: 'Voter Registration', applications: 54623, completionRate: 96.7, avgTime: '3m 45s' },
        { service: 'Driving Test Booking', applications: 43789, completionRate: 88.9, avgTime: '6m 18s' },
        { service: 'Child Benefit', applications: 32456, completionRate: 91.3, avgTime: '11m 34s' }
      ]
    },
    citizenEngagement: {
      totalUsers: 1923847,
      activeUsers: 847392,
      newRegistrations: 23847,
      satisfactionScore: 4.3,
      feedbackCount: 15847,
      engagementMetrics: [
        { metric: 'Daily Active Users', value: 234789, change: 8.4, trend: 'up' },
        { metric: 'Session Duration', value: 272, change: 12.1, trend: 'up' },
        { metric: 'Page Views per Session', value: 3.2, change: -2.1, trend: 'down' },
        { metric: 'Return Visitors', value: 67.8, change: 5.3, trend: 'up' }
      ]
    },
    performance: {
      systemUptime: 99.97,
      averageResponseTime: 245,
      errorRate: 0.03,
      apiCalls: 15847392,
      dataProcessed: '2.4 TB',
      alerts: [
        { type: 'info', message: 'System maintenance scheduled for tonight 2-4 AM', timestamp: '2024-01-15 14:30' },
        { type: 'warning', message: 'High traffic detected on passport services', timestamp: '2024-01-15 13:45' },
        { type: 'error', message: 'Temporary service disruption resolved', timestamp: '2024-01-15 11:20' }
      ]
    }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Auto-refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      setLastUpdated(new Date());
      // In real implementation, fetch new data here
    }, 300000);

    return () => {
      clearTimeout(timer);
      clearInterval(refreshInterval);
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    setLastUpdated(new Date());
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // In real implementation, this would export analytics data
    console.log('Exporting analytics data...');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertIcon = (type: 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Comprehensive insights into government digital services performance and citizen engagement.
          </p>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{analyticsData.websiteTraffic.totalVisitors.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">Total Visitors</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{analyticsData.serviceUsage.totalApplications.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">Applications</p>
                </div>
                <Activity className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.citizenEngagement.satisfactionScore}</div>
                  <p className="text-xs text-gray-600">Satisfaction</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.performance.systemUptime}%</div>
                  <p className="text-xs text-gray-600">Uptime</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{analyticsData.performance.averageResponseTime}ms</div>
                  <p className="text-xs text-gray-600">Response Time</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{analyticsData.serviceUsage.successRate}%</div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
            <TabsTrigger value="services">Service Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Citizen Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Citizen Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.citizenEngagement.engagementMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm">{metric.metric}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{metric.value.toLocaleString()}</div>
                          <div className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change >= 0 ? '+' : ''}{metric.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.performance.alerts.map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start gap-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{alert.message}</div>
                            <div className="text-xs opacity-75">{alert.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Services Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Services Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.serviceUsage.topServices.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service.service}</span>
                        <div className="text-right text-sm">
                          <div>{service.applications.toLocaleString()} applications</div>
                          <div className="text-gray-600">{service.completionRate}% completion</div>
                        </div>
                      </div>
                      <Progress value={service.completionRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.websiteTraffic.trafficSources.map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{source.source}</span>
                          <div className="text-right">
                            <div className="font-semibold">{source.visitors.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">{source.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.websiteTraffic.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{page.page}</div>
                          <div className="text-sm text-gray-600">{page.views.toLocaleString()} views</div>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${page.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {page.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {Math.abs(page.change)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{analyticsData.websiteTraffic.totalVisitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{analyticsData.websiteTraffic.uniqueVisitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Unique Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analyticsData.websiteTraffic.pageViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Page Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{analyticsData.websiteTraffic.bounceRate}%</div>
                    <div className="text-sm text-gray-600">Bounce Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{analyticsData.websiteTraffic.avgSessionDuration}</div>
                    <div className="text-sm text-gray-600">Avg Session</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Usage Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Completion Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Service Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.serviceUsage.topServices.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{service.service}</span>
                          <span className="text-sm font-semibold">{service.completionRate}%</span>
                        </div>
                        <Progress value={service.completionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{service.applications.toLocaleString()} applications</span>
                          <span>Avg: {service.avgTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Usage Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{analyticsData.serviceUsage.totalApplications.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Applications</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analyticsData.serviceUsage.completedApplications.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analyticsData.serviceUsage.successRate}%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">{analyticsData.serviceUsage.averageCompletionTime}</div>
                      <div className="text-xs text-gray-600">Average Completion Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Uptime</span>
                      <span className="font-semibold text-green-600">{analyticsData.performance.systemUptime}%</span>
                    </div>
                    <Progress value={analyticsData.performance.systemUptime} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Response Time</span>
                      <span className="font-semibold">{analyticsData.performance.averageResponseTime}ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Error Rate</span>
                      <span className="font-semibold text-red-600">{analyticsData.performance.errorRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    API Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{analyticsData.performance.apiCalls.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">API Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.performance.dataProcessed}</div>
                      <div className="text-sm text-gray-600">Data Processed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.performance.alerts.slice(0, 3).map((alert, index) => (
                      <div key={index} className={`p-2 rounded border ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start gap-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="text-xs font-medium">{alert.message}</div>
                            <div className="text-xs opacity-75">{alert.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;