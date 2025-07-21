import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building2, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Car,
  Zap,
  Shield,
  Smartphone,
  Wifi,
  TreePine
} from 'lucide-react';

interface LocalService {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  rating: number;
  reviews: number;
  distance: number;
  services: string[];
  accessibility: boolean;
  onlineBooking: boolean;
  emergencyService: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  description: string;
  color: string;
}

interface CouncilInfo {
  name: string;
  type: string;
  population: number;
  area: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  councilLeader: string;
  nextElection: string;
  councilTax: string;
  services: string[];
}

const LocalServicesIntegration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState('London, UK');
  const [sortBy, setSortBy] = useState('distance');

  // Service Categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: <Heart className="w-6 h-6" />,
      count: 45,
      description: 'NHS services, GPs, hospitals, pharmacies',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'education',
      name: 'Education',
      icon: <GraduationCap className="w-6 h-6" />,
      count: 32,
      description: 'Schools, colleges, libraries, adult education',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'housing',
      name: 'Housing',
      icon: <Home className="w-6 h-6" />,
      count: 28,
      description: 'Council housing, housing benefits, repairs',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: <Car className="w-6 h-6" />,
      count: 23,
      description: 'Public transport, parking, road services',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: <Zap className="w-6 h-6" />,
      count: 19,
      description: 'Gas, electricity, water, waste management',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'social',
      name: 'Social Services',
      icon: <Users className="w-6 h-6" />,
      count: 34,
      description: 'Benefits, social care, family support',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: <Shield className="w-6 h-6" />,
      count: 12,
      description: 'Police, fire, ambulance, emergency contacts',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: <TreePine className="w-6 h-6" />,
      count: 16,
      description: 'Parks, recycling, environmental health',
      color: 'bg-green-100 text-green-600'
    }
  ];

  // Mock Local Services Data
  const localServices: LocalService[] = [
    {
      id: '1',
      name: 'Westminster City Council',
      category: 'social',
      description: 'Main council offices providing housing, benefits, and general council services',
      address: '64 Victoria Street, Westminster, London SW1E 6QP',
      phone: '020 7641 6000',
      email: 'info@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk',
      hours: 'Mon-Fri: 9:00-17:00',
      rating: 4.2,
      reviews: 1247,
      distance: 0.3,
      services: ['Housing Applications', 'Council Tax', 'Benefits', 'Planning Applications'],
      accessibility: true,
      onlineBooking: true,
      emergencyService: false
    },
    {
      id: '2',
      name: 'St. Mary\'s Hospital',
      category: 'healthcare',
      description: 'Major NHS hospital providing emergency and specialist care',
      address: 'Praed Street, Paddington, London W2 1NY',
      phone: '020 3312 6666',
      email: 'pals@imperial.nhs.uk',
      website: 'https://www.imperial.nhs.uk',
      hours: '24/7 Emergency',
      rating: 4.5,
      reviews: 2156,
      distance: 1.2,
      services: ['Emergency Care', 'Outpatients', 'Surgery', 'Maternity'],
      accessibility: true,
      onlineBooking: true,
      emergencyService: true
    },
    {
      id: '3',
      name: 'Westminster Library',
      category: 'education',
      description: 'Public library with books, computers, and community programs',
      address: '35 St. Martin\'s Street, London WC2H 7HP',
      phone: '020 7641 1300',
      email: 'libraries@westminster.gov.uk',
      website: 'https://www.westminster.gov.uk/libraries',
      hours: 'Mon-Sat: 9:00-20:00, Sun: 11:00-17:00',
      rating: 4.7,
      reviews: 892,
      distance: 0.8,
      services: ['Book Lending', 'Computer Access', 'Study Spaces', 'Events'],
      accessibility: true,
      onlineBooking: true,
      emergencyService: false
    },
    {
      id: '4',
      name: 'Paddington Police Station',
      category: 'emergency',
      description: 'Local police station for non-emergency police services',
      address: '252 Harrow Road, London W2 5ES',
      phone: '101',
      email: 'paddington.snt@met.police.uk',
      website: 'https://www.met.police.uk',
      hours: 'Mon-Sun: 7:00-23:00',
      rating: 3.8,
      reviews: 456,
      distance: 1.5,
      services: ['Crime Reporting', 'Lost Property', 'Community Support'],
      accessibility: true,
      onlineBooking: false,
      emergencyService: true
    },
    {
      id: '5',
      name: 'Hyde Park Medical Centre',
      category: 'healthcare',
      description: 'NHS GP practice with same-day appointments available',
      address: '23 Hyde Park Square, London W2 2LH',
      phone: '020 7723 3045',
      email: 'info@hydeparkmedical.nhs.uk',
      website: 'https://www.hydeparkmedical.co.uk',
      hours: 'Mon-Fri: 8:00-18:30',
      rating: 4.3,
      reviews: 634,
      distance: 0.6,
      services: ['GP Consultations', 'Vaccinations', 'Health Checks', 'Prescriptions'],
      accessibility: true,
      onlineBooking: true,
      emergencyService: false
    },
    {
      id: '6',
      name: 'Westminster Job Centre Plus',
      category: 'social',
      description: 'Employment support and benefits advice',
      address: '15 Tothill Street, London SW1H 9NA',
      phone: '0800 169 0310',
      email: 'westminster.jobcentre@dwp.gov.uk',
      website: 'https://www.gov.uk/contact-jobcentre-plus',
      hours: 'Mon-Fri: 9:00-17:00',
      rating: 3.5,
      reviews: 789,
      distance: 0.9,
      services: ['Job Search', 'Universal Credit', 'Work Coaching', 'Skills Training'],
      accessibility: true,
      onlineBooking: true,
      emergencyService: false
    }
  ];

  // Council Information
  const councilInfo: CouncilInfo = {
    name: 'Westminster City Council',
    type: 'London Borough',
    population: 261000,
    area: '21.48 km²',
    website: 'https://www.westminster.gov.uk',
    phone: '020 7641 6000',
    email: 'info@westminster.gov.uk',
    address: '64 Victoria Street, Westminster, London SW1E 6QP',
    councilLeader: 'Cllr Adam Hug',
    nextElection: 'May 2026',
    councilTax: 'Band D: £829.05',
    services: [
      'Housing Services',
      'Planning & Building Control',
      'Environmental Health',
      'Licensing',
      'Council Tax & Benefits',
      'Adult Social Care',
      'Children\'s Services',
      'Waste & Recycling'
    ]
  };

  const filteredServices = localServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Local Services Integration</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find and access local government services, healthcare, education, and community resources in your area.
        </p>
      </div>

      {/* Location & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <label className="text-sm font-semibold text-gray-700">Your Location</label>
                <Input
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="Enter your postcode or area"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">Search Services</label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for services..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="all">All Categories</option>
                {serviceCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Local Services</span>
          </TabsTrigger>
          <TabsTrigger value="council" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Council Info</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Service Categories</span>
          </TabsTrigger>
        </TabsList>

        {/* Local Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              {sortedServices.length} Services Found
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Within 5 miles of {userLocation}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedServices.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {service.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={serviceCategories.find(c => c.id === service.category)?.color}>
                        {serviceCategories.find(c => c.id === service.category)?.name}
                      </Badge>
                      {service.emergencyService && (
                        <Badge className="bg-red-100 text-red-600">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span>{service.address}</span>
                      <Badge variant="outline" className="text-xs">
                        {service.distance} miles
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{service.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>{service.hours}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({service.reviews} reviews)
                    </span>
                  </div>

                  {/* Services Offered */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Services Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.services.map((serviceItem, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {serviceItem}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center space-x-4 text-sm">
                    {service.accessibility && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Accessible</span>
                      </div>
                    )}
                    {service.onlineBooking && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Smartphone className="w-4 h-4" />
                        <span>Online Booking</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Council Information Tab */}
        <TabsContent value="council" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span>{councilInfo.name}</span>
              </CardTitle>
              <CardDescription>
                {councilInfo.type} serving {councilInfo.population.toLocaleString()} residents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span>{councilInfo.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span>{councilInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span>{councilInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <a href={councilInfo.website} className="text-blue-600 hover:underline">
                        {councilInfo.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Key Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Council Leader:</span>
                      <span className="font-semibold">{councilInfo.councilLeader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-semibold">{councilInfo.population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-semibold">{councilInfo.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Election:</span>
                      <span className="font-semibold">{councilInfo.nextElection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Council Tax (Band D):</span>
                      <span className="font-semibold">{councilInfo.councilTax}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Council Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Council Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {councilInfo.services.map((service, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4">
                <Button className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Contact Council</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map(category => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto p-3 rounded-full w-fit ${category.color}`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {category.count}
                  </div>
                  <p className="text-sm text-gray-600">Services Available</p>
                  <Button 
                    size="sm" 
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category.id);
                    }}
                  >
                    View Services
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <span>Service Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${category.color}`}>
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(category.count / 45) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalServicesIntegration;