import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Building2, 
  FileText, 
  Users, 
  Bot, 
  Vote, 
  Shield, 
  ArrowRight,
  AlertCircle,
  PiggyBank,
  Stethoscope,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  Phone,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to services page with search query
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const quickServices = [
    {
      title: 'Find Your MP',
      description: 'Search for your Member of Parliament',
      icon: Users,
      link: '/mp-search',
      color: 'bg-blue-500'
    },
    {
      title: 'Council Services',
      description: 'Local council information and services',
      icon: Building2,
      link: '/council-lookup',
      color: 'bg-green-500'
    },
    {
      title: 'Track Bills',
      description: 'Follow parliamentary bills and legislation',
      icon: FileText,
      link: '/bill-tracker',
      color: 'bg-purple-500'
    },
    {
      title: 'Communication Templates',
      description: 'Ready-to-use templates for contacting MPs and councils',
      icon: MessageSquare,
      link: '/templates',
      color: 'bg-teal-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with government services',
      icon: Bot,
      link: '/ai-assistant',
      color: 'bg-orange-500'
    },
    {
      title: 'Your Rights',
      description: 'Understand your rights as a UK citizen',
      icon: Shield,
      link: '/rights',
      color: 'bg-red-500'
    },
    {
      title: 'Voting Information',
      description: 'Elections, registration, and voting guides',
      icon: Vote,
      link: '/voting',
      color: 'bg-indigo-500'
    }
  ];

  const serviceCategories = [
    { name: 'Benefits & Finance', icon: PiggyBank, link: '/services?category=benefits', count: '45+ services' },
    { name: 'Health & Care', icon: Stethoscope, link: '/services?category=health', count: '30+ services' },
    { name: 'Housing & Local', icon: Home, link: '/services?category=housing', count: '25+ services' },
    { name: 'Transport & Driving', icon: Car, link: '/services?category=transport', count: '20+ services' },
    { name: 'Education & Skills', icon: GraduationCap, link: '/services?category=education', count: '15+ services' },
    { name: 'Business & Work', icon: Briefcase, link: '/services?category=business', count: '35+ services' }
  ];

  const urgentAlerts = [
    {
      title: 'Council Tax Bills Due',
      message: 'Council tax payments are due by 31st January',
      link: '/local-services'
    },
    {
      title: 'Voter Registration Deadline',
      message: 'Register to vote by 25th January for upcoming elections',
      link: '/voting'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to GOVWHIZ
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Your gateway to UK government services, information, and support
            </p>
            
            {/* Functional Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services, information, or help..."
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-80">Services Available</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Online Access</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">650</div>
                <div className="text-sm opacity-80">MPs to Contact</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">400+</div>
                <div className="text-sm opacity-80">Local Councils</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Urgent Alerts */}
        {urgentAlerts.length > 0 && (
          <section className="mb-12">
            <div className="space-y-4">
              {urgentAlerts.map((alert, index) => (
                <div key={index} className="p-4 rounded-lg border-l-4 bg-yellow-50 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-3 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-gray-700">{alert.message}</p>
                      </div>
                    </div>
                    <Link to={alert.link}>
                      <Button variant="outline" size="sm">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Services */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fast access to the most commonly used government services
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Link key={index} to={service.link} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${service.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center text-blue-600 font-medium">
                        Access Service
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Service Categories */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find services organized by topic
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link key={index} to={category.link} className="group">
                  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="inline-flex p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{category.count}</p>
                      <div className="flex items-center justify-center text-blue-600 font-medium">
                        Browse Services
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Communication Templates Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-8 text-white">
            <div className="text-center mb-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Communication Templates</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Ready-to-use templates for contacting your MP, council members, and government departments. 
                Save time with professionally written templates for common issues.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-2">10+</div>
                <div className="text-sm opacity-80">Template Categories</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-80">Ready Templates</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-2">Easy</div>
                <div className="text-sm opacity-80">Customization</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-2">Free</div>
                <div className="text-sm opacity-80">Download</div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/templates">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3">
                  Browse All Templates
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get support and assistance with government services
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Templates</h3>
                <p className="text-gray-600 mb-4">Ready-to-use communication templates</p>
                <Link to="/templates">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Get Templates
                    <FileText className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-gray-600 mb-4">Get instant help with government services</p>
                <Link to="/ai-assistant">
                  <Button className="w-full">
                    Start Chat
                    <MessageSquare className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Speak to a government services advisor</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Call Now
                    <Phone className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <HelpCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Centre</h3>
                <p className="text-gray-600 mb-4">Browse guides and FAQs</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Browse Help
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;