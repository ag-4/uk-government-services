import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Filter, Calendar, User, Tag, Eye, Heart, MessageSquare } from 'lucide-react';

const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const templates = [
    {
      id: 1,
      title: 'Freedom of Information Request',
      category: 'Legal',
      description: 'Template for requesting information from public bodies under the Freedom of Information Act 2000',
      downloads: 1250,
      rating: 4.8,
      lastUpdated: '2024-01-15',
      tags: ['FOI', 'Legal', 'Government'],
      content: `Dear [Public Body Name],

I am writing to request information under the Freedom of Information Act 2000.

Please provide the following information:
[Specify your request clearly and precisely]

If you need any clarification regarding this request, please contact me at [your contact details].

I would prefer to receive this information electronically if possible.

If you are unable to provide all the information requested, please provide as much as you can and explain why the remainder cannot be provided.

Thank you for your assistance.

Yours faithfully,
[Your Name]
[Date]`
    },
    {
      id: 2,
      title: 'Council Tax Appeal Letter',
      category: 'Local Government',
      description: 'Template for appealing council tax band assessments or billing errors',
      downloads: 890,
      rating: 4.6,
      lastUpdated: '2024-01-10',
      tags: ['Council Tax', 'Appeal', 'Local Government'],
      content: `Dear Council Tax Department,

I am writing to formally appeal my council tax assessment for the property at [Property Address].

Property Reference: [Reference Number]
Current Band: [Current Band]
Proposed Band: [Proposed Band]

Reasons for Appeal:
[List your reasons clearly]

I have enclosed the following supporting evidence:
- [List supporting documents]

I request that you review this assessment and adjust the council tax band accordingly.

Please acknowledge receipt of this appeal and advise me of the next steps in the process.

Yours faithfully,
[Your Name]
[Date]`
    },
    {
      id: 3,
      title: 'MP Constituency Inquiry',
      category: 'Political',
      description: 'Template for contacting your MP about local or national issues',
      downloads: 2100,
      rating: 4.9,
      lastUpdated: '2024-01-20',
      tags: ['MP', 'Constituency', 'Political'],
      content: `Dear [MP Name],

I am writing to you as my Member of Parliament for [Constituency Name] regarding [brief description of issue].

Background:
[Provide context and background information]

My Concerns:
[Clearly outline your concerns or the issue you want addressed]

What I'm Asking For:
[Specify what action you would like your MP to take]

This issue affects [explain who is affected - you personally, your community, etc.].

I would appreciate your support in [specific action] and would welcome the opportunity to discuss this matter further if needed.

Thank you for your time and consideration.

Yours sincerely,
[Your Name]
[Your Address]
[Your Contact Details]
[Date]`
    },
    {
      id: 4,
      title: 'Planning Permission Objection',
      category: 'Planning',
      description: 'Template for objecting to planning applications in your area',
      downloads: 675,
      rating: 4.5,
      lastUpdated: '2024-01-08',
      tags: ['Planning', 'Objection', 'Local Government'],
      content: `Dear Planning Department,

Re: Planning Application [Application Number] - [Address of Development]

I wish to object to the above planning application for the following reasons:

1. [First objection with detailed explanation]
2. [Second objection with detailed explanation]
3. [Third objection with detailed explanation]

Impact on Local Community:
[Explain how the development would affect the local area]

Planning Policy Concerns:
[Reference relevant local planning policies if applicable]

I request that this application be refused and that my objections be taken into consideration during the decision-making process.

Please confirm receipt of this objection and keep me informed of any developments.

Yours faithfully,
[Your Name]
[Your Address]
[Date]`
    },
    {
      id: 5,
      title: 'Benefits Appeal Letter',
      category: 'Benefits',
      description: 'Template for appealing benefit decisions or assessments',
      downloads: 1450,
      rating: 4.7,
      lastUpdated: '2024-01-12',
      tags: ['Benefits', 'Appeal', 'DWP'],
      content: `Dear Appeals Service,

I wish to appeal the decision made regarding my [Type of Benefit] claim.

Claim Details:
- National Insurance Number: [NI Number]
- Decision Date: [Date]
- Decision Reference: [Reference Number]

Grounds for Appeal:
[Clearly state why you disagree with the decision]

Supporting Evidence:
[List any evidence you are providing]

I believe the decision is incorrect because [provide detailed explanation].

I request that this decision be reviewed and overturned.

Please acknowledge receipt of this appeal and advise me of the next steps.

Yours faithfully,
[Your Name]
[Date]`
    },
    {
      id: 6,
      title: 'School Admission Appeal',
      category: 'Education',
      description: 'Template for appealing school admission decisions',
      downloads: 820,
      rating: 4.4,
      lastUpdated: '2024-01-05',
      tags: ['Education', 'School', 'Appeal'],
      content: `Dear School Admissions Appeal Panel,

I wish to appeal the decision to refuse my child admission to [School Name].

Child's Details:
- Name: [Child's Name]
- Date of Birth: [DOB]
- Application Reference: [Reference Number]

Grounds for Appeal:
[State your reasons for appeal]

Why This School is Important:
[Explain why this particular school is important for your child]

Supporting Evidence:
[List any supporting documents]

I believe my child should be offered a place at this school because [detailed explanation].

I look forward to the opportunity to present my case at the appeal hearing.

Yours faithfully,
[Your Name]
[Date]`
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Local Government', label: 'Local Government' },
    { value: 'Political', label: 'Political' },
    { value: 'Planning', label: 'Planning' },
    { value: 'Benefits', label: 'Benefits' },
    { value: 'Education', label: 'Education' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (template: any) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Letter Templates</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional templates for communicating with government bodies, councils, and public services
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTemplate ? (
            /* Template Detail View */
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedTemplate.title}</CardTitle>
                    <CardDescription className="text-lg">{selectedTemplate.description}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Back to Templates
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <Badge>{selectedTemplate.category}</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Download className="h-4 w-4 mr-1" />
                    {selectedTemplate.downloads} downloads
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Updated {selectedTemplate.lastUpdated}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Template Content:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button onClick={() => handleDownload(selectedTemplate)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Save to Favorites
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Templates Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {template.downloads}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {template.lastUpdated}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(template)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;