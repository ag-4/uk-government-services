import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Users, 
  FileText,
  Search,
  ExternalLink,
  Calendar,
  CreditCard,
  Home,
  Car,
  GraduationCap,
  Heart,
  Shield,
  Briefcase
} from 'lucide-react';

interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: string;
  department: string;
  type: 'online' | 'in-person' | 'phone' | 'hybrid';
  status: 'available' | 'limited' | 'unavailable';
  processingTime: string;
  cost: string;
  requirements: string[];
  url?: string;
  phone?: string;
  locations?: string[];
  rating: number;
  lastUpdated: string;
}

const GovernmentServicesHub: React.FC = () => {
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock government services data
  useEffect(() => {
    const mockServices: GovernmentService[] = [
      {
        id: '1',
        name: 'Apply for UK Passport',
        description: 'Apply for a new UK passport or renew your existing passport online or by post.',
        category: 'identity',
        department: 'HM Passport Office',
        type: 'hybrid',
        status: 'available',
        processingTime: '3-6 weeks',
        cost: '£82.50 - £93.50',
        requirements: ['Proof of identity', 'Passport photos', 'Supporting documents'],
        url: 'https://www.gov.uk/apply-renew-passport',
        phone: '0300 222 0000',
        rating: 4.2,
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        name: 'Register to Vote',
        description: 'Register to vote in UK elections and referendums.',
        category: 'civic',
        department: 'Electoral Commission',
        type: 'online',
        status: 'available',
        processingTime: 'Immediate',
        cost: 'Free',
        requirements: ['UK address', 'National Insurance number'],
        url: 'https://www.gov.uk/register-to-vote',
        rating: 4.8,
        lastUpdated: '2024-01-20'
      },
      {
        id: '3',
        name: 'Apply for Universal Credit',
        description: 'Apply for Universal Credit if you\'re on a low income or out of work.',
        category: 'benefits',
        department: 'Department for Work and Pensions',
        type: 'online',
        status: 'available',
        processingTime: '5 weeks',
        cost: 'Free',
        requirements: ['Bank details', 'Housing costs', 'Income details'],
        url: 'https://www.gov.uk/apply-universal-credit',
        phone: '0800 328 5644',
        rating: 3.9,
        lastUpdated: '2024-01-18'
      },
      {
        id: '4',
        name: 'Book Driving Test',
        description: 'Book your practical driving test online.',
        category: 'transport',
        department: 'Driver and Vehicle Standards Agency',
        type: 'online',
        status: 'available',
        processingTime: 'Varies by location',
        cost: '£62',
        requirements: ['Valid provisional licence', 'Theory test pass'],
        url: 'https://www.gov.uk/book-driving-test',
        phone: '0300 200 1122',
        rating: 4.1,
        lastUpdated: '2024-01-22'
      },
      {
        id: '5',
        name: 'Register Birth',
        description: 'Register the birth of your child in England and Wales.',
        category: 'family',
        department: 'General Register Office',
        type: 'in-person',
        status: 'available',
        processingTime: '42 days from birth',
        cost: 'Free (within 42 days)',
        requirements: ['Birth notification', 'Parent identification'],
        locations: ['Local Register Office'],
        rating: 4.5,
        lastUpdated: '2024-01-10'
      },
      {
        id: '6',
        name: 'Apply for Student Finance',
        description: 'Apply for student loans and grants for university or college.',
        category: 'education',
        department: 'Student Loans Company',
        type: 'online',
        status: 'available',
        processingTime: '6-8 weeks',
        cost: 'Free',
        requirements: ['University offer', 'Household income details', 'Bank details'],
        url: 'https://www.gov.uk/apply-for-student-finance',
        phone: '0300 100 0607',
        rating: 4.0,
        lastUpdated: '2024-01-25'
      },
      {
        id: '7',
        name: 'NHS GP Registration',
        description: 'Register with a local GP practice for NHS healthcare services.',
        category: 'health',
        department: 'NHS England',
        type: 'in-person',
        status: 'available',
        processingTime: '1-2 weeks',
        cost: 'Free',
        requirements: ['Proof of address', 'ID document', 'NHS number (if known)'],
        locations: ['Local GP Practices'],
        rating: 4.3,
        lastUpdated: '2024-01-12'
      },
      {
        id: '8',
        name: 'Council Tax Support',
        description: 'Apply for help paying your council tax if you\'re on a low income.',
        category: 'housing',
        department: 'Local Council',
        type: 'hybrid',
        status: 'available',
        processingTime: '4-6 weeks',
        cost: 'Free',
        requirements: ['Income details', 'Savings information', 'Housing details'],
        phone: 'Contact local council',
        rating: 3.8,
        lastUpdated: '2024-01-20'
      }
    ];
    setServices(mockServices);
  }, []);

  const categories = [
    { value: 'all', label: 'All Services', icon: Building2 },
    { value: 'identity', label: 'Identity & Documents', icon: FileText },
    { value: 'benefits', label: 'Benefits & Support', icon: Heart },
    { value: 'transport', label: 'Transport & Driving', icon: Car },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'health', label: 'Health & NHS', icon: Heart },
    { value: 'housing', label: 'Housing & Council', icon: Home },
    { value: 'civic', label: 'Civic & Voting', icon: Users },
    { value: 'family', label: 'Family & Children', icon: Users },
    { value: 'business', label: 'Business & Employment', icon: Briefcase }
  ];

  const serviceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'online', label: 'Online Only' },
    { value: 'in-person', label: 'In Person' },
    { value: 'phone', label: 'Phone' },
    { value: 'hybrid', label: 'Multiple Options' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Globe className="w-4 h-4" />;
      case 'in-person': return <Building2 className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'hybrid': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesType = selectedType === 'all' || service.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const popularServices = services
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <div
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </div>
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Government Services Hub</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access all UK government services in one place. Find, apply, and manage your government interactions easily.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                <p className="text-sm text-gray-600">Available Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter(s => s.type === 'online' || s.type === 'hybrid').length}
                </p>
                <p className="text-sm text-gray-600">Online Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Service Access</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Secure & Official</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-services">All Services</TabsTrigger>
          <TabsTrigger value="popular">Popular Services</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all-services" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search government services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
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
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-4 ${getStatusColor(service.status)}`}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{service.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(service.type)}
                        <span className="capitalize">{service.type.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{service.processingTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>{service.cost}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    {renderStars(service.rating)}

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.requirements.slice(0, 3).map(req => (
                          <Badge key={req} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {service.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {service.url && (
                        <Button className="flex-1" asChild>
                          <a href={service.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Service
                          </a>
                        </Button>
                      )}
                      {service.phone && (
                        <Button variant="outline" asChild>
                          <a href={`tel:${service.phone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {popularServices.map((service, index) => (
              <Card key={service.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      #{index + 1} Popular
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {renderStars(service.rating)}
                    <div className="text-sm text-gray-600">
                      <p><strong>Processing:</strong> {service.processingTime}</p>
                      <p><strong>Cost:</strong> {service.cost}</p>
                    </div>
                    {service.url && (
                      <Button className="w-full" asChild>
                        <a href={service.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Access Service
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(1).map(category => {
              const categoryServices = services.filter(s => s.category === category.value);
              const IconComponent = category.icon;
              
              return (
                <Card key={category.value} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.label}</CardTitle>
                        <CardDescription>
                          {categoryServices.length} services available
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryServices.slice(0, 3).map(service => (
                        <div key={service.id} className="flex justify-between items-center text-sm">
                          <span className="truncate">{service.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {service.type}
                          </Badge>
                        </div>
                      ))}
                      {categoryServices.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{categoryServices.length - 3} more services
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedCategory(category.value);
                        // Switch to all-services tab
                        const tabTrigger = document.querySelector('[value="all-services"]') as HTMLElement;
                        tabTrigger?.click();
                      }}
                    >
                      View All {category.label}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GovernmentServicesHub;