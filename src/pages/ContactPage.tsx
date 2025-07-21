import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  User,
  Building,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Calendar
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    urgent: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      method: 'Phone',
      title: 'Call Us',
      description: 'Speak directly with our support team',
      contact: '0300 123 4567',
      hours: 'Mon-Fri: 8am-6pm, Sat: 9am-1pm',
      icon: Phone,
      color: 'blue'
    },
    {
      method: 'Email',
      title: 'Email Support',
      description: 'Send us a detailed message',
      contact: 'support@govwhiz.uk',
      hours: 'Response within 24 hours',
      icon: Mail,
      color: 'green'
    },
    {
      method: 'Live Chat',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available on website',
      hours: 'Mon-Fri: 9am-5pm',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      method: 'Post',
      title: 'Postal Address',
      description: 'Send us a letter',
      contact: 'GOVWHIZ, PO Box 123, London, SW1A 1AA',
      hours: 'Allow 5-7 working days',
      icon: MapPin,
      color: 'orange'
    }
  ];

  const departments = [
    {
      name: 'General Enquiries',
      description: 'General questions about our services',
      email: 'enquiries@govwhiz.uk',
      phone: '0300 123 4567',
      responseTime: '24 hours'
    },
    {
      name: 'Technical Support',
      description: 'Website issues and technical problems',
      email: 'tech@govwhiz.uk',
      phone: '0300 123 4568',
      responseTime: '4 hours'
    },
    {
      name: 'Data Protection',
      description: 'Privacy and data protection queries',
      email: 'privacy@govwhiz.uk',
      phone: '0300 123 4569',
      responseTime: '48 hours'
    },
    {
      name: 'Accessibility',
      description: 'Accessibility support and feedback',
      email: 'accessibility@govwhiz.uk',
      phone: '0300 123 4570',
      responseTime: '24 hours'
    },
    {
      name: 'Press & Media',
      description: 'Media enquiries and press releases',
      email: 'press@govwhiz.uk',
      phone: '0300 123 4571',
      responseTime: '2 hours'
    }
  ];

  const faqs = [
    {
      question: 'How do I register to vote?',
      answer: 'You can register to vote online at gov.uk/register-to-vote. You\'ll need your National Insurance number and it takes about 5 minutes.',
      category: 'Voting'
    },
    {
      question: 'How can I find my local MP?',
      answer: 'Use our MP Search tool by entering your postcode. You can also visit parliament.uk/mps-lords-and-offices.',
      category: 'Parliament'
    },
    {
      question: 'How do I make a Freedom of Information request?',
      answer: 'Contact the relevant public authority directly with your request. They must respond within 20 working days.',
      category: 'Information'
    },
    {
      question: 'What ID do I need to vote?',
      answer: 'You need photo ID to vote in person. Accepted forms include passport, driving licence, or a free Voter Authority Certificate.',
      category: 'Voting'
    },
    {
      question: 'How do I complain about a government service?',
      answer: 'First contact the service provider directly. If unsatisfied, you can escalate to the Parliamentary and Health Service Ombudsman.',
      category: 'Services'
    }
  ];

  const officeLocations = [
    {
      name: 'London Office',
      address: '123 Westminster Street, London, SW1A 1AA',
      phone: '020 7123 4567',
      hours: 'Mon-Fri: 9am-5pm',
      services: ['General enquiries', 'Document collection', 'Appointments']
    },
    {
      name: 'Manchester Office',
      address: '456 Civic Centre, Manchester, M1 2AB',
      phone: '0161 123 4567',
      hours: 'Mon-Fri: 9am-5pm',
      services: ['Regional support', 'Local services', 'Consultations']
    },
    {
      name: 'Edinburgh Office',
      address: '789 Royal Mile, Edinburgh, EH1 1AA',
      phone: '0131 123 4567',
      hours: 'Mon-Fri: 9am-5pm',
      services: ['Scottish services', 'Devolved matters', 'Local support']
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team for support, feedback, or general enquiries
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Quick Contact Methods */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow bg-${method.color}-50 border-${method.color}-200`}>
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 bg-${method.color}-100 rounded-full w-fit mx-auto mb-4`}>
                      <IconComponent className={`h-6 w-6 text-${method.color}-600`} />
                    </div>
                    <h3 className={`font-semibold text-${method.color}-900 mb-2`}>{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <p className="text-sm font-medium text-gray-900 mb-1">{method.contact}</p>
                    <p className="text-xs text-gray-500">{method.hours}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="contact" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="contact">Contact Form</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="offices">Offices</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-6">
              {!isSubmitted ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name *</label>
                          <Input
                            value={contactForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            value={contactForm.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select a category</option>
                            <option value="general">General Enquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="feedback">Feedback</option>
                            <option value="complaint">Complaint</option>
                            <option value="accessibility">Accessibility</option>
                            <option value="data">Data Protection</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Subject *</label>
                          <Input
                            value={contactForm.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="Brief description of your enquiry"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <Textarea
                          value={contactForm.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Please provide details about your enquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="urgent"
                          checked={contactForm.urgent}
                          onChange={(e) => handleInputChange('urgent', e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="urgent" className="text-sm">
                          This is urgent and requires immediate attention
                        </label>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <Button type="submit" className="flex-1">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button type="button" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Message Sent Successfully!</h2>
                    <p className="text-green-700 mb-4">
                      Thank you for contacting us. We've received your message and will respond within 24 hours.
                    </p>
                    <p className="text-sm text-green-600">
                      Reference number: #MSG-{Date.now().toString().slice(-6)}
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {departments.map((dept, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        {dept.name}
                      </CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{dept.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{dept.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Response time: {dept.responseTime}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Department
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="offices" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {officeLocations.map((office, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {office.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Address:</h4>
                          <p className="text-sm text-gray-700">{office.address}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Phone:</h4>
                          <p className="text-sm text-gray-700">{office.phone}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Hours:</h4>
                          <p className="text-sm text-gray-700">{office.hours}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Services:</h4>
                          <div className="flex flex-wrap gap-1">
                            {office.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-6">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                          {faq.question}
                        </CardTitle>
                        <Badge variant="outline">{faq.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Can't find what you're looking for?</h3>
                  <p className="text-blue-700 mb-4">
                    Our comprehensive help section has more detailed guides and information
                  </p>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Help Centre
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Feedback</CardTitle>
                  <CardDescription>
                    Help us improve our services by sharing your feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">How would you rate our service?</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">What did we do well?</label>
                      <Textarea placeholder="Tell us what you liked about our service..." rows={3} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">How can we improve?</label>
                      <Textarea placeholder="Share your suggestions for improvement..." rows={3} />
                    </div>
                    
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;