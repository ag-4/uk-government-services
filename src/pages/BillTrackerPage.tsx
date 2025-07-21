import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  Star,
  Building,
  FileText,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  MessageSquare,
  UserCheck,
  Shield,
  Lock,
  Unlock,
  Timer,
  Send,
  Edit,
  Trash2,
  Plus,
  Minus,
  RefreshCw,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Home,
  Car,
  Bus,
  Train,
  Plane,
  Bike,
  Walk,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  Package,
  Truck,
  Store,
  Tag,
  Percent,
  DollarSign,
  PoundSterling,
  Heart,
  BookOpen,
  GraduationCap,
  Briefcase,
  Scale,
  Gavel,
  Flag,
  Vote,
  Megaphone,
  Handshake,
  TreePine,
  Lightbulb,
  Zap,
  Wifi,
  Database,
  Server,
  Cloud,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  Camera,
  Video,
  Music,
  Image,
  Film,
  Mic,
  Speaker,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Radio,
  Tv,
  Gamepad2,
  Joystick,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Spade,
  Club,
  Diamond,
  Heart as HeartSuit,
  Users
} from 'lucide-react';

interface Bill {
  id: string;
  title: string;
  shortTitle: string;
  type: 'Government Bill' | 'Private Members Bill' | 'Private Bill' | 'Hybrid Bill';
  status: 'First Reading' | 'Second Reading' | 'Committee Stage' | 'Report Stage' | 'Third Reading' | 'Lords Amendments' | 'Royal Assent' | 'Withdrawn';
  introducedDate: string;
  lastUpdated: string;
  sponsor: string;
  department: string;
  summary: string;
  currentStage: string;
  nextStage: string;
  estimatedCompletion: string;
  publicationDate: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string[];
  relatedBills: string[];
  documents: {
    type: string;
    title: string;
    url: string;
    date: string;
  }[];
  amendments: {
    id: string;
    title: string;
    proposer: string;
    status: string;
    date: string;
  }[];
  debates: {
    date: string;
    chamber: 'House of Commons' | 'House of Lords';
    type: string;
    duration: string;
    speakers: number;
  }[];
  votes: {
    date: string;
    chamber: 'House of Commons' | 'House of Lords';
    type: string;
    result: 'Passed' | 'Rejected' | 'Withdrawn';
    votesFor: number;
    votesAgainst: number;
    abstentions: number;
  }[];
  timeline: {
    date: string;
    stage: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
  }[];
  keyProvisions: string[];
  stakeholders: string[];
  publicConsultation: {
    isOpen: boolean;
    startDate: string;
    endDate: string;
    responses: number;
    url: string;
  } | null;
  impactAssessment: {
    economic: string;
    social: string;
    environmental: string;
    regulatory: string;
  };
  parliamentaryPapers: string[];
  hansardReferences: string[];
  tags: string[];
  complexity: 'Low' | 'Medium' | 'High';
  publicInterest: 'Low' | 'Medium' | 'High';
  mediaAttention: 'Low' | 'Medium' | 'High';
  lobbyingActivity: 'Low' | 'Medium' | 'High';
}

const BillTrackerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedTab, setSelectedTab] = useState('current');
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock bills data
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      title: 'Digital Markets, Competition and Consumers Bill',
      shortTitle: 'Digital Markets Bill',
      type: 'Government Bill',
      status: 'Committee Stage',
      introducedDate: '2023-04-25',
      lastUpdated: '2024-01-15',
      sponsor: 'Rt Hon Kevin Hollinrake MP',
      department: 'Department for Business and Trade',
      summary: 'A Bill to make provision about digital markets, competition and consumer protection; to make provision about the regulation of digital markets; and for connected purposes.',
      currentStage: 'Public Bill Committee',
      nextStage: 'Report Stage',
      estimatedCompletion: '2024-06-30',
      publicationDate: '2023-04-25',
      category: 'Business and Economy',
      priority: 'High',
      impact: ['Digital Economy', 'Consumer Rights', 'Competition Law'],
      relatedBills: ['Data Protection and Digital Information Bill'],
      documents: [
        {
          type: 'Bill Text',
          title: 'Digital Markets, Competition and Consumers Bill (as introduced)',
          url: '#',
          date: '2023-04-25'
        },
        {
          type: 'Explanatory Notes',
          title: 'Explanatory Notes to the Digital Markets Bill',
          url: '#',
          date: '2023-04-25'
        },
        {
          type: 'Impact Assessment',
          title: 'Impact Assessment for Digital Markets Bill',
          url: '#',
          date: '2023-04-20'
        }
      ],
      amendments: [
        {
          id: 'A1',
          title: 'Amendment to Clause 15 - Consumer Protection',
          proposer: 'Rt Hon Stella Creasy MP',
          status: 'Tabled',
          date: '2024-01-10'
        },
        {
          id: 'A2',
          title: 'New Clause - Digital Rights',
          proposer: 'Caroline Lucas MP',
          status: 'Under Consideration',
          date: '2024-01-12'
        }
      ],
      debates: [
        {
          date: '2023-05-15',
          chamber: 'House of Commons',
          type: 'Second Reading',
          duration: '3 hours 45 minutes',
          speakers: 28
        },
        {
          date: '2023-12-07',
          chamber: 'House of Commons',
          type: 'Committee Stage Day 1',
          duration: '2 hours 30 minutes',
          speakers: 12
        }
      ],
      votes: [
        {
          date: '2023-05-15',
          chamber: 'House of Commons',
          type: 'Second Reading',
          result: 'Passed',
          votesFor: 342,
          votesAgainst: 154,
          abstentions: 8
        }
      ],
      timeline: [
        {
          date: '2023-04-25',
          stage: 'First Reading',
          description: 'Bill introduced and published',
          status: 'completed'
        },
        {
          date: '2023-05-15',
          stage: 'Second Reading',
          description: 'General debate on the principles of the Bill',
          status: 'completed'
        },
        {
          date: '2023-12-07',
          stage: 'Committee Stage',
          description: 'Detailed examination of the Bill clause by clause',
          status: 'current'
        },
        {
          date: '2024-03-15',
          stage: 'Report Stage',
          description: 'Further consideration of the Bill as amended',
          status: 'upcoming'
        },
        {
          date: '2024-04-20',
          stage: 'Third Reading',
          description: 'Final debate on the Bill in the House of Commons',
          status: 'upcoming'
        }
      ],
      keyProvisions: [
        'Establishes a new digital markets regime',
        'Creates powers to designate firms with Strategic Market Status',
        'Introduces conduct requirements for designated firms',
        'Strengthens consumer protection in digital markets',
        'Enhances competition enforcement powers'
      ],
      stakeholders: [
        'Competition and Markets Authority',
        'Ofcom',
        'Tech Industry',
        'Consumer Groups',
        'Small Businesses'
      ],
      publicConsultation: {
        isOpen: false,
        startDate: '2022-07-20',
        endDate: '2022-09-01',
        responses: 234,
        url: '#'
      },
      impactAssessment: {
        economic: 'Positive impact on competition and innovation, estimated £1.2bn annual benefit',
        social: 'Improved consumer choice and protection in digital services',
        environmental: 'Minimal direct environmental impact',
        regulatory: 'New regulatory framework for digital markets'
      },
      parliamentaryPapers: ['HC 123', 'HC 456'],
      hansardReferences: ['HC Deb 15 May 2023 col 123', 'HC Deb 7 Dec 2023 col 456'],
      tags: ['Digital', 'Competition', 'Consumer Protection', 'Technology', 'Regulation'],
      complexity: 'High',
      publicInterest: 'High',
      mediaAttention: 'High',
      lobbyingActivity: 'High'
    },
    {
      id: '2',
      title: 'Renters (Reform) Bill',
      shortTitle: 'Renters Reform Bill',
      type: 'Government Bill',
      status: 'Second Reading',
      introducedDate: '2023-05-17',
      lastUpdated: '2024-01-12',
      sponsor: 'Rt Hon Michael Gove MP',
      department: 'Department for Levelling Up, Housing and Communities',
      summary: 'A Bill to make provision about residential tenancies in England; to prohibit certain evictions and rent increases; and for connected purposes.',
      currentStage: 'Awaiting Second Reading',
      nextStage: 'Second Reading Debate',
      estimatedCompletion: '2024-09-30',
      publicationDate: '2023-05-17',
      category: 'Housing and Communities',
      priority: 'High',
      impact: ['Housing Market', 'Tenant Rights', 'Landlord Obligations'],
      relatedBills: ['Leasehold and Freehold Reform Bill'],
      documents: [
        {
          type: 'Bill Text',
          title: 'Renters (Reform) Bill (as introduced)',
          url: '#',
          date: '2023-05-17'
        },
        {
          type: 'Explanatory Notes',
          title: 'Explanatory Notes to the Renters (Reform) Bill',
          url: '#',
          date: '2023-05-17'
        }
      ],
      amendments: [],
      debates: [
        {
          date: '2023-05-17',
          chamber: 'House of Commons',
          type: 'First Reading',
          duration: '5 minutes',
          speakers: 1
        }
      ],
      votes: [],
      timeline: [
        {
          date: '2023-05-17',
          stage: 'First Reading',
          description: 'Bill introduced and published',
          status: 'completed'
        },
        {
          date: '2024-02-15',
          stage: 'Second Reading',
          description: 'General debate on the principles of the Bill',
          status: 'upcoming'
        }
      ],
      keyProvisions: [
        'Abolishes Section 21 no-fault evictions',
        'Introduces new grounds for possession',
        'Strengthens tenant rights and protections',
        'Creates a new ombudsman for private rented sector',
        'Establishes a property portal for landlords'
      ],
      stakeholders: [
        'National Residential Landlords Association',
        'Shelter',
        'Citizens Advice',
        'Local Authorities',
        'Property Industry'
      ],
      publicConsultation: {
        isOpen: false,
        startDate: '2022-06-16',
        endDate: '2022-08-11',
        responses: 4500,
        url: '#'
      },
      impactAssessment: {
        economic: 'Estimated cost to landlords £1.8bn over 10 years, benefits to tenants £2.3bn',
        social: 'Improved security and stability for 4.4 million private renters',
        environmental: 'Potential for improved energy efficiency standards',
        regulatory: 'New regulatory framework for private rented sector'
      },
      parliamentaryPapers: ['HC 789'],
      hansardReferences: ['HC Deb 17 May 2023 col 789'],
      tags: ['Housing', 'Tenants', 'Landlords', 'Reform', 'Rights'],
      complexity: 'High',
      publicInterest: 'High',
      mediaAttention: 'High',
      lobbyingActivity: 'High'
    },
    {
      id: '3',
      title: 'Online Safety Bill',
      shortTitle: 'Online Safety Bill',
      type: 'Government Bill',
      status: 'Royal Assent',
      introducedDate: '2022-03-17',
      lastUpdated: '2023-10-26',
      sponsor: 'Rt Hon Michelle Donelan MP',
      department: 'Department for Science, Innovation and Technology',
      summary: 'An Act to make provision for and in connection with the regulation by OFCOM of certain internet services; and for connected purposes.',
      currentStage: 'Royal Assent Received',
      nextStage: 'Implementation',
      estimatedCompletion: '2023-10-26',
      publicationDate: '2022-03-17',
      category: 'Technology and Digital',
      priority: 'High',
      impact: ['Online Safety', 'Social Media', 'Child Protection'],
      relatedBills: ['Data Protection and Digital Information Bill'],
      documents: [
        {
          type: 'Act Text',
          title: 'Online Safety Act 2023',
          url: '#',
          date: '2023-10-26'
        },
        {
          type: 'Explanatory Notes',
          title: 'Explanatory Notes to the Online Safety Act',
          url: '#',
          date: '2023-10-26'
        }
      ],
      amendments: [],
      debates: [
        {
          date: '2022-04-19',
          chamber: 'House of Commons',
          type: 'Second Reading',
          duration: '6 hours 15 minutes',
          speakers: 45
        },
        {
          date: '2023-09-19',
          chamber: 'House of Lords',
          type: 'Third Reading',
          duration: '2 hours 30 minutes',
          speakers: 18
        }
      ],
      votes: [
        {
          date: '2022-04-19',
          chamber: 'House of Commons',
          type: 'Second Reading',
          result: 'Passed',
          votesFor: 398,
          votesAgainst: 123,
          abstentions: 12
        },
        {
          date: '2023-09-19',
          chamber: 'House of Lords',
          type: 'Third Reading',
          result: 'Passed',
          votesFor: 285,
          votesAgainst: 46,
          abstentions: 8
        }
      ],
      timeline: [
        {
          date: '2022-03-17',
          stage: 'First Reading',
          description: 'Bill introduced and published',
          status: 'completed'
        },
        {
          date: '2022-04-19',
          stage: 'Second Reading',
          description: 'General debate on the principles of the Bill',
          status: 'completed'
        },
        {
          date: '2022-05-10',
          stage: 'Committee Stage',
          description: 'Detailed examination of the Bill clause by clause',
          status: 'completed'
        },
        {
          date: '2022-07-05',
          stage: 'Report Stage',
          description: 'Further consideration of the Bill as amended',
          status: 'completed'
        },
        {
          date: '2022-07-20',
          stage: 'Third Reading',
          description: 'Final debate on the Bill in the House of Commons',
          status: 'completed'
        },
        {
          date: '2023-10-26',
          stage: 'Royal Assent',
          description: 'Bill becomes an Act of Parliament',
          status: 'completed'
        }
      ],
      keyProvisions: [
        'Duty of care for online service providers',
        'Protection of children from harmful content',
        'Illegal content removal requirements',
        'Transparency reporting obligations',
        'Ofcom enforcement powers and penalties'
      ],
      stakeholders: [
        'Ofcom',
        'Tech Companies',
        'Child Safety Organizations',
        'Free Speech Advocates',
        'Digital Rights Groups'
      ],
      publicConsultation: null,
      impactAssessment: {
        economic: 'Estimated compliance costs £2.1bn annually, benefits from reduced harm £5.6bn',
        social: 'Improved online safety, particularly for children and vulnerable users',
        environmental: 'Minimal direct environmental impact',
        regulatory: 'New comprehensive regulatory framework for online services'
      },
      parliamentaryPapers: ['HC 234', 'HL 567'],
      hansardReferences: ['HC Deb 19 Apr 2022 col 234', 'HL Deb 19 Sep 2023 col 567'],
      tags: ['Online Safety', 'Social Media', 'Child Protection', 'Technology', 'Regulation'],
      complexity: 'High',
      publicInterest: 'High',
      mediaAttention: 'High',
      lobbyingActivity: 'High'
    }
  ]);

  const billTypes = ['Government Bill', 'Private Members Bill', 'Private Bill', 'Hybrid Bill'];
  const billStatuses = ['First Reading', 'Second Reading', 'Committee Stage', 'Report Stage', 'Third Reading', 'Lords Amendments', 'Royal Assent', 'Withdrawn'];
  const departments = [
    'Department for Business and Trade',
    'Department for Levelling Up, Housing and Communities',
    'Department for Science, Innovation and Technology',
    'HM Treasury',
    'Home Office',
    'Department for Transport',
    'Department of Health and Social Care',
    'Department for Education',
    'Ministry of Justice',
    'Department for Environment, Food and Rural Affairs'
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || bill.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || bill.department === selectedDepartment;
    
    if (selectedTab === 'current') {
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && 
             !['Royal Assent', 'Withdrawn'].includes(bill.status);
    } else if (selectedTab === 'completed') {
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && 
             bill.status === 'Royal Assent';
    } else if (selectedTab === 'withdrawn') {
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && 
             bill.status === 'Withdrawn';
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const sortedBills = [...filteredBills].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'lastUpdated':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'introducedDate':
        return new Date(b.introducedDate).getTime() - new Date(a.introducedDate).getTime();
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'First Reading': 'bg-blue-100 text-blue-800',
      'Second Reading': 'bg-purple-100 text-purple-800',
      'Committee Stage': 'bg-yellow-100 text-yellow-800',
      'Report Stage': 'bg-orange-100 text-orange-800',
      'Third Reading': 'bg-indigo-100 text-indigo-800',
      'Lords Amendments': 'bg-pink-100 text-pink-800',
      'Royal Assent': 'bg-green-100 text-green-800',
      'Withdrawn': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bill Tracker</h1>
          <p className="text-xl text-gray-600 mb-6">
            Track the progress of bills through Parliament, view voting records, and stay informed about legislative developments.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Bills</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Current Bills Tab */}
          <TabsContent value="current" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search bills by title, sponsor, department, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  {billTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  {billStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="lastUpdated">Sort by Last Updated</option>
                  <option value="title">Sort by Title</option>
                  <option value="introducedDate">Sort by Introduced Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {sortedBills.length} of {bills.length} bills
              </p>
            </div>

            {/* Bills List */}
            <div className="grid gap-6">
              {sortedBills.map((bill) => (
                <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-2xl font-semibold mb-2">{bill.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                              <Badge className={getPriorityColor(bill.priority)}>{bill.priority} Priority</Badge>
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {bill.department}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 mb-3">{bill.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium mb-2">Progress</h3>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-medium">Current Stage:</span> {bill.currentStage}
                              </div>
                              <div>
                                <span className="font-medium">Next Stage:</span> {bill.nextStage}
                              </div>
                              <div>
                                <span className="font-medium">Sponsor:</span> {bill.sponsor}
                              </div>
                              <div>
                                <span className="font-medium">Introduced:</span> {formatDate(bill.introducedDate)}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Key Information</h3>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-medium">Type:</span> {bill.type}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {bill.category}
                              </div>
                              <div>
                                <span className="font-medium">Last Updated:</span> {formatDate(bill.lastUpdated)}
                              </div>
                              <div>
                                <span className="font-medium">Est. Completion:</span> {formatDate(bill.estimatedCompletion)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Impact Areas</h3>
                          <div className="flex flex-wrap gap-2">
                            {bill.impact.map((area, index) => (
                              <Badge key={index} variant="outline">{area}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {bill.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>

                        {bill.publicConsultation && (
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Public Consultation</h3>
                            <div className="text-sm text-gray-600">
                              {bill.publicConsultation.isOpen ? (
                                <span className="text-green-600 font-medium">Open until {formatDate(bill.publicConsultation.endDate)}</span>
                              ) : (
                                <span>Closed - {bill.publicConsultation.responses} responses received</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:w-48 space-y-3">
                        <Button className="w-full" onClick={() => setSelectedBill(bill)}>
                          <Info className="w-4 h-4 mr-2" />
                          View Full Details
                        </Button>
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Read Bill Text
                        </Button>
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Voting History
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Timeline
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Track Bill
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Bills Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Completed Bills</h2>
              <p className="text-gray-600 mb-6">Bills that have received Royal Assent and become Acts of Parliament</p>
              
              <div className="grid gap-6">
                {bills.filter(bill => bill.status === 'Royal Assent').map((bill) => (
                  <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{bill.title}</h3>
                          <p className="text-gray-600">Became law on {formatDate(bill.lastUpdated)}</p>
                        </div>
                        <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{bill.summary}</p>
                      <div className="flex gap-3">
                        <Button onClick={() => setSelectedBill(bill)}>View Act Details</Button>
                        <Button variant="outline">Download Act Text</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Withdrawn Bills Tab */}
          <TabsContent value="withdrawn" className="space-y-6">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Withdrawn Bills</h2>
              <p className="text-gray-600 mb-6">Bills that have been withdrawn from the legislative process</p>
              
              <div className="text-gray-500">
                No withdrawn bills to display at this time.
              </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bills</p>
                      <p className="text-2xl font-bold">{bills.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold">
                        {bills.filter(bill => !['Royal Assent', 'Withdrawn'].includes(bill.status)).length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">
                        {bills.filter(bill => bill.status === 'Royal Assent').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">High Priority</p>
                      <p className="text-2xl font-bold">
                        {bills.filter(bill => bill.priority === 'High').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bills by Status</CardTitle>
                <CardDescription>Current distribution of bills across parliamentary stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billStatuses.map((status) => {
                    const count = bills.filter(bill => bill.status === status).length;
                    const percentage = bills.length > 0 ? (count / bills.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          <span className="text-sm text-gray-600">{count} bills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bills by Department</CardTitle>
                <CardDescription>Number of bills by sponsoring department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const count = bills.filter(bill => bill.department === dept).length;
                    if (count === 0) return null;
                    const percentage = (count / bills.length) * 100;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{dept}</span>
                          <span className="text-sm text-gray-600 ml-2">({count} bills)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bill Details Modal */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{selectedBill.title}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusColor(selectedBill.status)}>{selectedBill.status}</Badge>
                      <Badge className={getPriorityColor(selectedBill.priority)}>{selectedBill.priority} Priority</Badge>
                      <span className="text-gray-600">{selectedBill.department}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedBill(null)}>
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedBill.summary}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Provisions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedBill.keyProvisions.map((provision, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{provision}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedBill.timeline.map((stage, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className={`w-4 h-4 rounded-full mt-1 ${
                                stage.status === 'completed' ? 'bg-green-500' :
                                stage.status === 'current' ? 'bg-blue-500' :
                                'bg-gray-300'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{stage.stage}</span>
                                  <span className="text-sm text-gray-500">{formatDate(stage.date)}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{stage.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {selectedBill.votes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Voting History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedBill.votes.map((vote, index) => (
                              <div key={index} className="border-l-4 border-primary pl-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={vote.result === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {vote.result}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{formatDate(vote.date)}</span>
                                </div>
                                <h4 className="font-medium">{vote.type} - {vote.chamber}</h4>
                                <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                  <div>
                                    <span className="text-green-600 font-medium">{vote.votesFor}</span>
                                    <span className="text-gray-500"> For</span>
                                  </div>
                                  <div>
                                    <span className="text-red-600 font-medium">{vote.votesAgainst}</span>
                                    <span className="text-gray-500"> Against</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 font-medium">{vote.abstentions}</span>
                                    <span className="text-gray-500"> Abstentions</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Bill Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium">Sponsor:</span>
                          <p className="text-gray-600">{selectedBill.sponsor}</p>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <p className="text-gray-600">{selectedBill.type}</p>
                        </div>
                        <div>
                          <span className="font-medium">Introduced:</span>
                          <p className="text-gray-600">{formatDate(selectedBill.introducedDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <p className="text-gray-600">{formatDate(selectedBill.lastUpdated)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Est. Completion:</span>
                          <p className="text-gray-600">{formatDate(selectedBill.estimatedCompletion)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Impact Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Economic</h4>
                            <p className="text-sm text-gray-600">{selectedBill.impactAssessment.economic}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Social</h4>
                            <p className="text-sm text-gray-600">{selectedBill.impactAssessment.social}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Environmental</h4>
                            <p className="text-sm text-gray-600">{selectedBill.impactAssessment.environmental}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Regulatory</h4>
                            <p className="text-sm text-gray-600">{selectedBill.impactAssessment.regulatory}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedBill.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{doc.title}</p>
                                <p className="text-xs text-gray-500">{doc.type} - {formatDate(doc.date)}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Stakeholders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedBill.stakeholders.map((stakeholder, index) => (
                            <Badge key={index} variant="outline">{stakeholder}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillTrackerPage;