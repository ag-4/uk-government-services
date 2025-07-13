import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send, Edit3, Heart, GraduationCap, Leaf, PoundSterling, MapPin, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const templateCategories = [
  {
    id: 'local-issues',
    name: 'Local Issues',
    templates: [
      {
        title: 'Housing Concerns',
        content: 'Dear [MP Name],\n\nI am writing to express my concerns about housing in our constituency...'
      },
      {
        title: 'Public Transport',
        content: 'Dear [MP Name],\n\nI would like to bring to your attention the current state of public transport services...'
      }
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental Issues',
    templates: [
      {
        title: 'Green Energy',
        content: 'Dear [MP Name],\n\nI am writing regarding the development of renewable energy in our area...'
      },
      {
        title: 'Local Conservation',
        content: 'Dear [MP Name],\n\nI would like to discuss the conservation efforts in our constituency...'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    templates: [
      {
        title: 'NHS Services',
        content: 'Dear [MP Name],\n\nI am concerned about the current state of NHS services in our area...'
      },
      {
        title: 'Mental Health Support',
        content: 'Dear [MP Name],\n\nI would like to discuss the availability of mental health services...'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    templates: [
      {
        title: 'School Funding',
        content: 'Dear [MP Name],\n\nI am writing about the current state of school funding in our constituency...'
      },
      {
        title: 'Higher Education',
        content: 'Dear [MP Name],\n\nI would like to discuss access to higher education in our area...'
      }
    ]
  }
];

export function MessageTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [mpName, setMpName] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
    setShowEditor(true);
  };

  const handleSendMessage = async () => {
    if (!mpName || !userDetails.name || !userDetails.email || !editedContent) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use Formspree to send message to MP
      const response = await fetch('https://formspree.io/f/xpzvgrkw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mpName: mpName,
          senderName: userDetails.name,
          senderEmail: userDetails.email,
          senderAddress: userDetails.address,
          templateTitle: selectedTemplate?.title,
          messageContent: editedContent,
          sentAt: new Date().toISOString(),
          _subject: `Message to ${mpName} - ${selectedTemplate?.title}`,
          _replyto: userDetails.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setSubmitStatus('success');
      setTimeout(() => {
        setShowEditor(false);
        setSubmitStatus('idle');
        setEditedContent('');
        setMpName('');
        setUserDetails({ name: '', address: '', email: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPreview && selectedTemplate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              ← Back to Templates
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Preview: {selectedTemplate.title}</CardTitle>
              <CardDescription>Template preview with placeholder content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {selectedTemplate.content}
                </pre>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
              <Button onClick={() => {
                setShowPreview(false);
                handleUseTemplate(selectedTemplate);
              }}>
                Use This Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (showEditor && selectedTemplate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              ← Back to Templates
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
                    value={mpName}
                    onChange={(e) => setMpName(e.target.value)}
                    placeholder="e.g., John Smith MP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    value={userDetails.name}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Email *</label>
                  <Input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Address</label>
                  <Input
                    value={userDetails.address}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Your constituency address"
                  />
                </div>
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
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={isSubmitting}
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Ready-to-Use Templates</h2>
          <p className="text-muted-foreground">
            Contact Your MP with Confidence: Use our professionally crafted message templates to
            communicate effectively about issues that matter to you and your community.
          </p>
        </div>

        <Tabs defaultValue="local-issues" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-4">
            {templateCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {templateCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="grid gap-4">
                  {category.templates.map((template, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{template.title}</CardTitle>
                        <CardDescription>
                          Professional template for addressing {category.name.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-sm">
                          {template.content}
                        </pre>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button onClick={() => handleUseTemplate(template)}>
                          <Send className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}