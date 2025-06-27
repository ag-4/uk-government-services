import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send, Edit3, Heart, GraduationCap, Leaf, PoundSterling, MapPin, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  template: string;
  fields: string[];
}

const categoryIcons = {
  'Healthcare': Heart,
  'Education': GraduationCap,
  'Environment': Leaf,
  'Economy': PoundSterling,
  'Local Issues': MapPin,
};

const categoryColors = {
  'Healthcare': 'bg-red-100 text-red-800 border-red-200',
  'Education': 'bg-blue-100 text-blue-800 border-blue-200',
  'Environment': 'bg-green-100 text-green-800 border-green-200',
  'Economy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Local Issues': 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function MessageTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      generateMessage();
    }
  }, [selectedTemplate, fieldValues]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/data/message-templates.json');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    const initialValues: Record<string, string> = {};
    template.fields.forEach(field => {
      initialValues[field] = '';
    });
    setFieldValues(initialValues);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateMessage = () => {
    if (!selectedTemplate) return;

    let message = selectedTemplate.template;
    Object.entries(fieldValues).forEach(([field, value]) => {
      const placeholder = `[${field}]`;
      message = message.replace(new RegExp(`\\[${field}\\]`, 'g'), value || `[${field}]`);
    });
    setGeneratedMessage(message);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            <span>Ready-to-Use Templates</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contact Your MP with Confidence
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our professionally crafted message templates to communicate effectively 
            with your MP about issues that matter to you and your community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onSelect={() => handleTemplateSelect(template)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="uk-gov-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedTemplate.title}
                      </h3>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${
                        categoryColors[selectedTemplate.category as keyof typeof categoryColors]
                      }`}>
                        {React.createElement(
                          categoryIcons[selectedTemplate.category as keyof typeof categoryIcons], 
                          { className: 'w-4 h-4' }
                        )}
                        <span>{selectedTemplate.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Field Inputs */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Customize Your Message
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field} className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            {field.replace(/_/g, ' ')}
                          </label>
                          {field === 'SPECIFIC_CONCERN' ? (
                            <Textarea
                              placeholder={`Enter your ${field.toLowerCase().replace(/_/g, ' ')}`}
                              value={fieldValues[field] || ''}
                              onChange={(e) => handleFieldChange(field, e.target.value)}
                              className="min-h-[80px]"
                            />
                          ) : (
                            <Input
                              placeholder={`Enter ${field.toLowerCase().replace(/_/g, ' ')}`}
                              value={fieldValues[field] || ''}
                              onChange={(e) => handleFieldChange(field, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generated Message */}
                <div className="uk-gov-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Your Message
                    </h4>
                    <div className="flex space-x-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {generatedMessage}
                    </pre>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">How to send this message:</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-700">
                          <li>Copy the message above</li>
                          <li>Find your MP using the search tool</li>
                          <li>Send via email or contact form on their website</li>
                          <li>Include your full name and address for verification</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="uk-gov-card text-center py-12">
                <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Template
                </h3>
                <p className="text-gray-600">
                  Choose a message template from the left to start customizing your message to your MP.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TemplateCardProps {
  template: MessageTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons];
  const categoryClass = categoryColors[template.category as keyof typeof categoryColors];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="space-y-2">
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${categoryClass}`}>
          {CategoryIcon && <CategoryIcon className="w-3 h-3" />}
          <span>{template.category}</span>
        </div>
        
        <h4 className={`font-medium ${
          isSelected ? 'text-primary' : 'text-gray-900'
        }`}>
          {template.title}
        </h4>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {template.template.substring(0, 100)}...
        </p>
      </div>
    </button>
  );
}