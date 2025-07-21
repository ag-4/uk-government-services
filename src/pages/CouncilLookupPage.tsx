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
  Users,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Building,
  Calendar,
  FileText,
  ExternalLink,
  Navigation,
  Info,
  AlertCircle,
  CheckCircle,
  Zap,
  Heart,
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
  PoundSterling
} from 'lucide-react';

interface Council {
  id: string;
  name: string;
  type: string;
  region: string;
  population: number;
  area: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;
  mayor: string;
  politicalControl: string;
  nextElection: string;
  councilTax: {
    bandA: number;
    bandB: number;
    bandC: number;
    bandD: number;
  };
  services: string[];
  rating: number;
  reviews: number;
  established: string;
  wards: number;
  councillors: number;
}

interface LocalService {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  location: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  reviews: number;
  distance: number;
  cost: string;
  accessibility: string[];
  languages: string[];
  onlineBooking: boolean;
  emergencyService: boolean;
  tags: string[];
  lastUpdated: string;
}

const CouncilLookupPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Mock council data
  const [councils, setCouncils] = useState<Council[]>([
    {
      id: '1',
      name: 'Westminster City Council',
      type: 'London Borough',
      region: 'London',
      population: 261000,
      area: '21.48 km²',
      website: 'https://www.westminster.gov.uk',
      phone: '020 7641 6000',
      email: 'info@westminster.gov.uk',
      address: 'Westminster City Hall, 64 Victoria Street',
      postcode: 'SW1E 6QP',
      mayor: 'Councillor Geoff Barraclough',
      politicalControl: 'Conservative',
      nextElection: '2026-05-07',
      councilTax: {
        bandA: 1065.42,
        bandB: 1243.00,
        bandC: 1420.56,
        bandD: 1598.13
      },
      services: ['Housing', 'Planning', 'Waste Collection', 'Social Services', 'Libraries', 'Parks'],
      rating: 4.2,
      reviews: 1247,
      established: '1965',
      wards: 20,
      councillors: 60
    },
    {
      id: '2',
      name: 'Birmingham City Council',
      type: 'Metropolitan Borough',
      region: 'West Midlands',
      population: 1141000,
      area: '267.77 km²',
      website: 'https://www.birmingham.gov.uk',
      phone: '0121 303 9944',
      email: 'info@birmingham.gov.uk',
      address: 'Council House, Victoria Square',
      postcode: 'B1 1BB',
      mayor: 'Councillor Muhammad Afzal',
      politicalControl: 'Labour',
      nextElection: '2026-05-07',
      councilTax: {
        bandA: 1156.89,
        bandB: 1349.71,
        bandC: 1542.52,
        bandD: 1735.34
      },
      services: ['Education', 'Housing', 'Transport', 'Waste Management', 'Social Care', 'Economic Development'],
      rating: 3.8,
      reviews: 2156,
      established: '1889',
      wards: 69,
      councillors: 101
    },
    {
      id: '3',
      name: 'Manchester City Council',
      type: 'Metropolitan Borough',
      region: 'Greater Manchester',
      population: 547000,
      area: '115.65 km²',
      website: 'https://www.manchester.gov.uk',
      phone: '0161 234 5000',
      email: 'info@manchester.gov.uk',
      address: 'Manchester Town Hall, Albert Square',
      postcode: 'M60 2LA',
      mayor: 'Councillor Donna Ludford',
      politicalControl: 'Labour',
      nextElection: '2026-05-07',
      councilTax: {
        bandA: 1234.56,
        bandB: 1440.32,
        bandC: 1646.08,
        bandD: 1851.84
      },
      services: ['Housing', 'Planning', 'Environmental Health', 'Licensing', 'Community Safety', 'Culture'],
      rating: 4.0,
      reviews: 1834,
      established: '1838',
      wards: 32,
      councillors: 96
    },
    {
      id: '4',
      name: 'Leeds City Council',
      type: 'Metropolitan Borough',
      region: 'West Yorkshire',
      population: 793000,
      area: '551.72 km²',
      website: 'https://www.leeds.gov.uk',
      phone: '0113 222 4444',
      email: 'info@leeds.gov.uk',
      address: 'Civic Hall, Calverley Street',
      postcode: 'LS1 1UR',
      mayor: 'Councillor Abigail Marshall Katung',
      politicalControl: 'Labour',
      nextElection: '2026-05-07',
      councilTax: {
        bandA: 1098.76,
        bandB: 1281.89,
        bandC: 1465.01,
        bandD: 1648.14
      },
      services: ['Adult Social Care', 'Children Services', 'Highways', 'Waste Collection', 'Libraries', 'Museums'],
      rating: 4.1,
      reviews: 1567,
      established: '1888',
      wards: 33,
      councillors: 99
    }
  ]);

  // Mock local services data
  const [localServices, setLocalServices] = useState<LocalService[]>([
    {
      id: '1',
      name: 'Westminster Register Office',
      description: 'Birth, death, and marriage registration services',
      category: 'registration',
      provider: 'Westminster City Council',
      location: 'Westminster',
      postcode: 'SW1E 6QP',
      phone: '020 7641 7471',
      email: 'registrars@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk/registrars',
      openingHours: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      rating: 4.3,
      reviews: 234,
      distance: 0.5,
      cost: 'Varies by service',
      accessibility: ['Wheelchair accessible', 'Hearing loop', 'Large print available'],
      languages: ['English', 'Spanish', 'French', 'Arabic'],
      onlineBooking: true,
      emergencyService: false,
      tags: ['Registration', 'Certificates', 'Weddings', 'Civil Partnerships'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Birmingham Central Library',
      description: 'Public library with books, computers, and community programs',
      category: 'library',
      provider: 'Birmingham City Council',
      location: 'Birmingham City Centre',
      postcode: 'B3 3HQ',
      phone: '0121 303 4511',
      email: 'central.library@birmingham.gov.uk',
      website: 'https://www.birmingham.gov.uk/libraries',
      openingHours: {
        monday: '9:00 AM - 8:00 PM',
        tuesday: '9:00 AM - 8:00 PM',
        wednesday: '9:00 AM - 8:00 PM',
        thursday: '9:00 AM - 8:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: '11:00 AM - 4:00 PM'
      },
      rating: 4.5,
      reviews: 567,
      distance: 1.2,
      cost: 'Free',
      accessibility: ['Wheelchair accessible', 'Lift access', 'Accessible toilets', 'Hearing loop'],
      languages: ['English', 'Urdu', 'Punjabi', 'Bengali'],
      onlineBooking: true,
      emergencyService: false,
      tags: ['Books', 'Computers', 'Study Space', 'Events', 'Children Programs'],
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Manchester Recycling Centre',
      description: 'Household waste recycling and disposal facility',
      category: 'waste',
      provider: 'Manchester City Council',
      location: 'Reliance Street',
      postcode: 'M11 4RZ',
      phone: '0161 234 5678',
      email: 'waste@manchester.gov.uk',
      website: 'https://www.manchester.gov.uk/recycling',
      openingHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 6:00 PM',
        saturday: '8:00 AM - 6:00 PM',
        sunday: '8:00 AM - 6:00 PM'
      },
      rating: 4.0,
      reviews: 189,
      distance: 2.1,
      cost: 'Free for residents',
      accessibility: ['Vehicle access', 'Staff assistance available'],
      languages: ['English'],
      onlineBooking: false,
      emergencyService: false,
      tags: ['Recycling', 'Waste Disposal', 'Household Items', 'Garden Waste'],
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      name: 'Leeds Housing Office',
      description: 'Housing services including applications, repairs, and advice',
      category: 'housing',
      provider: 'Leeds City Council',
      location: 'Merrion House',
      postcode: 'LS2 8DT',
      phone: '0113 222 4401',
      email: 'housing@leeds.gov.uk',
      website: 'https://www.leeds.gov.uk/housing',
      openingHours: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '10:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 4:30 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      },
      rating: 3.7,
      reviews: 412,
      distance: 0.8,
      cost: 'Free advice',
      accessibility: ['Wheelchair accessible', 'Hearing loop', 'Sign language interpreter available'],
      languages: ['English', 'Polish', 'Arabic', 'Urdu'],
      onlineBooking: true,
      emergencyService: true,
      tags: ['Housing Applications', 'Repairs', 'Homelessness', 'Housing Benefit'],
      lastUpdated: '2024-01-12'
    }
  ]);

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Globe, count: localServices.length },
    { id: 'registration', name: 'Registration', icon: FileText, count: localServices.filter(s => s.category === 'registration').length },
    { id: 'library', name: 'Libraries', icon: Building, count: localServices.filter(s => s.category === 'library').length },
    { id: 'waste', name: 'Waste & Recycling', icon: RefreshCw, count: localServices.filter(s => s.category === 'waste').length },
    { id: 'housing', name: 'Housing', icon: Home, count: localServices.filter(s => s.category === 'housing').length },
    { id: 'transport', name: 'Transport', icon: Bus, count: localServices.filter(s => s.category === 'transport').length },
    { id: 'health', name: 'Health', icon: Heart, count: localServices.filter(s => s.category === 'health').length }
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredCouncils = councils.filter(council =>
    council.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    council.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    council.postcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = localServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'distance':
        return a.distance - b.distance;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const handleLocationSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Mock location detection
      setUserLocation('Westminster, London');
    }, 1500);
  };

  const formatOpeningHours = (hours: any) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today as keyof typeof hours];
    return todayHours || 'Closed';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Council & Services Lookup</h1>
          <p className="text-xl text-gray-600 mb-6">
            Find your local council, discover nearby services, and access important local government information.
          </p>
          
          {/* Location Detection */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Input
                    placeholder="Enter your postcode or location..."
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                  />
                </div>
                <Button onClick={handleLocationSearch}>
                  <Navigation className="w-4 h-4 mr-2" />
                  Find My Location
                </Button>
              </div>
              {userLocation && (
                <div className="mt-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Location detected: {userLocation}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Council Search</TabsTrigger>
            <TabsTrigger value="services">Local Services</TabsTrigger>
            <TabsTrigger value="directory">Council Directory</TabsTrigger>
            <TabsTrigger value="compare">Compare Councils</TabsTrigger>
          </TabsList>

          {/* Council Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search councils by name, region, or postcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredCouncils.map((council) => (
                <Card key={council.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-2xl font-semibold mb-2">{council.name}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <Badge variant="secondary">{council.type}</Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {council.region}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {council.population.toLocaleString()} residents
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{council.rating}</span>
                            <span className="text-gray-500">({council.reviews} reviews)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium mb-2">Contact Information</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{council.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{council.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <a href={council.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Council Information</h3>
                            <div className="space-y-1 text-sm">
                              <div>Mayor: {council.mayor}</div>
                              <div>Political Control: {council.politicalControl}</div>
                              <div>Next Election: {new Date(council.nextElection).toLocaleDateString('en-GB')}</div>
                              <div>{council.wards} wards, {council.councillors} councillors</div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Services Provided</h3>
                          <div className="flex flex-wrap gap-2">
                            {council.services.map((service, index) => (
                              <Badge key={index} variant="outline">{service}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Council Tax (2024/25)</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>Band A: £{council.councilTax.bandA}</div>
                            <div>Band B: £{council.councilTax.bandB}</div>
                            <div>Band C: £{council.councilTax.bandC}</div>
                            <div>Band D: £{council.councilTax.bandD}</div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-48 space-y-3">
                        <Button className="w-full" onClick={() => setSelectedCouncil(council)}>
                          <Info className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Local Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search local services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
            </div>

            {/* Service Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              {serviceCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.count} services</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Services List */}
            <div className="grid gap-6">
              {sortedServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <Badge variant="secondary">{service.category}</Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {service.distance} miles away
                              </span>
                              <span className="flex items-center gap-1">
                                <PoundSterling className="w-4 h-4" />
                                {service.cost}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{service.rating}</span>
                            <span className="text-gray-500">({service.reviews})</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium mb-2">Contact & Location</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{service.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{service.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{service.location}, {service.postcode}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Opening Hours (Today)</h3>
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{formatOpeningHours(service.openingHours)}</span>
                              </div>
                              <div className="mt-2 space-y-1">
                                {service.onlineBooking && (
                                  <Badge variant="outline" className="mr-2">
                                    <Globe className="w-3 h-3 mr-1" />
                                    Online Booking
                                  </Badge>
                                )}
                                {service.emergencyService && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Emergency Service
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Accessibility & Languages</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {service.accessibility.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {service.languages.map((language, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Globe className="w-3 h-3 mr-1" />
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="lg:w-48 space-y-3">
                        <Button className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                        {service.onlineBooking && (
                          <Button variant="outline" className="w-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Online
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Council Directory Tab */}
          <TabsContent value="directory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {councils.map((council) => (
                <Card key={council.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{council.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{council.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{council.name}</h3>
                    <p className="text-gray-600 mb-3">{council.region}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{council.population.toLocaleString()} residents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>{council.wards} wards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span>{council.councillors} councillors</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={() => setSelectedCouncil(council)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compare Councils Tab */}
          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Council Comparison Tool</CardTitle>
                <CardDescription>
                  Compare key metrics and services across different councils
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Council</th>
                        <th className="text-left p-3">Population</th>
                        <th className="text-left p-3">Council Tax (Band D)</th>
                        <th className="text-left p-3">Rating</th>
                        <th className="text-left p-3">Political Control</th>
                        <th className="text-left p-3">Services</th>
                      </tr>
                    </thead>
                    <tbody>
                      {councils.map((council) => (
                        <tr key={council.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{council.name}</div>
                              <div className="text-sm text-gray-500">{council.region}</div>
                            </div>
                          </td>
                          <td className="p-3">{council.population.toLocaleString()}</td>
                          <td className="p-3">£{council.councilTax.bandD}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{council.rating}</span>
                            </div>
                          </td>
                          <td className="p-3">{council.politicalControl}</td>
                          <td className="p-3">{council.services.length} services</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Council Details Modal */}
        {selectedCouncil && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">{selectedCouncil.name}</h1>
                  <Button variant="outline" onClick={() => setSelectedCouncil(null)}>
                    Close
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
                    <div className="space-y-2">
                      <div><strong>Address:</strong> {selectedCouncil.address}</div>
                      <div><strong>Postcode:</strong> {selectedCouncil.postcode}</div>
                      <div><strong>Phone:</strong> {selectedCouncil.phone}</div>
                      <div><strong>Email:</strong> {selectedCouncil.email}</div>
                      <div><strong>Website:</strong> 
                        <a href={selectedCouncil.website} className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                          {selectedCouncil.website}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Council Details</h2>
                    <div className="space-y-2">
                      <div><strong>Type:</strong> {selectedCouncil.type}</div>
                      <div><strong>Region:</strong> {selectedCouncil.region}</div>
                      <div><strong>Population:</strong> {selectedCouncil.population.toLocaleString()}</div>
                      <div><strong>Area:</strong> {selectedCouncil.area}</div>
                      <div><strong>Established:</strong> {selectedCouncil.established}</div>
                      <div><strong>Mayor:</strong> {selectedCouncil.mayor}</div>
                      <div><strong>Political Control:</strong> {selectedCouncil.politicalControl}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Services Provided</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedCouncil.services.map((service, index) => (
                      <Badge key={index} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Council Tax Bands (2024/25)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">Band A</div>
                      <div className="text-lg">£{selectedCouncil.councilTax.bandA}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">Band B</div>
                      <div className="text-lg">£{selectedCouncil.councilTax.bandB}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">Band C</div>
                      <div className="text-lg">£{selectedCouncil.councilTax.bandC}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">Band D</div>
                      <div className="text-lg">£{selectedCouncil.councilTax.bandD}</div>
                    </div>
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

export default CouncilLookupPage;