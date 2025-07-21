import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Star, 
  Clock, 
  TrendingUp,
  ExternalLink,
  PiggyBank,
  Stethoscope,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  Baby,
  Scale,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  type: 'online' | 'phone' | 'in-person' | 'postal';
  popularity: number;
  rating: number;
  estimatedTime: string;
  requirements: string[];
  link: string;
  isNew?: boolean;
  isUrgent?: boolean;
}

const ServicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Real UK government services data
  const services: Service[] = [
    {
      id: '1',
      title: 'Apply for Universal Credit',
      description: 'Apply for Universal Credit to help with living costs if you\'re on a low income or out of work',
      category: 'benefits',
      department: 'Department for Work and Pensions',
      type: 'online',
      popularity: 95,
      rating: 4.2,
      estimatedTime: '45 minutes',
      requirements: ['National Insurance number', 'Bank details', 'Housing costs'],
      link: 'https://www.gov.uk/universal-credit',
      isUrgent: true
    },
    {
      id: '2',
      title: 'Register to Vote',
      description: 'Register to vote in elections and referendums',
      category: 'voting',
      department: 'Electoral Commission',
      type: 'online',
      popularity: 88,
      rating: 4.5,
      estimatedTime: '5 minutes',
      requirements: ['National Insurance number', 'Address'],
      link: 'https://www.gov.uk/register-to-vote'
    },
    {
      id: '3',
      title: 'Apply for a Passport',
      description: 'Apply for or renew your UK passport online',
      category: 'travel',
      department: 'HM Passport Office',
      type: 'online',
      popularity: 92,
      rating: 4.3,
      estimatedTime: '30 minutes',
      requirements: ['Digital photo', 'Credit/debit card', 'Previous passport (if renewing)'],
      link: 'https://www.gov.uk/apply-renew-passport'
    },
    {
      id: '4',
      title: 'Book a Driving Test',
      description: 'Book your practical driving test online',
      category: 'transport',
      department: 'Driver and Vehicle Standards Agency',
      type: 'online',
      popularity: 85,
      rating: 4.1,
      estimatedTime: '10 minutes',
      requirements: ['Driving licence number', 'Theory test certificate', 'Credit/debit card'],
      link: 'https://www.gov.uk/book-driving-test'
    },
    {
      id: '5',
      title: 'NHS GP Registration',
      description: 'Register with a GP surgery near you',
      category: 'health',
      department: 'NHS',
      type: 'in-person',
      popularity: 90,
      rating: 4.4,
      estimatedTime: '20 minutes',
      requirements: ['ID document', 'Proof of address', 'NHS number (if known)'],
      link: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/'
    },
    {
      id: '6',
      title: 'Council Tax Support',
      description: 'Apply for help paying your council tax',
      category: 'housing',
      department: 'Local Council',
      type: 'online',
      popularity: 78,
      rating: 4.0,
      estimatedTime: '25 minutes',
      requirements: ['Income details', 'Savings information', 'Housing costs'],
      link: 'https://www.gov.uk/apply-council-tax-reduction'
    },
    {
      id: '7',
      title: 'Student Finance Application',
      description: 'Apply for student loans and grants for university',
      category: 'education',
      department: 'Student Loans Company',
      type: 'online',
      popularity: 82,
      rating: 4.2,
      estimatedTime: '60 minutes',
      requirements: ['University offer', 'Household income', 'Bank details'],
      link: 'https://www.gov.uk/student-finance'
    },
    {
      id: '8',
      title: 'Register a Birth',
      description: 'Register the birth of your child',
      category: 'family',
      department: 'General Register Office',
      type: 'in-person',
      popularity: 75,
      rating: 4.3,
      estimatedTime: '30 minutes',
      requirements: ['Birth certificate', 'ID documents', 'Appointment booking'],
      link: 'https://www.gov.uk/register-birth'
    },
    {
      id: '9',
      title: 'Business Registration',
      description: 'Register your business with Companies House',
      category: 'business',
      department: 'Companies House',
      type: 'online',
      popularity: 70,
      rating: 4.1,
      estimatedTime: '15 minutes',
      requirements: ['Company name', 'Director details', 'Registered address'],
      link: 'https://www.gov.uk/limited-company-formation',
      isNew: true
    },
    {
      id: '10',
      title: 'Report a Pothole',
      description: 'Report road defects to your local council',
      category: 'transport',
      department: 'Local Council',
      type: 'online',
      popularity: 65,
      rating: 3.8,
      estimatedTime: '5 minutes',
      requirements: ['Location details', 'Photo (optional)'],
      link: 'https://www.gov.uk/report-pothole'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: Globe },
    { value: 'benefits', label: 'Benefits & Finance', icon: PiggyBank },
    { value: 'health', label: 'Health & Care', icon: Stethoscope },
    { value: 'housing', label: 'Housing & Local', icon: Home },
    { value: 'transport', label: 'Transport & Driving', icon: Car },
    { value: 'education', label: 'Education & Skills', icon: GraduationCap },
    { value: 'business', label: 'Business & Work', icon: Briefcase },
    { value: 'family', label: 'Family & Children', icon: Baby },
    { value: 'voting', label: 'Voting & Elections', icon: Scale },
    { value: 'travel', label: 'Travel & Passports', icon: Globe }
  ];

  const serviceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'online', label: 'Online' },
    { value: 'phone', label: 'Phone' },
    { value: 'in-person', label: 'In Person' },
    { value: 'postal', label: 'Postal' }
  ];

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...services];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(service => service.type === selectedType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'online': return Globe;
      case 'phone': return Phone;
      case 'in-person': return MapPin;
      case 'postal': return Mail;
      default: return Globe;
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || Globe;
  };

  const popularServices = services
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  const newServices = services.filter(service => service.isNew);
  const urgentServices = services.filter(service => service.isUrgent);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Services</h1>
            <p className="text-xl text-gray-600 mb-8">
              Access all UK government services in one place
            </p>

            {/* Search and Filters */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>

            {/* Results Summary */}
            <div className="mt-6 text-gray-600">
              Showing {filteredServices.length} of {services.length} services
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.type);
                const CategoryIcon = getCategoryIcon(service.category);
                
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {service.department}
                              </Badge>
                              {service.isNew && (
                                <Badge className="text-xs bg-green-500">New</Badge>
                              )}
                              {service.isUrgent && (
                                <Badge variant="destructive" className="text-xs">Urgent</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ServiceIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {service.description}
                      </CardDescription>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{service.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Time needed:</span>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{service.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">You'll need:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {service.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {req}
                            </li>
                          ))}
                          {service.requirements.length > 2 && (
                            <li className="text-blue-600">+{service.requirements.length - 2} more</li>
                          )}
                        </ul>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => window.open(service.link, '_blank')}
                      >
                        Start Service
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularServices.map((service, index) => {
                const ServiceIcon = getServiceIcon(service.type);
                const CategoryIcon = getCategoryIcon(service.category);
                
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <CategoryIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {service.department}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {service.popularity}% popular
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {service.description}
                      </CardDescription>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(service.link, '_blank')}
                      >
                        Start Service
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            {newServices.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newServices.map((service) => {
                  const ServiceIcon = getServiceIcon(service.type);
                  const CategoryIcon = getCategoryIcon(service.category);
                  
                  return (
                    <Card key={service.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-green-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CategoryIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className="text-xs bg-green-500">New Service</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {service.department}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {service.description}
                        </CardDescription>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700" 
                          onClick={() => window.open(service.link, '_blank')}
                        >
                          Try New Service
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No new services at the moment.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-6">
            {urgentServices.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {urgentServices.map((service) => {
                  const ServiceIcon = getServiceIcon(service.type);
                  const CategoryIcon = getCategoryIcon(service.category);
                  
                  return (
                    <Card key={service.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-red-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <CategoryIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {service.department}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {service.description}
                        </CardDescription>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700" 
                          onClick={() => window.open(service.link, '_blank')}
                        >
                          Access Urgent Service
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No urgent services at the moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServicesPage;