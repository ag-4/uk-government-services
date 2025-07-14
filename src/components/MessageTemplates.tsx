import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send, Edit3, Heart, GraduationCap, Leaf, PoundSterling, MapPin, Check, AlertCircle, ArrowLeft, Eye, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const templateCategories = [
  {
    id: 'local-issues',
    name: 'Local Issues',
    icon: MapPin,
    color: 'bg-blue-500',
    templates: [
      {
        title: 'Housing Concerns',
        description: 'Address housing affordability and availability issues in your constituency',
        content: `Dear [MP Name],

I hope this message finds you well. I am writing as a constituent of [Constituency Name] to express my concerns about the current housing situation in our area.

The lack of affordable housing has become a pressing issue that affects many families in our community. I have observed:

• Rising property prices that are outpacing local income growth
• Limited availability of social housing
• Young people unable to get on the property ladder
• Families being forced to move away from the area

I would be grateful if you could:
1. Raise this issue in Parliament
2. Support policies that increase affordable housing supply
3. Consider meeting with local housing groups

I believe that addressing this issue is crucial for the future prosperity of our constituency and would appreciate your support in finding sustainable solutions.

Thank you for your time and consideration. I look forward to your response.

Yours sincerely,
[Your Name]
[Your Address]
[Your Contact Information]`
      },
      {
        title: 'Public Transport',
        description: 'Improve local transport infrastructure and services',
        content: `Dear [MP Name],

I am writing to bring to your attention the current challenges with public transport services in our constituency.

As a regular user of local transport, I have noticed several issues that affect our community:

• Unreliable bus services with frequent delays
• Limited evening and weekend services
• Poor connectivity between different areas
• Aging infrastructure that needs modernization

These issues particularly impact:
- Elderly residents who rely on public transport
- Young people accessing education and employment
- Families without private vehicles
- Environmental goals for reduced car dependency

I would appreciate your support in:
1. Advocating for increased transport funding
2. Working with local transport authorities
3. Supporting sustainable transport initiatives

Improved public transport would benefit our entire community and support economic growth in the area.

Thank you for your attention to this matter.

Best regards,
[Your Name]
[Your Address]
[Your Contact Information]`
      }
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental',
    icon: Leaf,
    color: 'bg-green-500',
    templates: [
      {
        title: 'Green Energy Transition',
        description: 'Support renewable energy development and climate action',
        content: `Dear [MP Name],

I am writing to express my strong support for accelerating the transition to renewable energy in our constituency and across the UK.

Climate change represents one of the most significant challenges of our time, and I believe our area has great potential to contribute to the solution through:

• Solar panel installations on public buildings
• Wind energy projects where appropriate
• Investment in energy storage technology
• Support for local green energy cooperatives

The benefits of this transition include:
- Job creation in the green energy sector
- Reduced energy costs for residents
- Improved air quality
- Enhanced energy security
- Meeting our net-zero commitments

I urge you to:
1. Support government funding for renewable energy projects
2. Advocate for streamlined planning processes for green energy
3. Promote community energy schemes
4. Champion policies that make renewable energy accessible to all

Our constituency could become a leader in the green energy transition, creating jobs and protecting our environment for future generations.

Thank you for considering this important issue.

Yours sincerely,
[Your Name]
[Your Address]
[Your Contact Information]`
      },
      {
        title: 'Local Conservation',
        description: 'Protect local green spaces and wildlife habitats',
        content: `Dear [MP Name],

I am writing to highlight the importance of protecting and enhancing our local green spaces and natural habitats.

Our constituency is fortunate to have [mention specific local green spaces], which provide invaluable benefits to our community:

• Mental health and wellbeing benefits
• Biodiversity conservation
• Natural flood management
• Air quality improvement
• Recreation and community gathering spaces

However, these areas face increasing pressure from:
- Development proposals
- Reduced maintenance funding
- Climate change impacts
- Pollution and littering

I would like to request your support for:
1. Protecting existing green spaces from inappropriate development
2. Securing funding for conservation projects
3. Supporting community groups involved in conservation
4. Promoting biodiversity net gain policies

Investing in our natural environment is investing in our community's future health, wellbeing, and resilience.

I would welcome the opportunity to discuss this further and show you some of our local conservation projects.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Address]
[Your Contact Information]`
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    color: 'bg-red-500',
    templates: [
      {
        title: 'NHS Services',
        description: 'Address local NHS capacity and service quality issues',
        content: `Dear [MP Name],

I am writing to express my concerns about the current state of NHS services in our constituency and to request your support in addressing these critical issues.

As a resident who relies on local NHS services, I have experienced:

• Extended waiting times for GP appointments
• Difficulty accessing specialist services
• Pressure on local hospital services
• Limited availability of mental health support

These challenges are affecting:
- Elderly residents requiring regular care
- Families with young children
- People with chronic conditions
- Those experiencing mental health difficulties

I urge you to advocate for:
1. Increased funding for local NHS services
2. More GP practices and healthcare professionals
3. Better integration between health and social care
4. Investment in preventive healthcare programs

Our NHS is a cornerstone of our society, and ensuring adequate local provision is essential for our community's health and wellbeing.

I would appreciate your commitment to fighting for better NHS services in our area and would welcome updates on any progress made.

Thank you for your attention to this vital issue.

Yours sincerely,
[Your Name]
[Your Address]
[Your Contact Information]`
      },
      {
        title: 'Mental Health Support',
        description: 'Improve access to mental health services and support',
        content: `Dear [MP Name],

I am writing to highlight the urgent need for improved mental health services in our constituency.

Mental health affects people of all ages and backgrounds, yet many in our community struggle to access appropriate support when they need it most.

Current challenges include:
• Long waiting lists for counseling and therapy
• Limited crisis support services
• Insufficient support for young people
• Gaps in community mental health provision

The impact of inadequate mental health services extends beyond individuals to:
- Families and caregivers
- Schools and workplaces
- Emergency services
- Overall community wellbeing

I request your support for:
1. Increased funding for local mental health services
2. Faster access to talking therapies
3. Better mental health support in schools
4. Training for frontline staff to recognize mental health issues
5. Community-based mental health programs

Investing in mental health is investing in our community's future. Early intervention and accessible support can transform lives and reduce long-term costs to society.

I would welcome the opportunity to discuss this further and share examples of successful mental health initiatives from other areas.

Thank you for your consideration.

Best regards,
[Your Name]
[Your Address]
[Your Contact Information]`
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'bg-purple-500',
    templates: [
      {
        title: 'School Funding',
        description: 'Advocate for adequate school funding and resources',
        content: `Dear [MP Name],

I am writing to express my concerns about school funding in our constituency and its impact on the quality of education our children receive.

Local schools are facing significant challenges due to funding constraints:

• Larger class sizes affecting individual attention
• Reduced support staff and teaching assistants
• Limited resources for special educational needs
• Cuts to extracurricular activities and programs
• Aging facilities requiring maintenance and updates

These issues particularly affect:
- Children from disadvantaged backgrounds
- Students with special educational needs
- Schools in areas of high deprivation
- Teacher recruitment and retention

I urge you to support:
1. Increased per-pupil funding for all schools
2. Additional support for schools with high needs
3. Investment in school infrastructure
4. Programs to attract and retain quality teachers
5. Funding for mental health support in schools

Every child deserves access to a high-quality education regardless of their background or the school they attend. Adequate funding is essential to achieve this goal.

I would appreciate your commitment to fighting for fair school funding and would welcome updates on progress in this area.

Thank you for your time and consideration.

Yours sincerely,
[Your Name]
[Your Address]
[Your Contact Information]`
      },
      {
        title: 'Higher Education Access',
        description: 'Improve access to higher education and vocational training',
        content: `Dear [MP Name],

I am writing to discuss the importance of improving access to higher education and vocational training opportunities for young people in our constituency.

Many talented young people in our area face barriers to accessing higher education:

• High tuition fees and living costs
• Limited local higher education options
• Insufficient careers guidance
• Lack of awareness about apprenticeship opportunities
• Financial pressures on families

This affects:
- Social mobility in our community
- Local economic development
- Skills shortages in key sectors
- Young people's life opportunities

I would like to see support for:
1. More affordable higher education options
2. Expansion of apprenticeship programs
3. Better careers guidance in schools
4. Local partnerships between employers and education providers
5. Financial support for students from low-income families
6. Investment in further education colleges

Ensuring that all young people have access to quality post-16 education and training is crucial for their individual success and our community's economic future.

I would welcome the opportunity to discuss how we can work together to improve educational opportunities in our area.

Thank you for your attention to this important matter.

Best regards,
[Your Name]
[Your Address]
[Your Contact Information]`
      }
    ]
  }
];

export default function MessageTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'categories' | 'templates' | 'preview' | 'editor'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editedContent, setEditedContent] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentView('templates');
  };

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCurrentView('preview');
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
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



  const handleSendMessage = async () => {
    if (!recipientEmail || !senderEmail || !senderName || !editedContent) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData();
      formData.append('name', senderName);
      formData.append('email', senderEmail);
      formData.append('message', editedContent);
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
        setSenderName('');
        setSenderEmail('');
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

  if (currentView === 'preview' && selectedTemplate) {
    return (
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
    );
  }

  if (currentView === 'editor' && selectedTemplate) {
    return (
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
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Email *</label>
                  <Input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
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
    );
  }

  // Render different views based on current state
  const renderContent = () => {
    switch (currentView) {
      case 'categories':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Message Templates</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of professional templates to contact your MP about important issues
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                      <p className="text-gray-600">Choose a template to get started</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {selectedCategory?.templates.map((template: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {template.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {template.content.substring(0, 200)}...
                      </p>
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

      case 'preview':
         return (
           <div className="max-w-4xl mx-auto">
             <div className="mb-6">
               <Button 
                 variant="outline" 
                 onClick={handleBackToTemplates}
                 className="mb-4"
               >
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Back to Templates
               </Button>
               
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                   <Eye className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900">Template Preview</h1>
                   <p className="text-gray-600">{selectedTemplate?.title}</p>
                 </div>
               </div>
             </div>

             <Card className="border-2">
               <CardHeader>
                 <CardTitle className="flex items-center justify-between">
                   <span>{selectedTemplate?.title}</span>
                   <Badge variant="secondary">{selectedCategory?.name}</Badge>
                 </CardTitle>
                 <CardDescription>{selectedTemplate?.description}</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="bg-white border rounded-lg p-6">
                   <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                     {selectedTemplate?.content}
                   </div>
                 </div>
               </CardContent>
               <CardFooter className="flex gap-3">
                 <Button 
                   variant="outline" 
                   onClick={handleBackToTemplates}
                   className="flex-1"
                 >
                   Back to Templates
                 </Button>
                 <Button 
                   onClick={() => {
                     setEditedContent(selectedTemplate?.content || '');
                     setCurrentView('editor');
                   }}
                   className="flex-1"
                 >
                   <Edit3 className="h-4 w-4 mr-2" />
                   Customize & Send
                 </Button>
               </CardFooter>
             </Card>
           </div>
         );

       case 'editor':
         return (
           <div className="max-w-4xl mx-auto">
             <div className="mb-6">
               <Button 
                 variant="outline" 
                 onClick={() => setCurrentView('preview')}
                 className="mb-4"
               >
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Back to Preview
               </Button>
               
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                   <Edit3 className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900">Customize Your Message</h1>
                   <p className="text-gray-600">Edit the template and add your details</p>
                 </div>
               </div>
             </div>

             <div className="space-y-6">
               {/* MP Details */}
               <Card>
                 <CardHeader>
                   <CardTitle>MP Details</CardTitle>
                   <CardDescription>Enter your MP's information</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">MP Name</label>
                     <Input
                       value={recipientName}
                       onChange={(e) => setRecipientName(e.target.value)}
                       placeholder="Enter your MP's name"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">MP Email</label>
                     <Input
                       type="email"
                       value={recipientEmail}
                       onChange={(e) => setRecipientEmail(e.target.value)}
                       placeholder="Enter your MP's email address"
                     />
                   </div>
                 </CardContent>
               </Card>

               {/* Your Details */}
               <Card>
                 <CardHeader>
                   <CardTitle>Your Details</CardTitle>
                   <CardDescription>Enter your contact information</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                     <Input
                       value={senderName}
                       onChange={(e) => setSenderName(e.target.value)}
                       placeholder="Enter your full name"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                     <Input
                       type="email"
                       value={senderEmail}
                       onChange={(e) => setSenderEmail(e.target.value)}
                       placeholder="Enter your email address"
                     />
                   </div>
                 </CardContent>
               </Card>

               {/* Message Content */}
               <Card>
                 <CardHeader>
                   <CardTitle>Message Content</CardTitle>
                   <CardDescription>Customize the template to fit your needs</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <Textarea
                     value={editedContent}
                     onChange={(e) => setEditedContent(e.target.value)}
                     rows={15}
                     className="text-sm"
                     placeholder="Edit your message here..."
                   />
                 </CardContent>
               </Card>

               {/* Submit Status */}
               {submitStatus === 'success' && (
                 <Card className="border-green-200 bg-green-50">
                   <CardContent className="pt-6">
                     <div className="flex items-center gap-3 text-green-800">
                       <Check className="h-5 w-5" />
                       <span className="font-medium">Message sent successfully!</span>
                     </div>
                   </CardContent>
                 </Card>
               )}

               {submitStatus === 'error' && (
                 <Card className="border-red-200 bg-red-50">
                   <CardContent className="pt-6">
                     <div className="flex items-center gap-3 text-red-800">
                       <AlertCircle className="h-5 w-5" />
                       <span className="font-medium">Failed to send message. Please try again.</span>
                     </div>
                   </CardContent>
                 </Card>
               )}

               {/* Action Buttons */}
               <Card>
                 <CardFooter className="flex gap-3">
                   <Button 
                     variant="outline" 
                     onClick={() => setCurrentView('preview')}
                     className="flex-1"
                   >
                     Cancel
                   </Button>
                   <Button 
                     onClick={() => {
                       navigator.clipboard.writeText(editedContent);
                       setCopied(true);
                       setTimeout(() => setCopied(false), 2000);
                     }}
                     variant="outline"
                     className="flex-1"
                   >
                     <Copy className="h-4 w-4 mr-2" />
                     {copied ? 'Copied!' : 'Copy Text'}
                   </Button>
                   <Button 
                     onClick={handleSendMessage}
                     disabled={isSubmitting || !recipientEmail || !senderEmail || !senderName}
                     className="flex-1"
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