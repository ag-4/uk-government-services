import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Eye, Edit3, Send, Copy, Check, AlertCircle, Heart, Leaf, GraduationCap, Building, Stethoscope, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  template: string;
  fields: string[];
}

// Template categories mapped to original MP templates
const templateCategories = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    color: 'bg-red-500',
    templates: [] as MessageTemplate[]
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'bg-purple-500',
    templates: [] as MessageTemplate[]
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: Leaf,
    color: 'bg-green-500',
    templates: [] as MessageTemplate[]
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: DollarSign,
    color: 'bg-blue-500',
    templates: [] as MessageTemplate[]
  },
  {
    id: 'local-issues',
    name: 'Local Issues',
    icon: Building,
    color: 'bg-orange-500',
    templates: [] as MessageTemplate[]
  }
];

export default function MessageTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [currentView, setCurrentView] = useState<'categories' | 'templates' | 'preview' | 'editor'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editedContent, setEditedContent] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [constituency, setConstituency] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderPostcode, setSenderPostcode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [allTemplates, setAllTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/data/message-templates.json');
      const templates: MessageTemplate[] = await response.json();
      setAllTemplates(templates);
      
      // Organize templates by category
      templateCategories.forEach(category => {
        category.templates = templates.filter(template => 
          template.category.toLowerCase() === category.id.replace('-', '')
        );
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading templates:', error);
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentView('templates');
  };

  const handlePreviewTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('preview');
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setEditedContent(template.template);
    setCurrentView('editor');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setSelectedTemplate(null);
  };

  const handleBackToTemplates = () => {
    setCurrentView('templates');
    setSelectedTemplate(null);
  };

  const fillTemplate = (template: string) => {
    let filledTemplate = template;
    
    // Replace MP-specific placeholders
    filledTemplate = filledTemplate.replace(/\[MP_NAME\]/g, recipientName || '[MP_NAME]');
    filledTemplate = filledTemplate.replace(/\[CONSTITUENCY\]/g, constituency || '[CONSTITUENCY]');
    filledTemplate = filledTemplate.replace(/\[YOUR_NAME\]/g, senderName || '[YOUR_NAME]');
    filledTemplate = filledTemplate.replace(/\[YOUR_ADDRESS\]/g, senderAddress || '[YOUR_ADDRESS]');
    filledTemplate = filledTemplate.replace(/\[YOUR_POSTCODE\]/g, senderPostcode || '[YOUR_POSTCODE]');
    
    return filledTemplate;
  };

  const handleSendMessage = async () => {
    if (!recipientEmail || !senderEmail || !senderName || !editedContent) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Fill template with user data
      const finalContent = fillTemplate(editedContent);
      
      const formData = new FormData();
      formData.append('name', senderName);
      formData.append('email', senderEmail);
      formData.append('message', finalContent);
      formData.append('recipient', recipientEmail);
      formData.append('mp_name', recipientName);
      formData.append('_replyto', senderEmail);
      formData.append('_subject', `Message from constituent: ${selectedTemplate?.title}`);
      formData.append('_next', window.location.href);

      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setTimeout(() => {
        setCurrentView('categories');
        setSubmitStatus('idle');
        setEditedContent('');
        setRecipientName('');
        setRecipientEmail('');
        setConstituency('');
        setSenderName('');
        setSenderEmail('');
        setSenderAddress('');
        setSenderPostcode('');
        setSelectedTemplate(null);
        setSelectedCategory(null);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading message templates...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'preview' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Button variant="outline" onClick={handleBackToTemplates}>
                ← Back to Templates
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Preview: {selectedTemplate.title}</CardTitle>
                <CardDescription>Template preview for contacting your MP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {selectedTemplate.template}
                  </pre>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleBackToTemplates}>
                  Close Preview
                </Button>
                <Button onClick={() => handleUseTemplate(selectedTemplate)}>
                  Use This Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'editor' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Button variant="outline" onClick={() => setCurrentView('preview')}>
                ← Back to Preview
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Compose Message: {selectedTemplate.title}</CardTitle>
                <CardDescription>Customize your message and send it to your MP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800">Message sent successfully!</span>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800">Failed to send message. Please try again.</span>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your MP's Name *</label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g., John Smith MP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Constituency *</label>
                    <Input
                      value={constituency}
                      onChange={(e) => setConstituency(e.target.value)}
                      placeholder="e.g., Uxbridge and South Ruislip"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email *</label>
                    <Input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Address</label>
                    <Input
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      placeholder="Your full address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Postcode</label>
                    <Input
                      value={senderPostcode}
                      onChange={(e) => setSenderPostcode(e.target.value)}
                      placeholder="e.g., SW1A 1AA"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">MP Email *</label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="MP's email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message Content *</label>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                    placeholder="Customize your message here..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCurrentView('preview')}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(fillTemplate(editedContent));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSubmitting || !recipientEmail || !senderEmail || !senderName}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render different views based on current state
  const renderContent = () => {
    switch (currentView) {
      case 'categories':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">MP Message Templates</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of professional templates to contact your Member of Parliament about important issues
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templateCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {category.templates.length} template{category.templates.length !== 1 ? 's' : ''} available
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={handleBackToCategories}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
              
              <div className="flex items-center gap-4 mb-6">
                {selectedCategory && (
                  <>
                    <div className={`w-12 h-12 ${selectedCategory.color} rounded-full flex items-center justify-center`}>
                      <selectedCategory.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{selectedCategory.name} Templates</h1>
                      <p className="text-gray-600">Choose a template to contact your MP</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {selectedCategory?.templates.map((template: MessageTemplate, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {template.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Template for contacting your MP about {template.title.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {template.template.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 4).map((field, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.fields.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
}