import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Lock,
  Eye,
  Users,
  Globe,
  Server,
  Database,
  Wifi,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Info,
  XCircle
} from 'lucide-react';

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttacks: number;
  vulnerabilities: number;
  securityScore: number;
  lastScan: string;
  incidents: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
    status: 'active' | 'resolved' | 'investigating';
  }>;
}

interface SystemPerformance {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

interface UserActivity {
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: string;
  loginAttempts: number;
  failedLogins: number;
  suspiciousActivity: number;
  usersByRegion: Array<{
    region: string;
    users: number;
    percentage: number;
  }>;
}

interface ServiceHealth {
  services: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'down';
    uptime: number;
    responseTime: number;
    errorRate: number;
    lastCheck: string;
  }>;
  databases: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    connections: number;
    queryTime: number;
    size: string;
  }>;
}

const SecurityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock security data - in real implementation, this would come from security monitoring APIs
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeThreats: 3,
    blockedAttacks: 1247,
    vulnerabilities: 8,
    securityScore: 94.2,
    lastScan: '2024-01-15 14:30:00',
    incidents: [
      {
        id: '1',
        type: 'Suspicious Login',
        severity: 'medium',
        description: 'Multiple failed login attempts from IP 192.168.1.100',
        timestamp: '2024-01-15 14:25:00',
        status: 'investigating'
      },
      {
        id: '2',
        type: 'DDoS Attempt',
        severity: 'high',
        description: 'High volume of requests detected from multiple IPs',
        timestamp: '2024-01-15 13:45:00',
        status: 'resolved'
      },
      {
        id: '3',
        type: 'Malware Detection',
        severity: 'critical',
        description: 'Potential malware detected in uploaded file',
        timestamp: '2024-01-15 12:30:00',
        status: 'resolved'
      }
    ]
  });

  const [systemPerformance, setSystemPerformance] = useState<SystemPerformance>({
    cpuUsage: 67.3,
    memoryUsage: 78.9,
    diskUsage: 45.2,
    networkLatency: 23,
    uptime: 99.97,
    responseTime: 245,
    throughput: 15847,
    errorRate: 0.03
  });

  const [userActivity, setUserActivity] = useState<UserActivity>({
    activeUsers: 23847,
    totalSessions: 89234,
    averageSessionDuration: '12m 34s',
    loginAttempts: 156789,
    failedLogins: 2847,
    suspiciousActivity: 23,
    usersByRegion: [
      { region: 'England', users: 18456, percentage: 77.4 },
      { region: 'Scotland', users: 2847, percentage: 11.9 },
      { region: 'Wales', users: 1623, percentage: 6.8 },
      { region: 'Northern Ireland', users: 921, percentage: 3.9 }
    ]
  });

  const [serviceHealth, setServiceHealth] = useState<ServiceHealth>({
    services: [
      { name: 'Authentication Service', status: 'healthy', uptime: 99.98, responseTime: 120, errorRate: 0.01, lastCheck: '2024-01-15 14:30:00' },
      { name: 'Payment Gateway', status: 'healthy', uptime: 99.95, responseTime: 340, errorRate: 0.02, lastCheck: '2024-01-15 14:30:00' },
      { name: 'Document Processing', status: 'warning', uptime: 98.7, responseTime: 890, errorRate: 0.15, lastCheck: '2024-01-15 14:30:00' },
      { name: 'Notification Service', status: 'healthy', uptime: 99.99, responseTime: 89, errorRate: 0.001, lastCheck: '2024-01-15 14:30:00' },
      { name: 'Search Engine', status: 'critical', uptime: 95.2, responseTime: 1240, errorRate: 2.3, lastCheck: '2024-01-15 14:30:00' }
    ],
    databases: [
      { name: 'User Database', status: 'healthy', connections: 234, queryTime: 45, size: '2.4 TB' },
      { name: 'Application Database', status: 'healthy', connections: 156, queryTime: 67, size: '1.8 TB' },
      { name: 'Analytics Database', status: 'warning', connections: 89, queryTime: 123, size: '5.2 TB' },
      { name: 'Audit Database', status: 'healthy', connections: 67, queryTime: 34, size: '890 GB' }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Auto-refresh data every 30 seconds
    const refreshInterval = setInterval(() => {
      setLastUpdated(new Date());
      // In real implementation, fetch new security data here
    }, 30000);

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

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'down': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
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
            <h1 className="text-4xl font-bold text-gray-900">Security Dashboard</h1>
            <div className="flex items-center gap-4">
              <Badge className={getThreatLevelColor(securityMetrics.threatLevel)}>
                <Shield className="w-4 h-4 mr-1" />
                Threat Level: {securityMetrics.threatLevel.toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Monitor system security, performance, and user activity in real-time.
          </p>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>

        {/* Key Security Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{securityMetrics.securityScore}%</div>
                  <p className="text-xs text-gray-600">Security Score</p>
                </div>
                <Shield className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{securityMetrics.activeThreats}</div>
                  <p className="text-xs text-gray-600">Active Threats</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{securityMetrics.blockedAttacks}</div>
                  <p className="text-xs text-gray-600">Blocked Attacks</p>
                </div>
                <Lock className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{systemPerformance.uptime}%</div>
                  <p className="text-xs text-gray-600">System Uptime</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{userActivity.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">Active Users</p>
                </div>
                <Users className="w-8 h-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-teal-600">{systemPerformance.responseTime}ms</div>
                  <p className="text-xs text-gray-600">Response Time</p>
                </div>
                <Clock className="w-8 h-8 text-teal-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Security Overview</TabsTrigger>
            <TabsTrigger value="performance">System Performance</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="services">Service Health</TabsTrigger>
          </TabsList>

          {/* Security Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Incidents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Security Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityMetrics.incidents.map((incident) => (
                      <div key={incident.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{incident.type}</span>
                          </div>
                          <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                        <div className="text-xs text-gray-500">{incident.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Security Score</span>
                        <span className="text-sm font-bold">{securityMetrics.securityScore}%</span>
                      </div>
                      <Progress value={securityMetrics.securityScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{securityMetrics.activeThreats}</div>
                        <div className="text-xs text-gray-600">Active Threats</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{securityMetrics.vulnerabilities}</div>
                        <div className="text-xs text-gray-600">Vulnerabilities</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{securityMetrics.blockedAttacks}</div>
                      <div className="text-sm text-gray-600">Attacks Blocked Today</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">Last Security Scan</div>
                      <div className="font-medium">{securityMetrics.lastScan}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Threat Level Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Threat Level Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="font-semibold">Low Risk</div>
                    <div className="text-sm text-gray-600">Normal operations</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="font-semibold">Medium Risk</div>
                    <div className="text-sm text-gray-600">Increased monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="font-semibold">High Risk</div>
                    <div className="text-sm text-gray-600">Active response</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="font-semibold">Critical Risk</div>
                    <div className="text-sm text-gray-600">Emergency protocols</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm font-bold">{systemPerformance.cpuUsage}%</span>
                      </div>
                      <Progress value={systemPerformance.cpuUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm font-bold">{systemPerformance.memoryUsage}%</span>
                      </div>
                      <Progress value={systemPerformance.memoryUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Disk Usage</span>
                        <span className="text-sm font-bold">{systemPerformance.diskUsage}%</span>
                      </div>
                      <Progress value={systemPerformance.diskUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Latency</span>
                      <span className="font-semibold">{systemPerformance.networkLatency}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-semibold">{systemPerformance.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Throughput</span>
                      <span className="font-semibold">{systemPerformance.throughput.toLocaleString()} req/min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-semibold text-red-600">{systemPerformance.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Uptime</span>
                      <span className="font-semibold text-green-600">{systemPerformance.uptime}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Activity Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{userActivity.activeUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{userActivity.totalSessions.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Total Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{userActivity.averageSessionDuration}</div>
                        <div className="text-xs text-gray-600">Avg Session</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{userActivity.loginAttempts.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Login Attempts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{userActivity.failedLogins.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Failed Logins</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users by Region */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Users by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivity.usersByRegion.map((region, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{region.region}</span>
                          <div className="text-right">
                            <div className="font-semibold">{region.users.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">{region.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{userActivity.suspiciousActivity}</div>
                    <div className="text-sm text-gray-600">Suspicious Activities</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{userActivity.failedLogins}</div>
                    <div className="text-sm text-gray-600">Failed Login Attempts</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{((userActivity.loginAttempts - userActivity.failedLogins) / userActivity.loginAttempts * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Login Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Health Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceHealth.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(service.status)}>
                            {getStatusIcon(service.status)}
                            <span className="ml-1 capitalize">{service.status}</span>
                          </Badge>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div>{service.uptime}% uptime</div>
                          <div className="text-gray-600">{service.responseTime}ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Database Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceHealth.databases.map((database, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(database.status)}>
                            {getStatusIcon(database.status)}
                            <span className="ml-1 capitalize">{database.status}</span>
                          </Badge>
                          <span className="font-medium">{database.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div>{database.connections} connections</div>
                          <div className="text-gray-600">{database.size}</div>
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

export default SecurityPage;