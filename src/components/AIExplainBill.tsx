import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Send, Bot, User, ExternalLink, Lightbulb, AlertCircle, Copy, ThumbsUp, ThumbsDown, RotateCcw, Loader, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  billContext?: {
    title: string;
    url?: string;
    summary?: string;
  };
}

interface BillSuggestion {
  id: string;
  title: string;
  shortDescription: string;
  url: string;
  status: string;
  complexity: 'Low' | 'Medium' | 'High';
}

interface ExplanationRequest {
  billTitle: string;
  billUrl?: string;
  userQuestion?: string;
}

const AIExplainBill: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billUrl, setBillUrl] = useState('');
  const [selectedBill, setSelectedBill] = useState<BillSuggestion | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock bill suggestions for demonstration
  const billSuggestions: BillSuggestion[] = [
    {
      id: '1',
      title: 'Online Safety Bill',
      shortDescription: 'Regulates internet services and online content to improve user safety',
      url: 'https://bills.parliament.uk/bills/3137',
      status: 'Royal Assent',
      complexity: 'High'
    },
    {
      id: '2',
      title: 'Data Protection and Digital Information Bill',
      shortDescription: 'Reforms UK data protection laws and electronic communications',
      url: 'https://bills.parliament.uk/bills/3430',
      status: 'Committee Stage',
      complexity: 'High'
    },
    {
      id: '3',
      title: 'Tobacco and Vapes Bill',
      shortDescription: 'Creates a smokefree generation by restricting tobacco sales',
      url: 'https://bills.parliament.uk/bills/3589',
      status: 'Second Reading',
      complexity: 'Medium'
    },
    {
      id: '4',
      title: 'Renters Rights Bill',
      shortDescription: 'Strengthens tenant rights and improves rental market standards',
      url: 'https://bills.parliament.uk/bills/3462',
      status: 'First Reading',
      complexity: 'Medium'
    },
    {
      id: '5',
      title: 'Employment Rights Bill',
      shortDescription: 'Enhances worker protections and employment standards',
      url: 'https://bills.parliament.uk/bills/3401',
      status: 'Committee Stage',
      complexity: 'High'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (request: ExplanationRequest): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Mock AI responses based on bill title
    const responses: Record<string, string> = {
      'online safety bill': `The Online Safety Bill is designed to make the internet safer for everyone, especially children. Here's what it does in simple terms:

**Main Goals:**
• Requires social media companies to remove harmful content quickly
• Protects children from seeing inappropriate material online
• Gives users more control over what they see
• Makes companies more transparent about their content policies

**Key Changes:**
• **Age Verification**: Websites must verify users' ages to protect children
• **Content Removal**: Platforms must remove illegal content within strict timeframes
• **User Controls**: You'll get better tools to filter and block unwanted content
• **Transparency Reports**: Companies must publish regular reports about harmful content

**Who Does This Affect?**
• Social media platforms (Facebook, Twitter, TikTok, etc.)
• Search engines (Google, Bing)
• Video sharing sites (YouTube)
• Online gaming platforms
• Dating apps

**Penalties:**
Companies that don't comply can face fines up to 10% of their global revenue - that's potentially billions of pounds!

**Why It Matters:**
This law aims to balance free speech with safety, making sure the internet remains open while protecting users from harm.`,

      'data protection and digital information bill': `The Data Protection and Digital Information Bill updates how your personal data is handled in the UK. Here's what you need to know:

**Main Purpose:**
• Simplifies data protection rules for businesses
• Maintains strong privacy protections for individuals
• Reduces bureaucratic burden while keeping data safe

**Key Changes:**
• **Easier Consent**: Companies can use "legitimate interest" more often instead of asking for explicit consent
• **Reduced Paperwork**: Less documentation required for data processing
• **Cookie Reforms**: Fewer annoying cookie pop-ups on websites
• **Research Benefits**: Easier to use data for scientific research and innovation

**What This Means for You:**
• Fewer consent pop-ups when browsing websites
• Your data is still protected, but with less friction
• Companies can innovate more easily while respecting your privacy
• You still have the right to access, correct, and delete your data

**Business Impact:**
• Reduced compliance costs
• More flexibility in data processing
• Clearer rules for international data transfers
• Support for AI and machine learning development

**The Balance:**
This bill tries to keep the UK competitive in the digital economy while maintaining the privacy protections people expect.`,

      'tobacco and vapes bill': `The Tobacco and Vapes Bill aims to create the first "smokefree generation" in the UK. Here's how:

**The Big Idea:**
• Anyone born on or after January 1, 2009, will never legally be able to buy tobacco products
• This means today's children will grow up in a smokefree generation

**Key Measures:**
• **Age Restrictions**: The legal age for buying tobacco will increase by one year, every year
• **Vaping Controls**: Stricter rules on vape advertising and flavors to protect children
• **Enforcement**: Stronger penalties for shops that sell to underage customers
• **Public Health**: More funding for smoking cessation programs

**What Changes:**
• **For Current Smokers**: If you can legally buy tobacco now, you always will be able to
• **For Young People**: Those under 15 today will never be able to legally buy tobacco
• **Vaping**: Tighter controls on marketing, especially flavors that appeal to children
• **Retailers**: Stricter licensing and penalties for illegal sales

**Health Impact:**
• Could prevent thousands of deaths from smoking-related diseases
• Reduces healthcare costs for the NHS
• Protects children from nicotine addiction

**Why This Approach:**
Rather than banning tobacco outright (which could create black markets), this gradually phases it out for future generations while respecting current users' choices.`,

      'default': `I'd be happy to explain this bill in simple terms! However, I need a bit more information to provide you with an accurate explanation.

**To give you the best explanation, please:**
• Provide the full title of the bill
• Share a link to the bill on parliament.uk if you have it
• Let me know what specific aspects you'd like me to focus on

**I can help explain:**
• What the bill aims to achieve
• Who it affects
• Key changes it would make
• Potential impacts on daily life
• Timeline and current status

**Common Questions I Can Answer:**
• "What does this bill actually do?"
• "How will this affect me?"
• "Why is this bill needed?"
• "What are the main arguments for and against?"
• "When will this become law?"

Feel free to ask follow-up questions - I'm here to make complex legislation understandable!`
    };

    const key = request.billTitle.toLowerCase();
    return responses[key] || responses['default'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && !selectedBill) {
      setError('Please enter a bill title or select a bill from suggestions.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim() || `Explain the ${selectedBill?.title}`,
      timestamp: new Date(),
      billContext: selectedBill ? {
        title: selectedBill.title,
        url: selectedBill.url,
        summary: selectedBill.shortDescription
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    const currentInput = inputValue;
    setInputValue('');
    setSelectedBill(null);

    try {
      const request: ExplanationRequest = {
        billTitle: selectedBill?.title || currentInput,
        billUrl: selectedBill?.url || billUrl,
        userQuestion: currentInput
      };

      const aiResponse = await generateAIResponse(request);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        billContext: userMessage.billContext
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, currentInput]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setError('Failed to generate explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillSelect = (bill: BillSuggestion) => {
    setSelectedBill(bill);
    setInputValue(`Explain the ${bill.title}`);
    inputRef.current?.focus();
  };

  const handleClearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
    setSelectedBill(null);
    setInputValue('');
    setBillUrl('');
    setError(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
              {line.slice(2, -2)}
            </h4>
          );
        }
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="ml-4 mb-1">
              {line.slice(2)}
            </li>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Bot className="w-4 h-4" />
            <span>AI-Powered Explanations</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🤖 AI Explain This Bill
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get clear, simple explanations of complex parliamentary bills. Ask questions and understand how legislation affects you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bill Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Popular Bills
                </CardTitle>
                <CardDescription>
                  Click on any bill to get an AI explanation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {billSuggestions.map((bill) => (
                  <div
                    key={bill.id}
                    onClick={() => handleBillSelect(bill)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedBill?.id === bill.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 leading-tight">
                        {bill.title}
                      </h4>
                      <Badge className={`${getComplexityColor(bill.complexity)} text-xs ml-2 flex-shrink-0`}>
                        {bill.complexity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {bill.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {bill.status}
                      </Badge>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Ask specific questions like "How does this affect me?"</p>
                <p>• Request examples: "Can you give me an example?"</p>
                <p>• Ask for comparisons: "How is this different from current law?"</p>
                <p>• Get timelines: "When will this become law?"</p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-primary" />
                      AI Bill Explainer
                    </CardTitle>
                    <CardDescription>
                      Ask me anything about UK parliamentary bills
                    </CardDescription>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={handleClearConversation}
                      className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Welcome to AI Bill Explainer!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      I can help you understand complex parliamentary bills in simple terms.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>Try asking:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• "Explain the Online Safety Bill"</li>
                        <li>• "How does the Data Protection Bill affect me?"</li>
                        <li>• "What is the Tobacco and Vapes Bill about?"</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'assistant' && (
                            <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          {message.type === 'user' && (
                            <User className="w-5 h-5 text-primary-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            {message.billContext && (
                              <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                <div className="flex items-center space-x-2 mb-1">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">
                                    {message.billContext.title}
                                  </span>
                                </div>
                                {message.billContext.summary && (
                                  <p className="text-xs text-blue-700">
                                    {message.billContext.summary}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className={`text-sm ${
                              message.type === 'user' ? 'text-primary-foreground' : 'text-gray-900'
                            }`}>
                              {message.type === 'assistant' ? (
                                <div className="prose prose-sm max-w-none">
                                  {formatMessageContent(message.content)}
                                </div>
                              ) : (
                                message.content
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs ${
                                message.type === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {message.type === 'assistant' && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => copyToClipboard(message.content)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Copy response"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                    title="Helpful"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    title="Not helpful"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading Message */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {selectedBill && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Selected: {selectedBill.title}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedBill(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={selectedBill ? "Ask a question about this bill..." : "Enter bill title or ask a question..."}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || (!inputValue.trim() && !selectedBill)}
                      className="uk-gov-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Ask AI</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Responses typically take 2-4 seconds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Powered by AI • Explanations are simplified</span>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIExplainBill;