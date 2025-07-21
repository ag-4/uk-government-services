import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Search, 
  Lightbulb, 
  FileText, 
  Users, 
  Clock, 
  Star,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Zap,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  sources?: { title: string; url: string; type: string }[];
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  accuracy: number;
  usage: number;
}

const EnhancedAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);

  // AI Capabilities
  const aiCapabilities: AICapability[] = [
    {
      id: 'policy-search',
      name: 'Policy Search & Analysis',
      description: 'Search through government policies, bills, and regulations with natural language queries.',
      icon: <Search className="w-6 h-6" />,
      examples: [
        'What are the latest changes to housing policy?',
        'Find information about NHS funding increases',
        'Explain the new environmental regulations'
      ],
      accuracy: 94.2,
      usage: 15678
    },
    {
      id: 'service-guidance',
      name: 'Service Guidance',
      description: 'Get step-by-step guidance for government services and applications.',
      icon: <FileText className="w-6 h-6" />,
      examples: [
        'How do I apply for a passport?',
        'What documents do I need for Universal Credit?',
        'Guide me through voter registration'
      ],
      accuracy: 96.8,
      usage: 23456
    },
    {
      id: 'rights-advisor',
      name: 'Citizens Rights Advisor',
      description: 'Understand your rights and responsibilities as a UK citizen.',
      icon: <Shield className="w-6 h-6" />,
      examples: [
        'What are my rights as a tenant?',
        'Employment rights for part-time workers',
        'Healthcare entitlements for EU citizens'
      ],
      accuracy: 92.5,
      usage: 18934
    },
    {
      id: 'bill-explainer',
      name: 'Bill & Law Explainer',
      description: 'Get plain English explanations of complex legislation and parliamentary bills.',
      icon: <BookOpen className="w-6 h-6" />,
      examples: [
        'Explain the Online Safety Bill in simple terms',
        'What does the new tax legislation mean for me?',
        'Summary of the latest immigration law changes'
      ],
      accuracy: 89.7,
      usage: 12345
    },
    {
      id: 'local-services',
      name: 'Local Services Finder',
      description: 'Find local government services, council information, and community resources.',
      icon: <MapPin className="w-6 h-6" />,
      examples: [
        'Find my local council services',
        'Where can I get help with housing issues?',
        'Local support for elderly care'
      ],
      accuracy: 91.3,
      usage: 16789
    },
    {
      id: 'complaint-helper',
      name: 'Complaint & Appeal Helper',
      description: 'Guidance on making complaints and appeals against government decisions.',
      icon: <AlertCircle className="w-6 h-6" />,
      examples: [
        'How to appeal a benefit decision',
        'Making a complaint about NHS treatment',
        'Challenging a council tax assessment'
      ],
      accuracy: 88.9,
      usage: 9876
    }
  ];

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your Enhanced AI Government Assistant. I can help you with:

• **Policy Search & Analysis** - Find and understand government policies
• **Service Guidance** - Step-by-step help with applications
• **Rights & Responsibilities** - Know your citizen rights
• **Bill Explanations** - Plain English summaries of legislation
• **Local Services** - Find services in your area
• **Complaints & Appeals** - Guidance on challenging decisions

What would you like to know about today?`,
      timestamp: new Date(),
      suggestions: [
        'How do I apply for a passport?',
        'What are my rights as a tenant?',
        'Explain the latest NHS changes',
        'Find my local council services'
      ]
    };
    setMessages([welcomeMessage]);
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
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `Based on your query about "${inputMessage}", here's what I found:

**Key Information:**
• The process typically takes 3-6 weeks for standard applications
• You'll need valid identification and supporting documents
• Online applications are processed faster than postal applications

**Next Steps:**
1. Gather required documents (passport photos, proof of identity)
2. Complete the online application form
3. Pay the application fee (£82.50 for standard service)
4. Submit your application and track progress online

Would you like me to provide more specific guidance for any of these steps?`,
          suggestions: [
            'What documents do I need exactly?',
            'How much does it cost?',
            'Can I track my application?',
            'What if I need it urgently?'
          ],
          sources: [
            { title: 'HM Passport Office - Apply for a passport', url: 'https://www.gov.uk/apply-renew-passport', type: 'Official Guide' },
            { title: 'Passport fees and processing times', url: 'https://www.gov.uk/passport-fees', type: 'Fee Information' },
            { title: 'Required documents checklist', url: 'https://www.gov.uk/photos-for-passports', type: 'Requirements' }
          ]
        },
        {
          content: `I understand you're looking for information about "${inputMessage}". Here's a comprehensive overview:

**Current Status:**
• This service is available online 24/7
• Processing times have improved by 25% this year
• 94% customer satisfaction rating

**How to Get Started:**
1. Visit the official government website
2. Create an account or sign in
3. Complete the application form
4. Upload required documents
5. Pay any applicable fees

**Important Notes:**
• Keep your reference number safe
• You'll receive email updates on progress
• Contact support if you need help at any stage

Is there a specific aspect you'd like me to explain in more detail?`,
          suggestions: [
            'What are the eligibility requirements?',
            'How long does it take?',
            'What if I make a mistake?',
            'Can someone help me apply?'
          ],
          sources: [
            { title: 'Official application portal', url: 'https://www.gov.uk', type: 'Government Service' },
            { title: 'Help and support guide', url: 'https://www.gov.uk/help', type: 'Support' }
          ]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions,
        sources: randomResponse.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input simulation
    if (!isListening) {
      setTimeout(() => {
        setInputMessage('How do I apply for Universal Credit?');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(!isSpeaking);
    // Text-to-speech simulation
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Enhanced AI Assistant</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your intelligent guide to UK government services, powered by advanced AI and natural language processing.
        </p>
      </div>

      {/* AI Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiCapabilities.map(capability => (
          <Card 
            key={capability.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCapability === capability.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCapability(
              selectedCapability === capability.id ? null : capability.id
            )}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  {capability.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{capability.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {capability.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${capability.accuracy}%` }}
                      />
                    </div>
                    <span className="font-semibold">{capability.accuracy}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Usage</span>
                  <span className="font-semibold">{capability.usage.toLocaleString()}</span>
                </div>
                {selectedCapability === capability.id && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-sm">Example queries:</h4>
                    {capability.examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(example);
                        }}
                        className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Government Assistant</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Online and ready to help</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg p-4`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.sources && (
                      <div className="mt-3 space-y-2">
                        <h4 className="font-semibold text-sm">Sources:</h4>
                        {message.sources.map((source, index) => (
                          <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3 h-3" />
                              <span>{source.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {source.type}
                              </Badge>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <h4 className="font-semibold text-sm">Suggested follow-ups:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs opacity-70">
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.type === 'assistant' && (
                        <button
                          onClick={() => handleTextToSpeech(message.content)}
                          className="flex items-center space-x-1 hover:opacity-100 transition-opacity"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask me anything about UK government services..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <button
                    onClick={handleVoiceInput}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isListening ? 'text-red-500' : 'text-gray-400'
                    } hover:text-blue-600 transition-colors`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isListening && (
                <div className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak now</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* AI Stats & Features */}
        <div className="space-y-6">
          {/* AI Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Accuracy</span>
                <span className="font-semibold">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-semibold">1.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Satisfaction</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">4.7/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Queries Resolved</span>
                <span className="font-semibold">98.1%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleSuggestionClick('How do I apply for a passport?')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Passport Application
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleSuggestionClick('Find my local MP')}
              >
                <Users className="w-4 h-4 mr-2" />
                Find My MP
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleSuggestionClick('What benefits am I entitled to?')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Benefits Check
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleSuggestionClick('How to register to vote')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Voter Registration
              </Button>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Recent Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">New Feature</span>
                </div>
                <p className="text-gray-600">Voice input now available</p>
              </div>
              <div className="text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">Improvement</span>
                </div>
                <p className="text-gray-600">25% faster response times</p>
              </div>
              <div className="text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold">Data Update</span>
                </div>
                <p className="text-gray-600">Latest policy database sync</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIAssistant;