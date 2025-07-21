import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin,
  Search,
  Filter,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Users,
  Building,
  Heart,
  GraduationCap,
  Car,
  Home,
  Briefcase,
  Shield,
  TreePine,
  Utensils,
  ShoppingCart,
  Camera,
  Music,
  Dumbbell,
  Baby,
  Accessibility,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Navigation,
  Calendar,
  DollarSign,
  Award,
  Info
} from 'lucide-react';

interface LocalService {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  rating: number;
  reviews: number;
  distance: number;
  isOpen: boolean;
  features: string[];
  accessibility: boolean;
  parking: boolean;
  publicTransport: boolean;
  bookingRequired: boolean;
  cost: 'free' | 'paid' | 'varies';
  lastUpdated: string;
}

interface LocalCouncil {
  name: string;
  area: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  services: string[];
  population: number;
  councilTax: string;
  nextElection: string;
  mayor: string;
}

const LocalServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('services');
  const [userLocation, setUserLocation] = useState('London, UK');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('distance');

  // Mock local services data
  const [localServices, setLocalServices] = useState<LocalService[]>([
    {
      id: '1',
      name: 'Westminster City Council',
      category: 'government',
      description: 'Local government services including council tax, housing, planning applications, and waste management.',
      address: 'Westminster City Hall, 64 Victoria Street',
      postcode: 'SW1E 6QP',
      phone: '020 7641 6000',
      email: 'info@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk',
      openingHours: 'Mon-Fri: 9:00-17:00',
      rating: 4.2,
      reviews: 1247,
      distance: 0.5,
      isOpen: true,
      features: ['Council Tax', 'Housing', 'Planning', 'Waste Management'],
      accessibility: true,
      parking: true,
      publicTransport: true,
      bookingRequired: false,
      cost: 'free',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'St. Mary\'s Hospital',
      category: 'healthcare',
      description: 'NHS hospital providing emergency care, outpatient services, and specialist treatments.',
      address: 'Praed Street, Paddington',
      postcode: 'W2 1NY',
      phone: '020 3312 6666',
      email: 'pals.stmarys@nhs.net',
      website: 'https://www.imperial.nhs.uk',
      openingHours: '24/7 Emergency, Outpatients: Mon-Fri 8:00-18:00',
      rating: 4.5,
      reviews: 2156,
      distance: 1.2,
      isOpen: true,
      features: ['Emergency Care', 'Outpatients', 'Specialist Care', 'Pharmacy'],
      accessibility: true,
      parking: true,
      publicTransport: true,
      bookingRequired: true,
      cost: 'free',
      lastUpdated: '2024-01-15'
    },
    {
      id: '3',
      name: 'Westminster Library',
      category: 'education',
      description: 'Public library with books, computers, study spaces, and community programs.',
      address: '35 St. Martin\'s Street',
      postcode: 'WC2H 7HP',
      phone: '020 7641 1300',
      email: 'libraries@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk/libraries',
      openingHours: 'Mon-Thu: 9:00-20:00, Fri-Sat: 9:00-17:00, Sun: 11:00-17:00',
      rating: 4.7,
      reviews: 892,
      distance: 0.8,
      isOpen: true,
      features: ['Books', 'Computers', 'Study Spaces', 'Events', 'WiFi'],
      accessibility: true,
      parking: false,
      publicTransport: true,
      bookingRequired: false,
      cost: 'free',
      lastUpdated: '2024-01-15'
    },
    {
      id: '4',
      name: 'Hyde Park Recreation Centre',
      category: 'recreation',
      description: 'Community sports and fitness centre with gym, swimming pool, and sports courts.',
      address: 'Serpentine Road, Hyde Park',
      postcode: 'W2 2UH',
      phone: '020 7298 2100',
      email: 'hydepark@better.org.uk',
      website: 'https://www.better.org.uk/leisure-centre/london/westminster/hyde-park-tennis-and-sports-centre',
      openingHours: 'Mon-Fri: 6:30-22:00, Sat-Sun: 8:00-20:00',
      rating: 4.3,
      reviews: 567,
      distance: 1.5,
      isOpen: true,
      features: ['Gym', 'Swimming Pool', 'Tennis Courts', 'Classes'],
      accessibility: true,
      parking: true,
      publicTransport: true,
      bookingRequired: true,
      cost: 'paid',
      lastUpdated: '2024-01-15'
    },
    {
      id: '5',
      name: 'Westminster Job Centre Plus',
      category: 'employment',
      description: 'Employment support services including job search assistance, benefits, and career guidance.',
      address: '180 Great Portland Street',
      postcode: 'W1W 5QZ',
      phone: '0345 604 3719',
      email: 'customer.services@dwp.gov.uk',
      website: 'https://www.gov.uk/contact-jobcentre-plus',
      openingHours: 'Mon-Fri: 9:00-17:00',
      rating: 3.8,
      reviews: 234,
      distance: 2.1,
      isOpen: true,
      features: ['Job Search', 'Benefits', 'Career Guidance', 'Training'],
      accessibility: true,
      parking: false,
      publicTransport: true,
      bookingRequired: true,
      cost: 'free',
      lastUpdated: '2024-01-15'
    },
    {
      id: '6',
      name: 'Westminster Community Centre',
      category: 'community',
      description: 'Community hub offering social services, events, and support groups for local residents.',
      address: '15 Great Smith Street',
      postcode: 'SW1P 3BL',
      phone: '020 7641 2000',
      email: 'community@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk/community-centres',
      openingHours: 'Mon-Fri: 9:00-21:00, Sat: 9:00-17:00',
      rating: 4.6,
      reviews: 445,
      distance: 0.7,
      isOpen: true,
      features: ['Events', 'Support Groups', 'Meeting Rooms', 'Café'],
      accessibility: true,
      parking: false,
      publicTransport: true,
      bookingRequired: false,
      cost: 'varies',
      lastUpdated: '2024-01-15'
    }
  ]);

  // Mock council data
  const [councilInfo, setCouncilInfo] = useState<LocalCouncil>({
    name: 'Westminster City Council',
    area: 'City of Westminster',
    website: 'https://www.westminster.gov.uk',
    phone: '020 7641 6000',
    email: 'info@westminster.gov.uk',
    address: 'Westminster City Hall, 64 Victoria Street, London SW1E 6QP',
    services: [
      'Council Tax',
      'Housing Services',
      'Planning Applications',
      'Waste & Recycling',
      'Parking Services',
      'Libraries',
      'Social Services',
      'Education Services'
    ],
    population: 261000,
    councilTax: 'Band D: £829.05 (2024/25)',
    nextElection: 'May 2026',
    mayor: 'Councillor Robert Rigby'
  });

  const categories = [
    { id: 'all', name: 'All Services', icon: Building, count: localServices.length },
    { id: 'government', name: 'Government', icon: Building, count: localServices.filter(s => s.category === 'government').length },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, count: localServices.filter(s => s.category === 'healthcare').length },
    { id: 'education', name: 'Education', icon: GraduationCap, count: localServices.filter(s => s.category === 'education').length },
    { id: 'employment', name: 'Employment', icon: Briefcase, count: localServices.filter(s => s.category === 'employment').length },
    { id: 'recreation', name: 'Recreation', icon: Dumbbell, count: localServices.filter(s => s.category === 'recreation').length },
    { id: 'community', name: 'Community', icon: Users, count: localServices.filter(s => s.category === 'community').length }
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredServices = localServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getCostBadgeColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'varies': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : Building;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Services</h1>
          <p className="text-xl text-gray-600 mb-6">
            Find government services, healthcare, education, and community resources in your area.
          </p>
          
          {/* Location and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>Current location: {userLocation}</span>
              <Button variant="outline" size="sm">Change Location</Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for services, facilities, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Local Services</TabsTrigger>
            <TabsTrigger value="council">Council Information</TabsTrigger>
            <TabsTrigger value="map">Service Map</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCategory === category.id ? 'ring-2 ring-primary bg-primary/5' : ''
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {selectedCategory === 'all' ? 'All Services' : categories.find(c => c.id === selectedCategory)?.name} 
                  <span className="text-gray-500 ml-2">({sortedServices.length} results)</span>
                </h2>
              </div>

              <div className="grid gap-6">
                {sortedServices.map((service) => {
                  const IconComponent = getCategoryIcon(service.category);
                  return (
                    <Card key={service.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Service Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-semibold">{service.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getCostBadgeColor(service.cost)}>
                                      {service.cost === 'free' ? 'Free' : service.cost === 'paid' ? 'Paid' : 'Varies'}
                                    </Badge>
                                    {service.isOpen ? (
                                      <Badge className="bg-green-100 text-green-800">Open</Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800">Closed</Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 mb-3">{service.description}</p>
                                
                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {service.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Rating and Reviews */}
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="flex items-center gap-1">
                                    {renderStars(service.rating)}
                                    <span className="ml-1 font-medium">{service.rating}</span>
                                  </div>
                                  <span className="text-gray-500">({service.reviews} reviews)</span>
                                  <span className="text-gray-500">• {service.distance} miles away</span>
                                </div>

                                {/* Accessibility Features */}
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {service.accessibility && (
                                    <div className="flex items-center gap-1">
                                      <Accessibility className="w-4 h-4" />
                                      <span>Accessible</span>
                                    </div>
                                  )}
                                  {service.parking && (
                                    <div className="flex items-center gap-1">
                                      <Car className="w-4 h-4" />
                                      <span>Parking</span>
                                    </div>
                                  )}
                                  {service.publicTransport && (
                                    <div className="flex items-center gap-1">
                                      <Navigation className="w-4 h-4" />
                                      <span>Public Transport</span>
                                    </div>
                                  )}
                                  {service.bookingRequired && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>Booking Required</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="lg:w-80 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <div>
                                  <div className="font-medium">{service.address}</div>
                                  <div className="text-sm text-gray-600">{service.postcode}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a href={`tel:${service.phone}`} className="text-primary hover:underline">
                                  {service.phone}
                                </a>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <a href={`mailto:${service.email}`} className="text-primary hover:underline">
                                  {service.email}
                                </a>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{service.openingHours}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button className="flex-1">
                                <Navigation className="w-4 h-4 mr-2" />
                                Get Directions
                              </Button>
                              <Button variant="outline">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Website
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Council Information Tab */}
          <TabsContent value="council" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  {councilInfo.name}
                </CardTitle>
                <CardDescription>
                  Local government information and services for {councilInfo.area}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Council Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{councilInfo.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${councilInfo.phone}`} className="text-primary hover:underline">
                            {councilInfo.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${councilInfo.email}`} className="text-primary hover:underline">
                            {councilInfo.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a href={councilInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Population:</span>
                          <span className="font-medium">{councilInfo.population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Council Tax (Band D):</span>
                          <span className="font-medium">{councilInfo.councilTax}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mayor:</span>
                          <span className="font-medium">{councilInfo.mayor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Election:</span>
                          <span className="font-medium">{councilInfo.nextElection}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Council Services */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Council Services</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {councilInfo.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Service Locations Map
                </CardTitle>
                <CardDescription>
                  Interactive map showing all local services in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive map would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Integration with mapping services like Google Maps or OpenStreetMap
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LocalServicesPage;