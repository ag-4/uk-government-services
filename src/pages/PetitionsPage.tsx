import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Search,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Filter,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Petition {
  id: string;
  title: string;
  description: string;
  creator: string;
  signatures: number;
  target: number;
  category: string;
  location: string;
  createdDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'under_review' | 'responded';
  tags: string[];
  governmentResponse?: string;
  responseDate?: string;
}

interface PetitionStats {
  totalPetitions: number;
  totalSignatures: number;
  activePetitions: number;
  governmentResponses: number;
  averageSignatures: number;
  successRate: number;
}

const PetitionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - in real implementation, this would come from UK Government Petitions API
  const [stats, setStats] = useState<PetitionStats>({
    totalPetitions: 15847,
    totalSignatures: 2847392,
    activePetitions: 1247,
    governmentResponses: 89,
    averageSignatures: 179,
    successRate: 12.4
  });

  const [petitions, setPetitions] = useState<Petition[]>([
    {
      id: "1",
      title: "Increase funding for NHS mental health services",
      description: "The NHS mental health services are severely underfunded, leading to long waiting times and inadequate care for those who need it most. We call on the government to increase funding by £2 billion annually.",
      creator: "Dr. Sarah Johnson",
      signatures: 127543,
      target: 100000,
      category: "Health",
      location: "United Kingdom",
      createdDate: "2024-01-10",
      deadline: "2024-07-10",
      status: "active",
      tags: ["NHS", "Mental Health", "Healthcare", "Funding"],
      governmentResponse: "The government recognizes the importance of mental health services and has committed to reviewing current funding levels.",
      responseDate: "2024-01-20"
    },
    {
      id: "2", 
      title: "Implement 4-day working week trial for public sector",
      description: "Evidence from other countries shows that a 4-day working week can improve productivity, work-life balance, and employee wellbeing without reducing output.",
      creator: "Workers Union Coalition",
      signatures: 89234,
      target: 100000,
      category: "Employment",
      location: "United Kingdom",
      createdDate: "2024-01-05",
      deadline: "2024-07-05",
      status: "active",
      tags: ["Work-Life Balance", "Productivity", "Public Sector", "Employment Rights"]
    },
    {
      id: "3",
      title: "Ban single-use plastics in all government buildings",
      description: "The government should lead by example in environmental protection by banning all single-use plastics in government buildings and events.",
      creator: "Green Future UK",
      signatures: 45678,
      target: 50000,
      category: "Environment",
      location: "United Kingdom", 
      createdDate: "2023-12-15",
      deadline: "2024-06-15",
      status: "under_review",
      tags: ["Environment", "Sustainability", "Plastic", "Government Policy"]
    },
    {
      id: "4",
      title: "Reduce university tuition fees to £3,000 per year",
      description: "Current tuition fees are creating a generation of students with unsustainable debt. We call for fees to be reduced to make higher education accessible to all.",
      creator: "Student Voice UK",
      signatures: 156789,
      target: 100000,
      category: "Education",
      location: "United Kingdom",
      createdDate: "2023-11-20",
      deadline: "2024-05-20",
      status: "responded",
      tags: ["Education", "Tuition Fees", "Students", "Higher Education"],
      governmentResponse: "The government is committed to ensuring higher education remains accessible while maintaining quality. We are reviewing the current fee structure as part of our comprehensive education policy review.",
      responseDate: "2024-01-15"
    }
  ]);

  const categories = [
    'all', 'Health', 'Education', 'Environment', 'Employment', 'Transport', 
    'Housing', 'Justice', 'Economy', 'Immigration', 'Defence', 'Other'
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || petition.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const trendingPetitions = petitions
    .filter(p => p.status === 'active')
    .sort((a, b) => b.signatures - a.signatures)
    .slice(0, 5);

  const handleSignPetition = (petitionId: string) => {
    setPetitions(prev => prev.map(petition => 
      petition.id === petitionId 
        ? { ...petition, signatures: petition.signatures + 1 }
        : petition
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': return <AlertTriangle className="w-4 h-4" />;
      case 'responded': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Petitions</h1>
          <p className="text-xl text-gray-600 mb-6">
            Make your voice heard. Create and sign petitions to influence government policy and bring about positive change.
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalPetitions.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Total Petitions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.totalSignatures.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Total Signatures</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.activePetitions.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Active Petitions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.governmentResponses}</div>
                <p className="text-xs text-gray-600">Gov Responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.averageSignatures}</div>
                <p className="text-xs text-gray-600">Avg Signatures</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.successRate}%</div>
                <p className="text-xs text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search petitions by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Petition
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Petitions</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="my-petitions">My Petitions</TabsTrigger>
          </TabsList>

          {/* Browse Petitions Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid gap-6">
              {filteredPetitions.map((petition) => (
                <Card key={petition.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{petition.title}</CardTitle>
                        <CardDescription className="text-base mb-3">
                          {petition.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Created by {petition.creator}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(petition.createdDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {petition.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(petition.status)} mb-2`}>
                          {getStatusIcon(petition.status)}
                          <span className="ml-1 capitalize">{petition.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-primary">
                          {petition.signatures.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600">
                          Target: {petition.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(petition.signatures / petition.target) * 100} 
                        className="h-3"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {Math.round((petition.signatures / petition.target) * 100)}% of target reached
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {petition.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Government Response */}
                    {petition.governmentResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Government Response
                        </h4>
                        <p className="text-blue-800 text-sm mb-2">{petition.governmentResponse}</p>
                        <p className="text-xs text-blue-600">
                          Responded on {new Date(petition.responseDate!).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleSignPetition(petition.id)}
                        disabled={petition.status !== 'active'}
                        className="flex-1"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Sign Petition
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {/* Deadline */}
                    <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Deadline: {new Date(petition.deadline).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Petitions
                </CardTitle>
                <CardDescription>
                  Most popular petitions gaining signatures rapidly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingPetitions.map((petition, index) => (
                    <div key={petition.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary w-8">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{petition.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{petition.description.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{petition.signatures.toLocaleString()} signatures</span>
                          <span>{petition.category}</span>
                          <span>by {petition.creator}</span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleSignPetition(petition.id)}>
                        Sign
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Petitions Tab */}
          <TabsContent value="my-petitions" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Petitions</h3>
              <p className="text-gray-600 mb-4">
                Sign in to view petitions you've created or signed.
              </p>
              <Button>Sign In</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Petition Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Petition</CardTitle>
                <CardDescription>
                  Start a petition to bring about the change you want to see
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Petition Title</label>
                  <Input placeholder="Enter a clear, compelling title for your petition" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="Explain why this petition is important and what you want to achieve"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Signatures</label>
                    <Input type="number" placeholder="e.g. 10000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <Input placeholder="e.g. healthcare, NHS, mental health" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">Create Petition</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetitionsPage;