import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  MapPin,
  FileText,
  Download,
  Filter,
  Search,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageSquare,
  Star,
  Zap,
  Target,
  Award,
  TrendingDown
} from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface PerformanceData {
  period: string;
  uptime: number;
  responseTime: number;
  throughput: number;
  errors: number;
}

interface UserEngagement {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down';
}

interface ServiceHealth {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  lastIncident: string;
  users: number;
}

const SecurityDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Security Metrics
  const securityMetrics: SecurityMetric[] = [
    {
      id: 'threat-detection',
      name: 'Threat Detection Rate',
      value: 99.7,
      status: 'good',
      trend: 'up',
      description: 'Percentage of security threats successfully detected and blocked'
    },
    {
      id: 'vulnerability-score',
      name: 'Vulnerability Score',
      value: 2.1,
      status: 'good',
      trend: 'down',
      description: 'Average CVSS score of unpatched vulnerabilities (lower is better)'
    },
    {
      id: 'compliance-score',
      name: 'Compliance Score',
      value: 98.5,
      status: 'good',
      trend: 'stable',
      description: 'Percentage compliance with government security standards'
    },
    {
      id: 'incident-response',
      name: 'Incident Response Time',
      value: 4.2,
      status: 'warning',
      trend: 'up',
      description: 'Average time to respond to security incidents (minutes)'
    },
    {
      id: 'data-encryption',
      name: 'Data Encryption Coverage',
      value: 100,
      status: 'good',
      trend: 'stable',
      description: 'Percentage of sensitive data encrypted at rest and in transit'
    },
    {
      id: 'access-violations',
      name: 'Access Violations',
      value: 0.03,
      status: 'good',
      trend: 'down',
      description: 'Percentage of unauthorized access attempts'
    }
  ];

  // Performance Data
  const performanceData: PerformanceData[] = [
    { period: 'Mon', uptime: 99.9, responseTime: 120, throughput: 15420, errors: 2 },
    { period: 'Tue', uptime: 99.8, responseTime: 135, throughput: 16890, errors: 5 },
    { period: 'Wed', uptime: 100, responseTime: 98, throughput: 18230, errors: 0 },
    { period: 'Thu', uptime: 99.9, responseTime: 110, throughput: 17650, errors: 1 },
    { period: 'Fri', uptime: 99.7, responseTime: 145, throughput: 19840, errors: 8 },
    { period: 'Sat', uptime: 100, responseTime: 89, throughput: 12340, errors: 0 },
    { period: 'Sun', uptime: 99.9, responseTime: 95, throughput: 11230, errors: 1 }
  ];

  // User Engagement Metrics
  const userEngagement: UserEngagement[] = [
    { metric: 'Daily Active Users', current: 45678, previous: 42340, change: 7.9, trend: 'up' },
    { metric: 'Session Duration', current: 8.4, previous: 7.8, change: 7.7, trend: 'up' },
    { metric: 'Page Views', current: 234567, previous: 218900, change: 7.2, trend: 'up' },
    { metric: 'Bounce Rate', current: 23.4, previous: 28.1, change: -16.7, trend: 'down' },
    { metric: 'User Satisfaction', current: 4.7, previous: 4.5, change: 4.4, trend: 'up' },
    { metric: 'Support Tickets', current: 89, previous: 134, change: -33.6, trend: 'down' }
  ];

  // Service Health
  const serviceHealth: ServiceHealth[] = [
    { service: 'Authentication Service', status: 'operational', uptime: 99.9, lastIncident: '3 days ago', users: 15678 },
    { service: 'Document Processing', status: 'operational', uptime: 99.7, lastIncident: '1 week ago', users: 8934 },
    { service: 'Payment Gateway', status: 'degraded', uptime: 98.2, lastIncident: '2 hours ago', users: 5432 },
    { service: 'Notification System', status: 'operational', uptime: 100, lastIncident: '2 weeks ago', users: 23456 },
    { service: 'Search Engine', status: 'operational', uptime: 99.8, lastIncident: '5 days ago', users: 34567 },
    { service: 'File Storage', status: 'operational', uptime: 99.9, lastIncident: '1 week ago', users: 12345 }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">Security & Performance Dashboard</h2>
          <p className="text-xl text-gray-600 mt-2">
            Real-time monitoring of system security, performance, and user engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>User Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Service Health</span>
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMetrics.map(metric => (
              <Card key={metric.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">
                        {metric.value}
                        {metric.id === 'threat-detection' || metric.id === 'compliance-score' || metric.id === 'data-encryption' ? '%' : 
                         metric.id === 'incident-response' ? 'min' : '%'}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <Progress 
                      value={metric.id === 'vulnerability-score' || metric.id === 'incident-response' || metric.id === 'access-violations' ? 
                        100 - (metric.value * 10) : metric.value} 
                      className="h-2" 
                    />
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span>Recent Security Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Security patch deployed successfully</p>
                    <p className="text-sm text-gray-600">Critical vulnerability CVE-2024-0001 patched across all systems</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Unusual login pattern detected</p>
                    <p className="text-sm text-gray-600">Multiple failed login attempts from IP 192.168.1.100</p>
                  </div>
                  <span className="text-sm text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Security scan completed</p>
                    <p className="text-sm text-gray-600">Weekly vulnerability assessment found 0 critical issues</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Average Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.8%</div>
                <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
                <Progress value={99.8} className="h-2 mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">112ms</div>
                <p className="text-sm text-gray-600 mt-2">Average response</p>
                <div className="flex items-center mt-3 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">15% faster</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">16.2K</div>
                <p className="text-sm text-gray-600 mt-2">Requests/hour</p>
                <div className="flex items-center mt-3 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">8% increase</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">0.02%</div>
                <p className="text-sm text-gray-600 mt-2">Error percentage</p>
                <div className="flex items-center mt-3 text-sm">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">50% reduction</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                <span>Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{data.period}</div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Uptime</div>
                      <div className="font-semibold text-green-600">{data.uptime}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Response</div>
                      <div className="font-semibold text-blue-600">{data.responseTime}ms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Throughput</div>
                      <div className="font-semibold text-purple-600">{data.throughput.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Errors</div>
                      <div className="font-semibold text-red-600">{data.errors}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEngagement.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold">
                      {metric.metric === 'Session Duration' ? `${metric.current}min` :
                       metric.metric === 'User Satisfaction' ? `${metric.current}/5` :
                       metric.metric === 'Bounce Rate' ? `${metric.current}%` :
                       metric.current.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      {metric.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> :
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                      <span className={`text-sm font-semibold ${
                        (metric.trend === 'up' && metric.change > 0) || 
                        (metric.trend === 'down' && metric.change < 0) ? 
                        'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-sm text-gray-600">vs last period</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Previous: {metric.metric === 'Session Duration' ? `${metric.previous}min` :
                                metric.metric === 'User Satisfaction' ? `${metric.previous}/5` :
                                metric.metric === 'Bounce Rate' ? `${metric.previous}%` :
                                metric.previous.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Activity Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>User Activity Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Peak Usage Times</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">9:00 AM - 11:00 AM</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-semibold">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2:00 PM - 4:00 PM</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm font-semibold">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">7:00 PM - 9:00 PM</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={58} className="w-20 h-2" />
                        <span className="text-sm font-semibold">58%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Top User Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service Search</span>
                      <span className="text-sm font-semibold">34.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Document Download</span>
                      <span className="text-sm font-semibold">28.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Form Submission</span>
                      <span className="text-sm font-semibold">19.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Assistant Usage</span>
                      <span className="text-sm font-semibold">17.6%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Health Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceHealth.map((service, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.service}</CardTitle>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="font-semibold">{service.uptime}%</span>
                    </div>
                    <Progress value={service.uptime} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="font-semibold">{service.users.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Incident</span>
                      <span className="text-sm">{service.lastIncident}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">6/6</div>
                  <p className="text-sm text-gray-600 mt-1">Services Operational</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.7%</div>
                  <p className="text-sm text-gray-600 mt-1">Overall Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100K+</div>
                  <p className="text-sm text-gray-600 mt-1">Total Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">2.1M</div>
                  <p className="text-sm text-gray-600 mt-1">Requests Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;