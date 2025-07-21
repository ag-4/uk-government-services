import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Bell, Settings, CheckCircle, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

const NewsletterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [preferences, setPreferences] = useState({
    parliament: true,
    localNews: true,
    services: false,
    alerts: true,
    weekly: true,
    monthly: false
  });

  const newsletters = [
    {
      id: 1,
      title: 'Parliamentary Weekly',
      description: 'Weekly updates on parliamentary proceedings, votes, and debates',
      frequency: 'Weekly',
      subscribers: 15420,
      category: 'Parliament',
      lastIssue: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Local Government Digest',
      description: 'Updates on local council decisions, planning applications, and community news',
      frequency: 'Bi-weekly',
      subscribers: 8930,
      category: 'Local Government',
      lastIssue: '2024-01-12',
      featured: false
    },
    {
      id: 3,
      title: 'Service Updates',
      description: 'Important updates about government services, new features, and maintenance',
      frequency: 'As needed',
      subscribers: 22100,
      category: 'Services',
      lastIssue: '2024-01-10',
      featured: true
    },
    {
      id: 4,
      title: 'Policy Alerts',
      description: 'Immediate notifications about new policies, legislation, and regulatory changes',
      frequency: 'As needed',
      subscribers: 12750,
      category: 'Policy',
      lastIssue: '2024-01-14',
      featured: false
    },
    {
      id: 5,
      title: 'Citizen Rights Monthly',
      description: 'Monthly deep-dive into citizen rights, legal updates, and advocacy opportunities',
      frequency: 'Monthly',
      subscribers: 6840,
      category: 'Rights',
      lastIssue: '2024-01-01',
      featured: false
    }
  ];

  const recentIssues = [
    {
      title: 'Parliamentary Weekly - Issue #47',
      date: '2024-01-15',
      summary: 'Housing Bill debate, NHS funding vote, and committee appointments',
      category: 'Parliament'
    },
    {
      title: 'Service Updates - System Maintenance',
      date: '2024-01-14',
      summary: 'Scheduled maintenance for MP lookup service and new features announcement',
      category: 'Services'
    },
    {
      title: 'Policy Alerts - New Environmental Regulations',
      date: '2024-01-13',
      summary: 'Updated environmental impact assessments for planning applications',
      category: 'Policy'
    },
    {
      title: 'Local Government Digest - Issue #23',
      date: '2024-01-12',
      summary: 'Council budget approvals, new cycling infrastructure, and community grants',
      category: 'Local Government'
    }
  ];

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      // In a real app, this would make an API call
    }
  };

  const handlePreferenceChange = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Newsletter Subscription</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with our government newsletters covering parliament, local news, and service updates
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {!isSubscribed ? (
            /* Subscription Form */
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Subscribe to Our Newsletters
                </CardTitle>
                <CardDescription>
                  Get the latest updates delivered directly to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSubscribe} disabled={!email}>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribe
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Choose Your Preferences:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.parliament}
                          onChange={() => handlePreferenceChange('parliament')}
                          className="rounded"
                        />
                        <span>Parliamentary updates</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.localNews}
                          onChange={() => handlePreferenceChange('localNews')}
                          className="rounded"
                        />
                        <span>Local government news</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.services}
                          onChange={() => handlePreferenceChange('services')}
                          className="rounded"
                        />
                        <span>Service announcements</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.alerts}
                          onChange={() => handlePreferenceChange('alerts')}
                          className="rounded"
                        />
                        <span>Policy alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Success Message */
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-center text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Successfully Subscribed!</h2>
                    <p className="text-green-700">
                      Thank you for subscribing to our newsletters. You'll receive updates at {email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Newsletters */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Newsletters</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id} className={`${newsletter.featured ? 'ring-2 ring-purple-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                      {newsletter.featured && (
                        <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                      )}
                    </div>
                    <CardDescription>{newsletter.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {newsletter.frequency}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {newsletter.subscribers.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{newsletter.category}</Badge>
                        <span className="text-xs text-gray-500">
                          Last: {newsletter.lastIssue}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Issues */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Issues</h2>
            <div className="space-y-4">
              {recentIssues.map((issue, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{issue.summary}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{issue.category}</Badge>
                          <span className="text-xs text-gray-500">{issue.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Newsletter Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">65,000+</div>
                  <div className="text-sm text-gray-600">Total Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Active Newsletters</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-gray-600">Open Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">2.5k</div>
                  <div className="text-sm text-gray-600">New This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;