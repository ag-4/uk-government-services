import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  Vote, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Search,
  BookOpen,
  HelpCircle,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

const RightsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const rights = [
    {
      id: 1,
      title: 'Freedom of Information',
      category: 'Information Rights',
      description: 'Your right to access information held by public authorities',
      details: 'Under the Freedom of Information Act 2000, you have the right to request information from public authorities. They must respond within 20 working days.',
      howToUse: 'Submit a written request to the public authority specifying the information you want.',
      limitations: 'Some information may be exempt, such as personal data or information that could harm national security.',
      relatedLaws: ['Freedom of Information Act 2000', 'Data Protection Act 2018'],
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Right to Vote',
      category: 'Democratic Rights',
      description: 'Your fundamental right to participate in democratic elections',
      details: 'All UK citizens aged 18 and over have the right to vote in general elections, local elections, and referendums.',
      howToUse: 'Register to vote and participate in elections. You can vote in person, by post, or by proxy.',
      limitations: 'You must be registered to vote and meet eligibility criteria.',
      relatedLaws: ['Representation of the People Act 1983', 'Political Parties, Elections and Referendums Act 2000'],
      icon: Vote,
      color: 'green'
    },
    {
      id: 3,
      title: 'Data Protection Rights',
      category: 'Privacy Rights',
      description: 'Your rights regarding how your personal data is processed',
      details: 'You have rights including access to your data, rectification, erasure, and portability under UK GDPR.',
      howToUse: 'Contact the data controller to exercise your rights. They must respond within one month.',
      limitations: 'Some exemptions apply for law enforcement, national security, and legitimate interests.',
      relatedLaws: ['Data Protection Act 2018', 'UK GDPR'],
      icon: Shield,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Right to Fair Trial',
      category: 'Legal Rights',
      description: 'Your right to a fair and public hearing by an independent tribunal',
      details: 'Everyone has the right to a fair trial, including the presumption of innocence and right to legal representation.',
      howToUse: 'If charged with a criminal offence, you have the right to legal representation and a fair hearing.',
      limitations: 'Some proceedings may be held in private for national security or to protect witnesses.',
      relatedLaws: ['Human Rights Act 1998', 'European Convention on Human Rights'],
      icon: Scale,
      color: 'red'
    },
    {
      id: 5,
      title: 'Right to Peaceful Assembly',
      category: 'Civil Rights',
      description: 'Your right to peaceful protest and assembly',
      details: 'You have the right to peaceful protest and assembly, subject to certain conditions and restrictions.',
      howToUse: 'Organize or participate in peaceful protests. Some events may require notification to police.',
      limitations: 'Protests must be peaceful and may be restricted if they pose risks to public safety.',
      relatedLaws: ['Human Rights Act 1998', 'Public Order Act 1986'],
      icon: Users,
      color: 'orange'
    },
    {
      id: 6,
      title: 'Right to Housing',
      category: 'Social Rights',
      description: 'Your rights regarding housing and homelessness',
      details: 'Local authorities have duties to provide housing assistance and prevent homelessness.',
      howToUse: 'Contact your local council if you are homeless or at risk of homelessness.',
      limitations: 'Eligibility criteria apply, and resources may be limited.',
      relatedLaws: ['Housing Act 1996', 'Homelessness Reduction Act 2017'],
      icon: Shield,
      color: 'teal'
    }
  ];

  const legalResources = [
    {
      title: 'Citizens Advice',
      description: 'Free, confidential advice on legal, financial, and other problems',
      website: 'https://www.citizensadvice.org.uk',
      phone: '03444 111 444',
      type: 'General Advice'
    },
    {
      title: 'Liberty',
      description: 'Human rights organization providing legal advice and representation',
      website: 'https://www.libertyhumanrights.org.uk',
      phone: '020 7403 3888',
      type: 'Human Rights'
    },
    {
      title: 'Law Society',
      description: 'Find a solicitor service for legal representation',
      website: 'https://www.lawsociety.org.uk',
      phone: '020 7242 1222',
      type: 'Legal Representation'
    },
    {
      title: 'Information Commissioner\'s Office',
      description: 'Data protection and freedom of information guidance',
      website: 'https://ico.org.uk',
      phone: '0303 123 1113',
      type: 'Data Protection'
    }
  ];

  const faqs = [
    {
      question: 'How do I make a Freedom of Information request?',
      answer: 'Submit a written request to the relevant public authority, clearly stating what information you want. The authority must respond within 20 working days.'
    },
    {
      question: 'What should I do if my human rights are violated?',
      answer: 'Contact a legal advisor, human rights organization, or solicitor. You may be able to take legal action under the Human Rights Act 1998.'
    },
    {
      question: 'How can I register to vote?',
      answer: 'You can register online at gov.uk/register-to-vote, by post, or in person at your local electoral registration office.'
    },
    {
      question: 'What are my rights if I\'m arrested?',
      answer: 'You have the right to remain silent, the right to legal representation, the right to have someone informed of your arrest, and the right to medical attention if needed.'
    },
    {
      question: 'How do I complain about data misuse?',
      answer: 'First, contact the organization directly. If unsatisfied, you can complain to the Information Commissioner\'s Office (ICO).'
    }
  ];

  const filteredRights = rights.filter(right =>
    right.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    right.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    right.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(rights.map(right => right.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Your Rights</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding your rights as a UK citizen and how to exercise them
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for rights, laws, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="rights" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rights">Your Rights</TabsTrigger>
              <TabsTrigger value="resources">Legal Resources</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>

            <TabsContent value="rights" className="space-y-6">
              {/* Rights Categories */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {categories.map((category) => (
                  <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {rights.filter(r => r.category === category).length} rights
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rights List */}
              <div className="space-y-6">
                {filteredRights.map((right) => {
                  const IconComponent = right.icon;
                  return (
                    <Card key={right.id} className="overflow-hidden">
                      <CardHeader className={`bg-${right.color}-50 border-b border-${right.color}-100`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 bg-${right.color}-100 rounded-lg mr-4`}>
                              <IconComponent className={`h-6 w-6 text-${right.color}-600`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{right.title}</CardTitle>
                              <Badge variant="outline" className="mt-1">{right.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-base mt-2">
                          {right.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <Info className="h-4 w-4 mr-2" />
                              What this means
                            </h4>
                            <p className="text-gray-700">{right.details}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              How to use this right
                            </h4>
                            <p className="text-gray-700">{right.howToUse}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Limitations
                            </h4>
                            <p className="text-gray-700">{right.limitations}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Related Laws
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {right.relatedLaws.map((law, index) => (
                                <Badge key={index} variant="secondary">{law}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {legalResources.map((resource, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {resource.title}
                        <Badge variant="outline">{resource.type}</Badge>
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{resource.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                          <a 
                            href={resource.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-6">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Making an FOI Request</CardTitle>
                    <CardDescription>Step-by-step guide to requesting information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Data Protection Rights</CardTitle>
                    <CardDescription>Understanding your data rights and how to use them</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Voting Rights</CardTitle>
                    <CardDescription>Everything you need to know about voting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Legal Aid</CardTitle>
                    <CardDescription>How to get legal help and representation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Human Rights</CardTitle>
                    <CardDescription>Your fundamental rights under UK law</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Complaints Process</CardTitle>
                    <CardDescription>How to complain about public services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RightsPage;