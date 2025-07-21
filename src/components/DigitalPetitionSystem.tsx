import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Share2,
  Heart,
  MessageSquare
} from 'lucide-react';

interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  signatures: number;
  target: number;
  status: 'active' | 'under-review' | 'responded' | 'closed';
  createdAt: string;
  deadline: string;
  tags: string[];
  response?: string;
}

const DigitalPetitionSystem: React.FC = () => {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPetition, setNewPetition] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });

  // Mock data for petitions
  useEffect(() => {
    const mockPetitions: Petition[] = [
      {
        id: '1',
        title: 'Increase NHS Funding for Mental Health Services',
        description: 'We petition the government to allocate additional funding specifically for mental health services within the NHS, addressing the growing mental health crisis.',
        category: 'healthcare',
        author: 'Dr. Sarah Johnson',
        signatures: 45678,
        target: 100000,
        status: 'active',
        createdAt: '2024-01-15',
        deadline: '2024-04-15',
        tags: ['NHS', 'Mental Health', 'Healthcare', 'Funding'],
        response: undefined
      },
      {
        id: '2',
        title: 'Implement 4-Day Working Week Trial',
        description: 'Request for a government-led trial of a 4-day working week across public sector organizations to improve work-life balance and productivity.',
        category: 'employment',
        author: 'Workers Union Coalition',
        signatures: 78234,
        target: 50000,
        status: 'under-review',
        createdAt: '2024-01-10',
        deadline: '2024-03-10',
        tags: ['Work-Life Balance', 'Employment', 'Productivity', 'Public Sector']
      },
      {
        id: '3',
        title: 'Ban Single-Use Plastics in Government Buildings',
        description: 'Petition to eliminate all single-use plastics from government buildings and events as part of environmental sustainability efforts.',
        category: 'environment',
        author: 'Green Future UK',
        signatures: 23456,
        target: 25000,
        status: 'responded',
        createdAt: '2024-01-05',
        deadline: '2024-02-05',
        tags: ['Environment', 'Sustainability', 'Plastic Ban', 'Government'],
        response: 'The government acknowledges this petition and is currently reviewing plastic usage policies across all departments.'
      },
      {
        id: '4',
        title: 'Improve Public Transport Accessibility',
        description: 'Enhance accessibility features across all public transport systems to better serve citizens with disabilities.',
        category: 'transport',
        author: 'Accessibility Rights Group',
        signatures: 34567,
        target: 40000,
        status: 'active',
        createdAt: '2024-01-20',
        deadline: '2024-05-20',
        tags: ['Accessibility', 'Public Transport', 'Disability Rights', 'Infrastructure']
      },
      {
        id: '5',
        title: 'Increase Education Funding for Primary Schools',
        description: 'Petition for increased government funding to primary schools to reduce class sizes and improve educational resources.',
        category: 'education',
        author: 'Parents & Teachers Alliance',
        signatures: 56789,
        target: 75000,
        status: 'active',
        createdAt: '2024-01-12',
        deadline: '2024-04-12',
        tags: ['Education', 'Primary Schools', 'Funding', 'Class Sizes']
      }
    ];
    setPetitions(mockPetitions);
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'transport', label: 'Transport' },
    { value: 'employment', label: 'Employment' },
    { value: 'housing', label: 'Housing' },
    { value: 'general', label: 'General' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || petition.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePetition = () => {
    if (newPetition.title && newPetition.description) {
      const petition: Petition = {
        id: Date.now().toString(),
        title: newPetition.title,
        description: newPetition.description,
        category: newPetition.category,
        author: 'Anonymous User',
        signatures: 1,
        target: 10000,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: newPetition.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      setPetitions([petition, ...petitions]);
      setNewPetition({ title: '', description: '', category: 'general', tags: '' });
      setActiveTab('browse');
    }
  };

  const handleSignPetition = (petitionId: string) => {
    setPetitions(petitions.map(petition => 
      petition.id === petitionId 
        ? { ...petition, signatures: petition.signatures + 1 }
        : petition
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Digital Petition System</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Make your voice heard. Create and sign petitions to influence government policy and drive positive change.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{petitions.length}</p>
                <p className="text-sm text-gray-600">Active Petitions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {petitions.reduce((sum, p) => sum + p.signatures, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Signatures</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {petitions.filter(p => p.status === 'responded').length}
                </p>
                <p className="text-sm text-gray-600">Government Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {petitions.filter(p => p.signatures >= p.target).length}
                </p>
                <p className="text-sm text-gray-600">Successful Petitions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Petitions</TabsTrigger>
          <TabsTrigger value="create">Create Petition</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search petitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Petitions List */}
          <div className="grid gap-6">
            {filteredPetitions.map(petition => (
              <Card key={petition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{petition.title}</CardTitle>
                      <CardDescription className="text-base">
                        {petition.description}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-4 ${getStatusColor(petition.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(petition.status)}
                        <span className="capitalize">{petition.status.replace('-', ' ')}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{petition.signatures.toLocaleString()} signatures</span>
                        <span>Target: {petition.target.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(petition.signatures / petition.target) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {petition.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Petition Info */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>By {petition.author}</span>
                      <span>Deadline: {new Date(petition.deadline).toLocaleDateString()}</span>
                    </div>

                    {/* Government Response */}
                    {petition.response && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Government Response:</h4>
                        <p className="text-blue-800">{petition.response}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => handleSignPetition(petition.id)}
                        className="flex-1"
                        disabled={petition.status === 'closed'}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Sign Petition
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discuss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Petition</span>
              </CardTitle>
              <CardDescription>
                Start a petition to bring about the change you want to see. Make sure your petition is clear, specific, and actionable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Petition Title *
                </label>
                <Input
                  placeholder="Enter a clear, compelling title for your petition"
                  value={newPetition.title}
                  onChange={(e) => setNewPetition({...newPetition, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPetition.category}
                  onChange={(e) => setNewPetition({...newPetition, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  placeholder="Explain why this petition is important and what specific action you want the government to take..."
                  value={newPetition.description}
                  onChange={(e) => setNewPetition({...newPetition, description: e.target.value})}
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  placeholder="e.g., healthcare, funding, NHS, mental health"
                  value={newPetition.tags}
                  onChange={(e) => setNewPetition({...newPetition, tags: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleCreatePetition}
                className="w-full"
                disabled={!newPetition.title || !newPetition.description}
              >
                Create Petition
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid gap-6">
            {petitions
              .sort((a, b) => b.signatures - a.signatures)
              .slice(0, 3)
              .map((petition, index) => (
                <Card key={petition.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                        #{index + 1} Trending
                      </div>
                      <Badge className={getStatusColor(petition.status)}>
                        {petition.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{petition.title}</CardTitle>
                    <CardDescription>{petition.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{petition.signatures.toLocaleString()} signatures</span>
                          <span>Target: {petition.target.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(petition.signatures / petition.target) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {petition.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button onClick={() => handleSignPetition(petition.id)}>
                          Sign Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalPetitionSystem;