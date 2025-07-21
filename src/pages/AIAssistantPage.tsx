import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Search,
  BookOpen,
  Scale,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  confidence?: number;
  sources?: string[];
  helpful?: boolean;
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  examples: string[];
  accuracy: number;
  usage: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  icon: React.ReactNode;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTab, setSelectedTab] = useState('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock AI capabilities
  const [capabilities] = useState<AICapability[]>([
    {
      id: '1',
      name: 'Policy Search & Explanation',
      description: 'Find and explain government policies, regulations, and procedures in plain English.',
      icon: <Search className="w-5 h-5" />,
      category: 'Information',
      examples: [
        'What is the current UK immigration policy?',
        'Explain the new data protection regulations',
        'How do I apply for a business license?'
      ],
      accuracy: 94.2,
      usage: 15847
    },
    {
      id: '2',
      name: 'Service Guidance',
      description: 'Get step-by-step guidance for accessing government services and completing applications.',
      icon: <FileText className="w-5 h-5" />,
      category: 'Guidance',
      examples: [
        'How do I renew my passport?',
        'What documents do I need for Universal Credit?',
        'Guide me through registering to vote'
      ],
      accuracy: 96.8,
      usage: 23456
    },
    {
      id: '3',
      name: 'Rights & Legal Advisor',
      description: 'Understand your rights, legal obligations, and available legal support.',
      icon: <Scale className="w-5 h-5" />,
      category: 'Legal',
      examples: [
        'What are my employment rights?',
        'How do I report discrimination?',
        'What legal aid is available?'
      ],
      accuracy: 91.5,
      usage: 8934
    },
    {
      id: '4',
      name: 'Bill & Legislation Explainer',
      description: 'Break down complex bills and legislation into understandable summaries.',
      icon: <BookOpen className="w-5 h-5" />,
      category: 'Legislation',
      examples: [
        'Explain the Online Safety Bill',
        'What does the new housing bill mean for renters?',
        'Summary of recent tax changes'
      ],
      accuracy: 89.3,
      usage: 12789
    }
  ]);

  // Quick actions for common queries
  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Apply for Passport',
      description: 'Get guidance on passport applications',
      prompt: 'I need help applying for a UK passport. Can you guide me through the process?',
      category: 'Services',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'Universal Credit Help',
      description: 'Understand Universal Credit eligibility',
      prompt: 'Can you explain Universal Credit and help me understand if I\'m eligible?',
      category: 'Benefits',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'Voting Rights',
      description: 'Learn about voting and elections',
      prompt: 'I want to understand my voting rights and how to register to vote in the UK.',
      category: 'Democracy',
      icon: <Scale className="w-4 h-4" />
    },
    {
      id: '4',
      title: 'Tax Questions',
      description: 'Get help with tax-related queries',
      prompt: 'I have questions about UK tax obligations and how to file my tax return.',
      category: 'Tax',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ]);

  useEffect(() => {
    // Simulate loading and add welcome message
    const timer = setTimeout(() => {
      setLoading(false);
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! I\'m your AI Government Assistant. I can help you with government services, policies, legal questions, and more. How can I assist you today?',
          timestamp: new Date(),
          category: 'greeting',
          confidence: 100
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    
    let response = '';
    let category = 'general';
    let confidence = 85;
    let sources: string[] = [];

    if (input.includes('passport')) {
      response = `To apply for a UK passport, you'll need to:

1. **Check eligibility**: You must be a British citizen
2. **Gather documents**: You'll need proof of identity and a digital photo
3. **Choose application method**: Online (fastest), by post, or through Post Office Premium service
4. **Pay the fee**: £82.50 for adults, £53.50 for children
5. **Processing time**: Usually 3-6 weeks

**Online application** is recommended as it's faster and you can track progress. You'll need:
- A digital photo meeting specific requirements
- Your old passport (if renewing)
- Supporting documents if it's your first adult passport

Would you like me to explain any of these steps in more detail?`;
      category = 'services';
      confidence = 96;
      sources = ['GOV.UK Passport Service', 'HM Passport Office'];
    } else if (input.includes('universal credit')) {
      response = `Universal Credit is a monthly payment to help with living costs. Here's what you need to know:

**Eligibility:**
- You're 18 or over (or 16-17 in specific circumstances)
- You're under State Pension age
- You have £16,000 or less in money, savings and investments
- You live in the UK

**What it replaces:**
- Child Tax Credit
- Housing Benefit
- Income Support
- Income-based Jobseeker's Allowance
- Income-related Employment and Support Allowance
- Working Tax Credit

**How to apply:**
1. Apply online at GOV.UK
2. Attend an interview at your local Jobcentre Plus
3. Provide required documents

**Payment:** Usually takes 5 weeks for your first payment.

Would you like help with the application process or understanding what documents you'll need?`;
      category = 'benefits';
      confidence = 94;
      sources = ['Department for Work and Pensions', 'GOV.UK Benefits Guide'];
    } else if (input.includes('vote') || input.includes('voting') || input.includes('election')) {
      response = `Here's everything you need to know about voting in the UK:

**Registration:**
- You must register to vote before you can vote in any election
- Register online at GOV.UK - it takes about 5 minutes
- You need your National Insurance number and address

**Who can vote:**
- UK citizens aged 18 or over
- Irish and EU citizens (for some elections)
- Commonwealth citizens with leave to remain

**Types of elections you can vote in:**
- General elections (for MPs)
- Local elections (for councillors)
- Police and Crime Commissioner elections
- Referendums

**How to vote:**
- In person at your polling station
- By post (you need to apply for a postal vote)
- By proxy (someone votes for you)

**Important:** You need photo ID to vote in England, Scotland, and Wales. Accepted forms include passport, driving licence, or free voter ID.

Would you like help registering to vote or finding your polling station?`;
      category = 'democracy';
      confidence = 98;
      sources = ['Electoral Commission', 'GOV.UK Voting Guide'];
    } else if (input.includes('tax')) {
      response = `I can help you understand UK tax obligations:

**Income Tax:**
- Personal allowance for 2024-25: £12,570 (tax-free)
- Basic rate: 20% on income £12,571 - £50,270
- Higher rate: 40% on income £50,271 - £125,140
- Additional rate: 45% on income over £125,140

**Self Assessment:**
- Deadline: 31 January following the tax year
- You need to file if you're self-employed, have untaxed income over £1,000, or earn over £100,000

**National Insurance:**
- Employees pay 12% on earnings £12,570 - £50,270
- 2% on earnings above £50,270

**Getting help:**
- Use HMRC's online services
- Call HMRC helpline: 0300 200 3300
- Seek professional advice for complex situations

What specific tax question can I help you with?`;
      category = 'tax';
      confidence = 92;
      sources = ['HM Revenue & Customs', 'GOV.UK Tax Guide'];
    } else {
      response = `I understand you're looking for information about "${userInput}". I can help you with:

• **Government services** - Applications, renewals, and guidance
• **Benefits and support** - Universal Credit, Child Benefit, etc.
• **Legal rights** - Employment, housing, discrimination
• **Voting and democracy** - Registration, elections, civic participation
• **Tax and finance** - Income tax, Self Assessment, National Insurance
• **Immigration** - Visas, citizenship, settlement

Could you please be more specific about what you'd like to know? For example:
- "How do I apply for..."
- "What are my rights regarding..."
- "Explain the process for..."

I'm here to provide accurate, up-to-date information from official government sources.`;
      category = 'general';
      confidence = 75;
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      category,
      confidence,
      sources
    };
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputMessage(action.prompt);
    setSelectedTab('chat');
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with Web Speech API
    if (!isListening) {
      // Start voice recognition
      console.log('Starting voice recognition...');
    } else {
      // Stop voice recognition
      console.log('Stopping voice recognition...');
    }
  };

  const handleMessageFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Government Assistant</h1>
          <p className="text-xl text-gray-600 mb-6">
            Get instant, accurate answers about government services, policies, and procedures. Available 24/7 to help you navigate UK government services.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
            <TabsTrigger value="quick-help">Quick Help</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      Government AI Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask me anything about UK government services, policies, or procedures
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100'} rounded-lg p-4`}>
                          <div className="flex items-start gap-2">
                            {message.type === 'assistant' ? (
                              <Bot className="w-5 h-5 mt-1 text-primary" />
                            ) : (
                              <User className="w-5 h-5 mt-1" />
                            )}
                            <div className="flex-1">
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              
                              {/* Message metadata for AI responses */}
                              {message.type === 'assistant' && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <div className="flex items-center gap-4">
                                      {message.confidence && (
                                        <span>Confidence: {message.confidence}%</span>
                                      )}
                                      <span>{message.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMessageFeedback(message.id, true)}
                                        className={`h-6 w-6 p-0 ${message.helpful === true ? 'text-green-600' : ''}`}
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMessageFeedback(message.id, false)}
                                        className={`h-6 w-6 p-0 ${message.helpful === false ? 'text-red-600' : ''}`}
                                      >
                                        <ThumbsDown className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* Sources */}
                                  {message.sources && message.sources.length > 0 && (
                                    <div className="mt-2">
                                      <div className="text-xs text-gray-600 mb-1">Sources:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {message.sources.map((source, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs">
                                            {source}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask me about government services, policies, or procedures..."
                          className="min-h-[60px] pr-12"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleVoiceToggle}
                          className={`absolute right-2 top-2 ${isListening ? 'text-red-600' : 'text-gray-400'}`}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => handleQuickAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          {action.icon}
                          <div className="text-left">
                            <div className="font-medium text-sm">{action.title}</div>
                            <div className="text-xs text-gray-600">{action.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time:</span>
                      <span className="text-sm font-medium">~1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy:</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((capability) => (
                <Card key={capability.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {capability.icon}
                      {capability.name}
                    </CardTitle>
                    <CardDescription>{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-primary">{capability.accuracy}%</div>
                          <div className="text-xs text-gray-600">Accuracy Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{capability.usage.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Monthly Usage</div>
                        </div>
                      </div>

                      {/* Examples */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Example Questions:</h4>
                        <div className="space-y-2">
                          {capability.examples.map((example, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-auto p-2 text-left"
                              onClick={() => {
                                setInputMessage(example);
                                setSelectedTab('chat');
                              }}
                            >
                              <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="text-xs">{example}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quick Help Tab */}
          <TabsContent value="quick-help" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction(action)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {action.icon}
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{action.category}</Badge>
                    <Button className="w-full mt-4" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Help Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Help Topics</CardTitle>
                <CardDescription>Browse common questions and topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Benefits', count: 234, icon: <Users className="w-4 h-4" /> },
                    { name: 'Passports', count: 189, icon: <FileText className="w-4 h-4" /> },
                    { name: 'Voting', count: 156, icon: <Scale className="w-4 h-4" /> },
                    { name: 'Tax', count: 143, icon: <TrendingUp className="w-4 h-4" /> },
                    { name: 'Immigration', count: 98, icon: <Users className="w-4 h-4" /> },
                    { name: 'Housing', count: 87, icon: <FileText className="w-4 h-4" /> },
                    { name: 'Education', count: 76, icon: <BookOpen className="w-4 h-4" /> },
                    { name: 'Healthcare', count: 65, icon: <Users className="w-4 h-4" /> }
                  ].map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => {
                        setInputMessage(`I need help with ${topic.name.toLowerCase()}`);
                        setSelectedTab('chat');
                      }}
                    >
                      {topic.icon}
                      <div className="text-center">
                        <div className="font-medium text-sm">{topic.name}</div>
                        <div className="text-xs text-gray-600">{topic.count} questions</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistantPage;