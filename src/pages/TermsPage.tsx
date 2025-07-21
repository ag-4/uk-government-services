import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Download,
  User,
  Globe,
  Building,
  Gavel
} from 'lucide-react';

const TermsPage: React.FC = () => {
  const serviceTerms = [
    {
      title: 'Service Availability',
      description: 'We aim to provide 99.9% uptime but cannot guarantee uninterrupted service',
      details: [
        'Planned maintenance will be announced in advance',
        'Emergency maintenance may occur without notice',
        'Service may be temporarily unavailable due to technical issues'
      ]
    },
    {
      title: 'User Accounts',
      description: 'You are responsible for maintaining the security of your account',
      details: [
        'Keep your login credentials secure and confidential',
        'Notify us immediately of any unauthorized access',
        'You are liable for all activities under your account'
      ]
    },
    {
      title: 'Acceptable Use',
      description: 'You must use our services lawfully and responsibly',
      details: [
        'Do not use the service for illegal activities',
        'Do not attempt to disrupt or damage the service',
        'Do not share false or misleading information'
      ]
    },
    {
      title: 'Content Submission',
      description: 'Content you submit must be accurate and lawful',
      details: [
        'You retain ownership of content you submit',
        'You grant us license to use submitted content for service provision',
        'We may remove content that violates these terms'
      ]
    }
  ];

  const prohibitedActivities = [
    'Using the service for fraudulent or illegal purposes',
    'Attempting to gain unauthorized access to systems',
    'Distributing malware, viruses, or harmful code',
    'Harassing, threatening, or abusing other users',
    'Violating intellectual property rights',
    'Spamming or sending unsolicited communications',
    'Impersonating others or providing false information',
    'Interfering with the proper functioning of the service'
  ];

  const liabilityLimitations = [
    {
      type: 'Service Interruptions',
      description: 'We are not liable for damages caused by service outages or technical issues',
      limitation: 'Limited to service credits where applicable'
    },
    {
      type: 'Data Loss',
      description: 'While we implement backup systems, we cannot guarantee against all data loss',
      limitation: 'Users should maintain their own backups of important data'
    },
    {
      type: 'Third-Party Services',
      description: 'We are not responsible for third-party services integrated with our platform',
      limitation: 'Users interact with third-party services at their own risk'
    },
    {
      type: 'User Content',
      description: 'We are not liable for user-generated content or its accuracy',
      limitation: 'Users are responsible for content they submit or share'
    }
  ];

  const governingLaws = [
    {
      jurisdiction: 'England and Wales',
      description: 'These terms are governed by the laws of England and Wales',
      courts: 'English courts have exclusive jurisdiction over disputes'
    },
    {
      jurisdiction: 'Data Protection',
      description: 'We comply with UK GDPR and Data Protection Act 2018',
      courts: 'ICO has regulatory authority over data protection matters'
    },
    {
      jurisdiction: 'Consumer Rights',
      description: 'Consumer Rights Act 2015 applies to consumer users',
      courts: 'Consumer protection laws remain in full effect'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our government services platform.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: January 15, 2024
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Version 3.2
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="terms">Service Terms</TabsTrigger>
              <TabsTrigger value="conduct">User Conduct</TabsTrigger>
              <TabsTrigger value="liability">Liability</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Agreement Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <FileText className="h-5 w-5 mr-2" />
                    Agreement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-800">
                    <p>
                      By using GOVWHIZ, you agree to these terms of service. This is a legally binding agreement 
                      between you and GOVWHIZ Ltd.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Free to use for basic government services</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Must be 16 or older to create an account</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Your data is protected under UK GDPR</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Terms may be updated with notice</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Definitions */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Definitions</CardTitle>
                  <CardDescription>
                    Important terms used throughout this agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Service</h4>
                        <p className="text-sm text-gray-700">
                          The GOVWHIZ platform, including website, mobile apps, and all related services
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">User/You</h4>
                        <p className="text-sm text-gray-700">
                          Any individual or organization using our service
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Content</h4>
                        <p className="text-sm text-gray-700">
                          Any information, data, text, or files submitted through our service
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Account</h4>
                        <p className="text-sm text-gray-700">
                          Your registered user profile and associated data
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">We/Us/GOVWHIZ</h4>
                        <p className="text-sm text-gray-700">
                          GOVWHIZ Ltd, a company registered in England and Wales
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Terms</h4>
                        <p className="text-sm text-gray-700">
                          This Terms of Service agreement and any updates
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acceptance and Changes */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      Acceptance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>By using our service, you confirm that you:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Are at least 16 years old</li>
                        <li>• Have legal capacity to enter contracts</li>
                        <li>• Agree to be bound by these terms</li>
                        <li>• Will comply with applicable laws</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                      Changes to Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>We may update these terms by:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Posting updated terms on our website</li>
                        <li>• Sending email notification to users</li>
                        <li>• Providing 30 days notice for material changes</li>
                        <li>• Continuing use constitutes acceptance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <div className="space-y-6">
                {serviceTerms.map((term, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        {term.title}
                      </CardTitle>
                      <CardDescription>{term.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {term.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span className="text-sm text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Service Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Service Modifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We reserve the right to modify, suspend, or discontinue any part of our service 
                      at any time. We will provide reasonable notice for significant changes.
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-1">Feature Updates</h4>
                        <p className="text-xs text-blue-700">New features may be added regularly</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-1">Service Changes</h4>
                        <p className="text-xs text-yellow-700">30 days notice for major changes</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h4 className="font-semibold text-red-900 mb-1">Discontinuation</h4>
                        <p className="text-xs text-red-700">90 days notice if service ends</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conduct" className="space-y-6">
              {/* Prohibited Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Prohibited Activities
                  </CardTitle>
                  <CardDescription>
                    The following activities are strictly prohibited when using our service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {prohibitedActivities.map((activity, index) => (
                      <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                        <span className="text-sm text-red-800">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enforcement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2" />
                    Enforcement Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      If you violate these terms, we may take the following actions:
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Warning Actions:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Email warning about violation</li>
                          <li>• Temporary restriction of features</li>
                          <li>• Required acknowledgment of terms</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Serious Actions:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Temporary account suspension</li>
                          <li>• Permanent account termination</li>
                          <li>• Legal action if necessary</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Your Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Account Security:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Use strong, unique passwords</li>
                        <li>• Enable two-factor authentication</li>
                        <li>• Keep contact information updated</li>
                        <li>• Report suspicious activity immediately</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Content Standards:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Provide accurate information</li>
                        <li>• Respect intellectual property</li>
                        <li>• Follow community guidelines</li>
                        <li>• Report inappropriate content</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="liability" className="space-y-6">
              <div className="space-y-6">
                {liabilityLimitations.map((limitation, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-orange-600" />
                        {limitation.type}
                      </CardTitle>
                      <CardDescription>{limitation.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-1">Limitation:</h4>
                        <p className="text-sm text-orange-800">{limitation.limitation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Disclaimer */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-900">Important Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-yellow-800">
                    <p>
                      Our service is provided "as is" without warranties of any kind. We make no 
                      guarantees about the accuracy, reliability, or availability of the service.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-1">No Warranty For:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Uninterrupted service operation</li>
                          <li>• Error-free functionality</li>
                          <li>• Compatibility with all systems</li>
                          <li>• Meeting specific requirements</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Maximum Liability:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Limited to £100 per incident</li>
                          <li>• Or amount paid in last 12 months</li>
                          <li>• Excludes indirect damages</li>
                          <li>• Subject to applicable law</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              {/* Governing Law */}
              <div className="space-y-6">
                {governingLaws.map((law, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Scale className="h-5 w-5 mr-2 text-blue-600" />
                        {law.jurisdiction}
                      </CardTitle>
                      <CardDescription>{law.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-1">Jurisdiction:</h4>
                        <p className="text-sm text-blue-800">{law.courts}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Dispute Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2" />
                    Dispute Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We encourage resolving disputes through the following process:
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                        <h4 className="font-semibold text-green-900 mb-1">Direct Contact</h4>
                        <p className="text-xs text-green-700">Contact our support team first</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                        <h4 className="font-semibold text-blue-900 mb-1">Mediation</h4>
                        <p className="text-xs text-blue-700">Attempt mediation if needed</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg text-center">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                        <h4 className="font-semibold text-purple-900 mb-1">Legal Action</h4>
                        <p className="text-xs text-purple-700">Court proceedings as last resort</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Severability */}
              <Card>
                <CardHeader>
                  <CardTitle>Severability and Entire Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>Severability:</strong> If any part of these terms is found to be unenforceable, 
                      the remaining provisions will continue in full force and effect.
                    </p>
                    <p>
                      <strong>Entire Agreement:</strong> These terms, together with our Privacy Policy, 
                      constitute the entire agreement between you and GOVWHIZ.
                    </p>
                    <p>
                      <strong>Assignment:</strong> You may not assign your rights under these terms. 
                      We may assign our rights to any affiliate or successor.
                    </p>
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
                      Legal Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Email:</h4>
                        <p className="text-sm text-gray-700">legal@govwhiz.uk</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Post:</h4>
                        <p className="text-sm text-gray-700">
                          Legal Department<br />
                          GOVWHIZ Ltd<br />
                          123 Government Street<br />
                          London, SW1A 1AA<br />
                          United Kingdom
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Response Time:</h4>
                        <Badge variant="outline">Within 5 business days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Company Name:</h4>
                        <p className="text-sm text-gray-700">GOVWHIZ Limited</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Registration:</h4>
                        <p className="text-sm text-gray-700">
                          Company No: 12345678<br />
                          Registered in England and Wales
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">VAT Number:</h4>
                        <p className="text-sm text-gray-700">GB 123 4567 89</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">ICO Registration:</h4>
                        <p className="text-sm text-gray-700">ZA123456</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Quick Reference</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">For Terms Questions:</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          legal@govwhiz.uk
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          0300 123 4567
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">For Service Issues:</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          support@govwhiz.uk
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          Online help center
                        </div>
                      </div>
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

export default TermsPage;