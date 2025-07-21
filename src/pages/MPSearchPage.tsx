import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Users,
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
  Heart as HeartSuit
} from 'lucide-react';

interface MP {
  id: string;
  name: string;
  party: string;
  constituency: string;
  region: string;
  email: string;
  phone: string;
  website: string;
  twitter: string;
  facebook: string;
  office: string;
  firstElected: string;
  majority: number;
  votesReceived: number;
  turnout: number;
  committees: string[];
  interests: string[];
  expenses: {
    year: string;
    total: number;
    office: number;
    staffing: number;
    accommodation: number;
    travel: number;
  }[];
  votingRecord: {
    attendance: number;
    votesFor: number;
    votesAgainst: number;
    abstentions: number;
  };
  biography: string;
  education: string[];
  previousJobs: string[];
  achievements: string[];
  keyIssues: string[];
  recentActivity: {
    date: string;
    type: string;
    title: string;
    description: string;
  }[];
  surgeryTimes: {
    day: string;
    time: string;
    location: string;
    bookingRequired: boolean;
  }[];
  rating: number;
  reviews: number;
  responseTime: string;
  languages: string[];
}

interface Constituency {
  id: string;
  name: string;
  region: string;
  mpId: string;
  population: number;
  area: string;
  demographics: {
    ageGroups: {
      '18-24': number;
      '25-34': number;
      '35-44': number;
      '45-54': number;
      '55-64': number;
      '65+': number;
    };
    ethnicity: {
      white: number;
      asian: number;
      black: number;
      mixed: number;
      other: number;
    };
    employment: {
      employed: number;
      unemployed: number;
      retired: number;
      student: number;
    };
  };
  electionResults: {
    year: number;
    winner: string;
    party: string;
    votes: number;
    majority: number;
    turnout: number;
    candidates: {
      name: string;
      party: string;
      votes: number;
      percentage: number;
    }[];
  }[];
  keyIssues: string[];
  localServices: string[];
  transport: string[];
  economy: {
    averageIncome: number;
    unemploymentRate: number;
    majorEmployers: string[];
    keyIndustries: string[];
  };
}

const MPSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null);
  const [selectedTab, setSelectedTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedParty, setSelectedParty] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock MP data
  const [mps, setMPs] = useState<MP[]>([
    {
      id: '1',
      name: 'Rt Hon Rishi Sunak MP',
      party: 'Conservative',
      constituency: 'Richmond (Yorks)',
      region: 'Yorkshire and The Humber',
      email: 'rishi.sunak.mp@parliament.uk',
      phone: '020 7219 1234',
      website: 'https://www.rishisunak.com',
      twitter: '@RishiSunak',
      facebook: 'RishiSunakMP',
      office: 'House of Commons, Westminster, London SW1A 0AA',
      firstElected: '2015-05-07',
      majority: 23059,
      votesReceived: 36693,
      turnout: 67.8,
      committees: ['Treasury Committee', 'Public Accounts Committee'],
      interests: ['Economic Policy', 'Technology', 'Small Business'],
      expenses: [
        {
          year: '2023-24',
          total: 45678,
          office: 15000,
          staffing: 25000,
          accommodation: 3000,
          travel: 2678
        }
      ],
      votingRecord: {
        attendance: 89.5,
        votesFor: 234,
        votesAgainst: 45,
        abstentions: 12
      },
      biography: 'Rishi Sunak is a British politician who has served as Prime Minister of the United Kingdom and Leader of the Conservative Party since October 2022. He previously served as Chancellor of the Exchequer from 2020 to 2022.',
      education: ['Winchester College', 'Lincoln College, Oxford', 'Stanford University'],
      previousJobs: ['Goldman Sachs Analyst', 'Partner at The Children\'s Investment Fund Management', 'Co-founder of Catamaran Ventures'],
      achievements: ['Youngest Chancellor in over 200 years', 'Implemented furlough scheme during COVID-19', 'First person of Indian heritage to serve as Prime Minister'],
      keyIssues: ['Economic Recovery', 'Digital Transformation', 'Climate Change', 'Education'],
      recentActivity: [
        {
          date: '2024-01-15',
          type: 'Speech',
          title: 'Economic Update to Parliament',
          description: 'Delivered statement on economic recovery and inflation targets'
        },
        {
          date: '2024-01-12',
          type: 'Meeting',
          title: 'Constituency Surgery',
          description: 'Met with local residents to discuss housing and transport issues'
        }
      ],
      surgeryTimes: [
        {
          day: 'Friday',
          time: '2:00 PM - 4:00 PM',
          location: 'Richmond Town Hall',
          bookingRequired: true
        }
      ],
      rating: 4.2,
      reviews: 1567,
      responseTime: '3-5 days',
      languages: ['English', 'Hindi']
    },
    {
      id: '2',
      name: 'Rt Hon Sir Keir Starmer KCB KC MP',
      party: 'Labour',
      constituency: 'Holborn and St Pancras',
      region: 'London',
      email: 'keir.starmer.mp@parliament.uk',
      phone: '020 7219 5678',
      website: 'https://www.keirstarmer.com',
      twitter: '@Keir_Starmer',
      facebook: 'KeirStarmerMP',
      office: 'House of Commons, Westminster, London SW1A 0AA',
      firstElected: '2015-05-07',
      majority: 27763,
      votesReceived: 36641,
      turnout: 68.2,
      committees: ['Home Affairs Committee', 'Justice Committee'],
      interests: ['Criminal Justice', 'Human Rights', 'Social Justice'],
      expenses: [
        {
          year: '2023-24',
          total: 42156,
          office: 14000,
          staffing: 23000,
          accommodation: 2800,
          travel: 2356
        }
      ],
      votingRecord: {
        attendance: 92.1,
        votesFor: 189,
        votesAgainst: 156,
        abstentions: 8
      },
      biography: 'Sir Keir Starmer is a British politician and barrister who has served as Leader of the Labour Party and Leader of the Opposition since 2020. He has been Member of Parliament for Holborn and St Pancras since 2015.',
      education: ['Reigate Grammar School', 'University of Leeds', 'St Edmund Hall, Oxford'],
      previousJobs: ['Barrister', 'Director of Public Prosecutions', 'Head of Crown Prosecution Service'],
      achievements: ['Knight Commander of the Order of the Bath', 'Former Director of Public Prosecutions', 'Leading human rights barrister'],
      keyIssues: ['Workers Rights', 'NHS Reform', 'Climate Action', 'Social Justice'],
      recentActivity: [
        {
          date: '2024-01-14',
          type: 'PMQs',
          title: 'Prime Minister\'s Questions',
          description: 'Questioned the PM on NHS waiting times and cost of living'
        },
        {
          date: '2024-01-11',
          type: 'Visit',
          title: 'Local Hospital Visit',
          description: 'Visited University College Hospital to meet with healthcare workers'
        }
      ],
      surgeryTimes: [
        {
          day: 'Saturday',
          time: '10:00 AM - 12:00 PM',
          location: 'Camden Town Hall',
          bookingRequired: true
        }
      ],
      rating: 4.0,
      reviews: 1234,
      responseTime: '2-4 days',
      languages: ['English']
    },
    {
      id: '3',
      name: 'Rt Hon Sir Ed Davey MP',
      party: 'Liberal Democrat',
      constituency: 'Kingston and Surbiton',
      region: 'London',
      email: 'ed.davey.mp@parliament.uk',
      phone: '020 7219 9012',
      website: 'https://www.eddavey.org.uk',
      twitter: '@EdwardJDavey',
      facebook: 'EdDaveyMP',
      office: 'House of Commons, Westminster, London SW1A 0AA',
      firstElected: '1997-05-01',
      majority: 4124,
      votesReceived: 25668,
      turnout: 72.1,
      committees: ['Business, Energy and Industrial Strategy Committee', 'Environmental Audit Committee'],
      interests: ['Climate Change', 'Energy Policy', 'Social Care'],
      expenses: [
        {
          year: '2023-24',
          total: 38945,
          office: 13000,
          staffing: 21000,
          accommodation: 2500,
          travel: 2445
        }
      ],
      votingRecord: {
        attendance: 88.7,
        votesFor: 167,
        votesAgainst: 203,
        abstentions: 15
      },
      biography: 'Sir Ed Davey is a British politician who has served as Leader of the Liberal Democrats since 2020. He has been Member of Parliament for Kingston and Surbiton since 1997.',
      education: ['Nottingham High School', 'Jesus College, Oxford'],
      previousJobs: ['Economics researcher', 'Management consultant', 'Secretary of State for Energy and Climate Change'],
      achievements: ['Knight Bachelor for political service', 'Former Secretary of State for Energy and Climate Change', 'Longest-serving Lib Dem MP'],
      keyIssues: ['Climate Emergency', 'Social Care Reform', 'Electoral Reform', 'European Relations'],
      recentActivity: [
        {
          date: '2024-01-13',
          type: 'Campaign',
          title: 'Climate Action Rally',
          description: 'Spoke at climate action rally in Kingston upon Thames'
        },
        {
          date: '2024-01-10',
          type: 'Debate',
          title: 'Social Care Debate',
          description: 'Led debate on social care funding in the House of Commons'
        }
      ],
      surgeryTimes: [
        {
          day: 'Friday',
          time: '6:00 PM - 8:00 PM',
          location: 'Kingston Liberal Club',
          bookingRequired: true
        }
      ],
      rating: 4.3,
      reviews: 892,
      responseTime: '1-3 days',
      languages: ['English', 'French']
    }
  ]);

  // Mock constituency data
  const [constituencies, setConstituencies] = useState<Constituency[]>([
    {
      id: '1',
      name: 'Richmond (Yorks)',
      region: 'Yorkshire and The Humber',
      mpId: '1',
      population: 54178,
      area: '1,455 km²',
      demographics: {
        ageGroups: {
          '18-24': 8.2,
          '25-34': 12.5,
          '35-44': 15.8,
          '45-54': 18.9,
          '55-64': 16.7,
          '65+': 27.9
        },
        ethnicity: {
          white: 96.8,
          asian: 1.2,
          black: 0.3,
          mixed: 1.1,
          other: 0.6
        },
        employment: {
          employed: 68.5,
          unemployed: 2.1,
          retired: 24.8,
          student: 4.6
        }
      },
      electionResults: [
        {
          year: 2019,
          winner: 'Rishi Sunak',
          party: 'Conservative',
          votes: 36693,
          majority: 23059,
          turnout: 67.8,
          candidates: [
            { name: 'Rishi Sunak', party: 'Conservative', votes: 36693, percentage: 63.9 },
            { name: 'Judith Cummins', party: 'Labour', votes: 13634, percentage: 23.7 },
            { name: 'Julia Mulligan', party: 'Liberal Democrat', votes: 4076, percentage: 7.1 }
          ]
        }
      ],
      keyIssues: ['Rural Economy', 'Transport Links', 'Housing Affordability', 'Broadband Access'],
      localServices: ['Richmond Hospital', 'Catterick Garrison', 'Yorkshire Dales National Park'],
      transport: ['A1(M) Motorway', 'East Coast Main Line', 'Local Bus Services'],
      economy: {
        averageIncome: 32500,
        unemploymentRate: 2.1,
        majorEmployers: ['Ministry of Defence', 'NHS', 'Tourism Industry'],
        keyIndustries: ['Defence', 'Agriculture', 'Tourism', 'Public Services']
      }
    }
  ]);

  const parties = ['Conservative', 'Labour', 'Liberal Democrat', 'SNP', 'Green', 'Reform UK', 'Plaid Cymru'];
  const regions = ['London', 'South East', 'South West', 'East of England', 'West Midlands', 'East Midlands', 'Yorkshire and The Humber', 'North West', 'North East', 'Scotland', 'Wales', 'Northern Ireland'];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMPs = mps.filter(mp => {
    const matchesSearch = mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mp.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mp.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = selectedParty === 'all' || mp.party === selectedParty;
    const matchesRegion = selectedRegion === 'all' || mp.region === selectedRegion;
    return matchesSearch && matchesParty && matchesRegion;
  });

  const sortedMPs = [...filteredMPs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'constituency':
        return a.constituency.localeCompare(b.constituency);
      case 'party':
        return a.party.localeCompare(b.party);
      case 'majority':
        return b.majority - a.majority;
      case 'firstElected':
        return new Date(a.firstElected).getTime() - new Date(b.firstElected).getTime();
      default:
        return 0;
    }
  });

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      'Conservative': 'bg-blue-100 text-blue-800',
      'Labour': 'bg-red-100 text-red-800',
      'Liberal Democrat': 'bg-yellow-100 text-yellow-800',
      'SNP': 'bg-yellow-100 text-yellow-800',
      'Green': 'bg-green-100 text-green-800',
      'Reform UK': 'bg-cyan-100 text-cyan-800',
      'Plaid Cymru': 'bg-green-100 text-green-800'
    };
    return colors[party] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your MP</h1>
          <p className="text-xl text-gray-600 mb-6">
            Search for Members of Parliament, view their profiles, voting records, and contact information.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">MP Search</TabsTrigger>
            <TabsTrigger value="constituencies">Constituencies</TabsTrigger>
            <TabsTrigger value="parties">By Party</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* MP Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by MP name, constituency, or party..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Parties</option>
                  {parties.map(party => (
                    <option key={party} value={party}>{party}</option>
                  ))}
                </select>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="name">Sort by Name</option>
                  <option value="constituency">Sort by Constituency</option>
                  <option value="party">Sort by Party</option>
                  <option value="majority">Sort by Majority</option>
                  <option value="firstElected">Sort by First Elected</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {sortedMPs.length} of {mps.length} MPs
              </p>
            </div>

            {/* MPs List */}
            <div className="grid gap-6">
              {sortedMPs.map((mp) => (
                <Card key={mp.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-2xl font-semibold mb-2">{mp.name}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <Badge className={getPartyColor(mp.party)}>{mp.party}</Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {mp.constituency}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                First elected: {formatDate(mp.firstElected)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{mp.rating}</span>
                            <span className="text-gray-500">({mp.reviews} reviews)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium mb-2">Contact Information</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{mp.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{mp.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <a href={mp.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                  Website
                                </a>
                              </div>
                              <div className="text-gray-500">
                                Response time: {mp.responseTime}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Election Results</h3>
                            <div className="space-y-1 text-sm">
                              <div>Majority: {mp.majority.toLocaleString()} votes</div>
                              <div>Votes received: {mp.votesReceived.toLocaleString()}</div>
                              <div>Turnout: {mp.turnout}%</div>
                              <div>Attendance: {mp.votingRecord.attendance}%</div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Key Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {mp.interests.map((interest, index) => (
                              <Badge key={index} variant="outline">{interest}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Committees</h3>
                          <div className="flex flex-wrap gap-2">
                            {mp.committees.map((committee, index) => (
                              <Badge key={index} variant="secondary">{committee}</Badge>
                            ))}
                          </div>
                        </div>

                        {mp.surgeryTimes.length > 0 && (
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Surgery Times</h3>
                            {mp.surgeryTimes.map((surgery, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                <span className="font-medium">{surgery.day}s:</span> {surgery.time} at {surgery.location}
                                {surgery.bookingRequired && <span className="text-red-600 ml-2">(Booking required)</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="lg:w-48 space-y-3">
                        <Button className="w-full" onClick={() => setSelectedMP(mp)}>
                          <Info className="w-4 h-4 mr-2" />
                          View Full Profile
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact MP
                        </Button>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Voting Record
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Constituencies Tab */}
          <TabsContent value="constituencies" className="space-y-6">
            <div className="grid gap-6">
              {constituencies.map((constituency) => (
                <Card key={constituency.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-semibold mb-2">{constituency.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {constituency.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {constituency.population.toLocaleString()} residents
                          </span>
                          <span>Area: {constituency.area}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Current MP</h3>
                        {(() => {
                          const mp = mps.find(m => m.id === constituency.mpId);
                          return mp ? (
                            <div className="space-y-2">
                              <div className="font-medium">{mp.name}</div>
                              <Badge className={getPartyColor(mp.party)}>{mp.party}</Badge>
                              <div className="text-sm text-gray-600">
                                Majority: {mp.majority.toLocaleString()} votes
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500">No MP data available</div>
                          );
                        })()}
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Demographics</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Age 65+:</span> {constituency.demographics.ageGroups['65+']}%
                          </div>
                          <div>
                            <span className="font-medium">Employment:</span> {constituency.demographics.employment.employed}%
                          </div>
                          <div>
                            <span className="font-medium">Unemployment:</span> {constituency.economy.unemploymentRate}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Economy</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Avg Income:</span> £{constituency.economy.averageIncome.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Key Industries:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {constituency.economy.keyIndustries.map((industry, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{industry}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Key Issues</h3>
                      <div className="flex flex-wrap gap-2">
                        {constituency.keyIssues.map((issue, index) => (
                          <Badge key={index} variant="secondary">{issue}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button onClick={() => setSelectedConstituency(constituency)}>
                        View Detailed Profile
                      </Button>
                      <Button variant="outline">
                        Election Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* By Party Tab */}
          <TabsContent value="parties" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parties.map((party) => {
                const partyMPs = mps.filter(mp => mp.party === party);
                return (
                  <Card key={party} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getPartyColor(party)}>{party}</Badge>
                        <span className="text-2xl font-bold text-gray-600">{partyMPs.length}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{party}</h3>
                      <p className="text-gray-600 mb-4">
                        {partyMPs.length} MP{partyMPs.length !== 1 ? 's' : ''} in Parliament
                      </p>
                      <div className="space-y-2">
                        {partyMPs.slice(0, 3).map((mp) => (
                          <div key={mp.id} className="text-sm">
                            <span className="font-medium">{mp.name}</span>
                            <span className="text-gray-500 ml-2">({mp.constituency})</span>
                          </div>
                        ))}
                        {partyMPs.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{partyMPs.length - 3} more MPs
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4" onClick={() => {
                        setSelectedParty(party);
                        setSelectedTab('search');
                      }}>
                        View All {party} MPs
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total MPs</p>
                      <p className="text-2xl font-bold">{mps.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Constituencies</p>
                      <p className="text-2xl font-bold">{constituencies.length}</p>
                    </div>
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Political Parties</p>
                      <p className="text-2xl font-bold">{parties.length}</p>
                    </div>
                    <Flag className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                      <p className="text-2xl font-bold">
                        {Math.round(mps.reduce((acc, mp) => acc + mp.votingRecord.attendance, 0) / mps.length)}%
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Party Breakdown</CardTitle>
                <CardDescription>Distribution of MPs by political party</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parties.map((party) => {
                    const count = mps.filter(mp => mp.party === party).length;
                    const percentage = (count / mps.length) * 100;
                    return (
                      <div key={party} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getPartyColor(party)}>{party}</Badge>
                          <span className="text-sm text-gray-600">{count} MPs</span>
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
          </TabsContent>
        </Tabs>

        {/* MP Details Modal */}
        {selectedMP && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{selectedMP.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getPartyColor(selectedMP.party)}>{selectedMP.party}</Badge>
                      <span className="text-gray-600">{selectedMP.constituency}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMP(null)}>
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Biography</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedMP.biography}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Voting Record</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{selectedMP.votingRecord.attendance}%</div>
                            <div className="text-sm text-gray-600">Attendance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{selectedMP.votingRecord.votesFor}</div>
                            <div className="text-sm text-gray-600">Votes For</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{selectedMP.votingRecord.votesAgainst}</div>
                            <div className="text-sm text-gray-600">Votes Against</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{selectedMP.votingRecord.abstentions}</div>
                            <div className="text-sm text-gray-600">Abstentions</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedMP.recentActivity.map((activity, index) => (
                            <div key={index} className="border-l-4 border-primary pl-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{activity.type}</Badge>
                                <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
                              </div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-gray-600 text-sm">{activity.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedMP.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedMP.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a href={selectedMP.website} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedMP.office}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Education & Career</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Education</h4>
                            <ul className="text-sm space-y-1">
                              {selectedMP.education.map((edu, index) => (
                                <li key={index} className="text-gray-600">• {edu}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Previous Jobs</h4>
                            <ul className="text-sm space-y-1">
                              {selectedMP.previousJobs.map((job, index) => (
                                <li key={index} className="text-gray-600">• {job}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Achievements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          {selectedMP.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{achievement}</span>
                            </li>
                          ))}
                        </ul>
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

export default MPSearchPage;