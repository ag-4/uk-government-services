import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Settings,
  Globe
} from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const dataTypes = [
    {
      type: 'Personal Information',
      description: 'Name, email address, postal address, phone number',
      purpose: 'To provide services and communicate with you',
      retention: '7 years after last contact',
      sharing: 'Not shared with third parties'
    },
    {
      type: 'Usage Data',
      description: 'Pages visited, time spent, browser information',
      purpose: 'To improve our services and user experience',
      retention: '2 years',
      sharing: 'Anonymized data may be shared for research'
    },
    {
      type: 'Cookies',
      description: 'Essential, analytics, and preference cookies',
      purpose: 'To ensure website functionality and analyze usage',
      retention: 'Varies by cookie type (session to 2 years)',
      sharing: 'Some analytics cookies shared with Google Analytics'
    },
    {
      type: 'Government Data',
      description: 'Information you provide for government services',
      purpose: 'To process applications and provide services',
      retention: 'As required by law (typically 6-7 years)',
      sharing: 'Shared with relevant government departments only'
    }
  ];

  const yourRights = [
    {
      right: 'Right of Access',
      description: 'Request a copy of the personal data we hold about you',
      howTo: 'Submit a Subject Access Request via email or post',
      timeframe: '1 month',
      icon: Eye
    },
    {
      right: 'Right to Rectification',
      description: 'Request correction of inaccurate or incomplete data',
      howTo: 'Contact us with the correct information',
      timeframe: '1 month',
      icon: FileText
    },
    {
      right: 'Right to Erasure',
      description: 'Request deletion of your personal data',
      howTo: 'Submit a deletion request with valid reasons',
      timeframe: '1 month',
      icon: AlertTriangle
    },
    {
      right: 'Right to Portability',
      description: 'Receive your data in a machine-readable format',
      howTo: 'Request data export via our contact form',
      timeframe: '1 month',
      icon: Download
    },
    {
      right: 'Right to Object',
      description: 'Object to processing based on legitimate interests',
      howTo: 'Submit an objection with your reasons',
      timeframe: '1 month',
      icon: Shield
    },
    {
      right: 'Right to Restrict Processing',
      description: 'Request limitation of how we process your data',
      howTo: 'Contact us with your restriction request',
      timeframe: '1 month',
      icon: Lock
    }
  ];

  const cookieTypes = [
    {
      category: 'Essential Cookies',
      description: 'Required for the website to function properly',
      examples: ['Session management', 'Security tokens', 'Load balancing'],
      canOptOut: false,
      duration: 'Session or up to 1 year'
    },
    {
      category: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      examples: ['Google Analytics', 'Page views', 'User journeys'],
      canOptOut: true,
      duration: 'Up to 2 years'
    },
    {
      category: 'Functional Cookies',
      description: 'Remember your preferences and settings',
      examples: ['Language preferences', 'Accessibility settings', 'Form data'],
      canOptOut: true,
      duration: 'Up to 1 year'
    },
    {
      category: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration'],
      canOptOut: true,
      duration: 'Up to 1 year'
    }
  ];

  const securityMeasures = [
    {
      measure: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols',
      icon: Lock
    },
    {
      measure: 'Access Controls',
      description: 'Strict access controls ensure only authorized personnel can access data',
      icon: UserCheck
    },
    {
      measure: 'Regular Audits',
      description: 'Regular security audits and penetration testing to identify vulnerabilities',
      icon: Shield
    },
    {
      measure: 'Data Minimization',
      description: 'We only collect and retain data that is necessary for our services',
      icon: Database
    },
    {
      measure: 'Staff Training',
      description: 'All staff receive regular training on data protection and security',
      icon: CheckCircle
    },
    {
      measure: 'Incident Response',
      description: 'Comprehensive incident response plan for any security breaches',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: January 15, 2024
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Version 2.1
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data">Data We Collect</TabsTrigger>
              <TabsTrigger value="rights">Your Rights</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Points */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Data Minimization</h3>
                    <p className="text-sm text-blue-700">
                      We only collect data that's necessary to provide our services
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Secure Storage</h3>
                    <p className="text-sm text-green-700">
                      Your data is encrypted and stored securely in UK data centers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Your Control</h3>
                    <p className="text-sm text-purple-700">
                      You have full control over your data and can request changes anytime
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Privacy Principles */}
              <Card>
                <CardHeader>
                  <CardTitle>Our Privacy Principles</CardTitle>
                  <CardDescription>
                    We are committed to protecting your privacy and being transparent about our data practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Transparency</h4>
                        <p className="text-sm text-gray-600">We clearly explain what data we collect and why</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Purpose Limitation</h4>
                        <p className="text-sm text-gray-600">We only use your data for the purposes we've told you about</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Data Minimization</h4>
                        <p className="text-sm text-gray-600">We collect only the minimum data necessary</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Accuracy</h4>
                        <p className="text-sm text-gray-600">We keep your data accurate and up to date</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Security</h4>
                        <p className="text-sm text-gray-600">We protect your data with appropriate security measures</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Accountability</h4>
                        <p className="text-sm text-gray-600">We take responsibility for protecting your privacy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Basis */}
              <Card>
                <CardHeader>
                  <CardTitle>Legal Basis for Processing</CardTitle>
                  <CardDescription>
                    We process your personal data under the following legal bases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Legitimate Interest</h4>
                      <p className="text-sm text-blue-700">
                        To provide and improve our government services platform
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Consent</h4>
                      <p className="text-sm text-green-700">
                        For marketing communications and optional features
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Legal Obligation</h4>
                      <p className="text-sm text-purple-700">
                        To comply with government regulations and legal requirements
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Public Task</h4>
                      <p className="text-sm text-orange-700">
                        To perform tasks in the public interest or official authority
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <div className="space-y-6">
                {dataTypes.map((data, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2" />
                        {data.type}
                      </CardTitle>
                      <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Purpose:</h4>
                          <p className="text-sm text-gray-700">{data.purpose}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Retention:</h4>
                          <p className="text-sm text-gray-700">{data.retention}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Sharing:</h4>
                          <p className="text-sm text-gray-700">{data.sharing}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rights" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {yourRights.map((right, index) => {
                  const IconComponent = right.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                          {right.right}
                        </CardTitle>
                        <CardDescription>{right.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">How to exercise:</h4>
                            <p className="text-sm text-gray-700">{right.howTo}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Response time:</h4>
                              <Badge variant="outline">{right.timeframe}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">How to Exercise Your Rights</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• Email us at privacy@govwhiz.uk with your request</p>
                    <p>• Include proof of identity (copy of passport or driving licence)</p>
                    <p>• Specify which right you want to exercise and provide details</p>
                    <p>• We will respond within one month of receiving your request</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cookies" className="space-y-6">
              <div className="space-y-6">
                {cookieTypes.map((cookie, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{cookie.category}</CardTitle>
                        <Badge variant={cookie.canOptOut ? "secondary" : "destructive"}>
                          {cookie.canOptOut ? "Optional" : "Required"}
                        </Badge>
                      </div>
                      <CardDescription>{cookie.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Examples:</h4>
                          <div className="flex flex-wrap gap-1">
                            {cookie.examples.map((example, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Duration:</h4>
                          <p className="text-sm text-gray-700">{cookie.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Cookie Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your cookie preferences and opt out of non-essential cookies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cookieTypes.map((cookie, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{cookie.category}</h4>
                          <p className="text-sm text-gray-600">{cookie.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            defaultChecked={!cookie.canOptOut}
                            disabled={!cookie.canOptOut}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {cookie.canOptOut ? "Allow" : "Required"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {securityMeasures.map((measure, index) => {
                  const IconComponent = measure.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="p-2 bg-blue-100 rounded-lg mr-4">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{measure.measure}</h3>
                            <p className="text-sm text-gray-700">{measure.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Data Breach Notification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      In the unlikely event of a data breach that poses a risk to your rights and freedoms, 
                      we will notify you within 72 hours of becoming aware of the breach.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">What we'll tell you:</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Nature of the breach</li>
                          <li>• Data categories affected</li>
                          <li>• Likely consequences</li>
                          <li>• Measures taken to address the breach</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">What you should do:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Follow our guidance</li>
                          <li>• Change passwords if advised</li>
                          <li>• Monitor your accounts</li>
                          <li>• Contact us with concerns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Data Protection Officer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Email:</h4>
                        <p className="text-sm text-gray-700">privacy@govwhiz.uk</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Post:</h4>
                        <p className="text-sm text-gray-700">
                          Data Protection Officer<br />
                          GOVWHIZ<br />
                          PO Box 123<br />
                          London, SW1A 1AA
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Response Time:</h4>
                        <Badge variant="outline">Within 1 month</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Information Commissioner's Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        If you're not satisfied with our response, you can complain to the ICO:
                      </p>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Website:</h4>
                        <a href="https://ico.org.uk" className="text-sm text-blue-600 hover:underline flex items-center">
                          ico.org.uk <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Phone:</h4>
                        <p className="text-sm text-gray-700">0303 123 1113</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Post:</h4>
                        <p className="text-sm text-gray-700">
                          Information Commissioner's Office<br />
                          Wycliffe House<br />
                          Water Lane<br />
                          Wilmslow, Cheshire, SK9 5AF
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Quick Contact Options</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm text-green-800">privacy@govwhiz.uk</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm text-green-800">0300 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm text-green-800">Online contact form</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;