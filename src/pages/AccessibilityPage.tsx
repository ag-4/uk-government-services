import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accessibility, 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Monitor, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Zap,
  Volume2,
  Type,
  Contrast
} from 'lucide-react';

const AccessibilityPage: React.FC = () => {
  const accessibilityFeatures = [
    {
      category: 'Visual Accessibility',
      icon: Eye,
      features: [
        'High contrast mode for better visibility',
        'Adjustable font sizes (12px to 24px)',
        'Screen reader compatible markup',
        'Alternative text for all images',
        'Focus indicators for keyboard navigation',
        'Color-blind friendly color schemes'
      ]
    },
    {
      category: 'Motor Accessibility',
      icon: MousePointer,
      features: [
        'Full keyboard navigation support',
        'Large click targets (minimum 44px)',
        'Sticky keys compatibility',
        'Voice control software support',
        'Switch navigation compatibility',
        'Reduced motion options'
      ]
    },
    {
      category: 'Auditory Accessibility',
      icon: Ear,
      features: [
        'Captions for all video content',
        'Audio descriptions available',
        'Visual alerts for audio notifications',
        'Sign language interpretation videos',
        'Adjustable audio playback speed',
        'Text alternatives for audio content'
      ]
    },
    {
      category: 'Cognitive Accessibility',
      icon: Settings,
      features: [
        'Clear, simple language throughout',
        'Consistent navigation patterns',
        'Progress indicators for multi-step processes',
        'Error prevention and clear error messages',
        'Timeout warnings and extensions',
        'Help and support readily available'
      ]
    }
  ];

  const wcagCompliance = [
    {
      level: 'WCAG 2.1 AA',
      status: 'Compliant',
      description: 'Meets all Level A and AA success criteria',
      color: 'green'
    },
    {
      level: 'Section 508',
      status: 'Compliant',
      description: 'Meets US federal accessibility standards',
      color: 'green'
    },
    {
      level: 'EN 301 549',
      status: 'Compliant',
      description: 'Meets European accessibility standard',
      color: 'green'
    },
    {
      level: 'WCAG 2.1 AAA',
      status: 'Partial',
      description: 'Working towards full AAA compliance',
      color: 'yellow'
    }
  ];

  const assistiveTechnologies = [
    {
      name: 'Screen Readers',
      examples: ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack'],
      support: 'Full Support',
      description: 'Complete compatibility with all major screen readers'
    },
    {
      name: 'Voice Control',
      examples: ['Dragon NaturallySpeaking', 'Windows Speech Recognition', 'Voice Control'],
      support: 'Full Support',
      description: 'All interactive elements can be controlled by voice'
    },
    {
      name: 'Switch Navigation',
      examples: ['Single switch', 'Dual switch', 'Sip-and-puff switches'],
      support: 'Full Support',
      description: 'Sequential navigation through all interactive elements'
    },
    {
      name: 'Eye Tracking',
      examples: ['Tobii Dynavox', 'EyeGaze', 'PCEye'],
      support: 'Supported',
      description: 'Compatible with major eye tracking systems'
    },
    {
      name: 'Magnification',
      examples: ['ZoomText', 'MAGic', 'Windows Magnifier'],
      support: 'Full Support',
      description: 'Works with all screen magnification software'
    },
    {
      name: 'Alternative Keyboards',
      examples: ['On-screen keyboards', 'Large key keyboards', 'One-handed keyboards'],
      support: 'Full Support',
      description: 'Compatible with alternative input devices'
    }
  ];

  const accessibilitySettings = [
    {
      setting: 'Font Size',
      options: ['Small (12px)', 'Medium (16px)', 'Large (20px)', 'Extra Large (24px)'],
      default: 'Medium (16px)'
    },
    {
      setting: 'Contrast',
      options: ['Standard', 'High Contrast', 'Dark Mode', 'Custom'],
      default: 'Standard'
    },
    {
      setting: 'Motion',
      options: ['Full Animation', 'Reduced Motion', 'No Animation'],
      default: 'Full Animation'
    },
    {
      setting: 'Audio',
      options: ['Auto-play On', 'Auto-play Off', 'Captions Always On'],
      default: 'Auto-play Off'
    }
  ];

  const keyboardShortcuts = [
    { key: 'Tab', action: 'Navigate to next interactive element' },
    { key: 'Shift + Tab', action: 'Navigate to previous interactive element' },
    { key: 'Enter', action: 'Activate buttons and links' },
    { key: 'Space', action: 'Activate buttons and checkboxes' },
    { key: 'Arrow Keys', action: 'Navigate within menus and lists' },
    { key: 'Esc', action: 'Close dialogs and menus' },
    { key: 'Alt + 1', action: 'Skip to main content' },
    { key: 'Alt + 2', action: 'Skip to navigation' },
    { key: 'Alt + 3', action: 'Skip to search' },
    { key: 'Ctrl + +', action: 'Increase font size' },
    { key: 'Ctrl + -', action: 'Decrease font size' },
    { key: 'Ctrl + 0', action: 'Reset font size' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Accessibility className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Accessibility Statement</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to ensuring our government services platform is accessible to everyone, 
            regardless of ability or technology used.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              WCAG 2.1 AA Compliant
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Last Updated: January 15, 2024
            </Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Commitment Statement */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Our Commitment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-green-800">
                    <p>
                      GOVWHIZ is committed to providing an inclusive digital experience for all users. 
                      We believe that access to government services should not be limited by disability, 
                      technology, or circumstance.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Designed with accessibility from the ground up</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Regular testing with assistive technologies</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Continuous improvement based on user feedback</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span className="text-sm">Staff training on accessibility best practices</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Keyboard className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Keyboard Navigation</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Full keyboard support for all features
                    </p>
                    <Badge variant="outline" className="text-xs">Press Tab to navigate</Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <Type className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Text Scaling</h3>
                    <p className="text-sm text-purple-700 mb-3">
                      Adjust text size up to 200%
                    </p>
                    <Badge variant="outline" className="text-xs">Ctrl + / Ctrl -</Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <Contrast className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-orange-900 mb-2">High Contrast</h3>
                    <p className="text-sm text-orange-700 mb-3">
                      Enhanced visibility options
                    </p>
                    <Badge variant="outline" className="text-xs">Available in settings</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Standards Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Standards We Follow</CardTitle>
                  <CardDescription>
                    Our platform adheres to internationally recognized accessibility standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold">International Standards:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Web Content Accessibility Guidelines (WCAG) 2.1 AA
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          EN 301 549 European Standard
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Section 508 (US Federal Standard)
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">UK Legal Requirements:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Equality Act 2010
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Public Sector Bodies Accessibility Regulations 2018
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Disability Discrimination Act
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="space-y-6">
                {accessibilityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                          {feature.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                          {feature.features.map((item, idx) => (
                            <div key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Keyboard Shortcuts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Keyboard className="h-5 w-5 mr-2" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <CardDescription>
                    Essential keyboard shortcuts for efficient navigation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {keyboardShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{shortcut.action}</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              {/* WCAG Compliance */}
              <div className="grid gap-6 md:grid-cols-2">
                {wcagCompliance.map((standard, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{standard.level}</CardTitle>
                        <Badge 
                          variant={standard.color === 'green' ? 'default' : 'secondary'}
                          className={standard.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {standard.status}
                        </Badge>
                      </div>
                      <CardDescription>{standard.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Testing and Validation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Testing and Validation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We regularly test our platform to ensure continued accessibility compliance:
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Automated Testing</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Daily automated scans</li>
                          <li>• WAVE accessibility checker</li>
                          <li>• axe-core validation</li>
                          <li>• Lighthouse audits</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Manual Testing</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Screen reader testing</li>
                          <li>• Keyboard navigation</li>
                          <li>• Voice control testing</li>
                          <li>• Color contrast validation</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">User Testing</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Disability user groups</li>
                          <li>• Assistive technology users</li>
                          <li>• Usability studies</li>
                          <li>• Feedback incorporation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Known Issues */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Known Issues and Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-yellow-800">
                    <p>
                      We are continuously working to improve accessibility. Current areas of focus include:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>• Enhancing voice navigation for complex forms</li>
                      <li>• Improving mobile screen reader experience</li>
                      <li>• Adding more customization options for cognitive accessibility</li>
                      <li>• Expanding language support for accessibility features</li>
                    </ul>
                    <p className="text-sm">
                      Expected completion: Q2 2024. We welcome feedback on these and other accessibility concerns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technology" className="space-y-6">
              <div className="space-y-6">
                {assistiveTechnologies.map((tech, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{tech.name}</CardTitle>
                        <Badge 
                          variant={tech.support === 'Full Support' ? 'default' : 'secondary'}
                          className={tech.support === 'Full Support' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {tech.support}
                        </Badge>
                      </div>
                      <CardDescription>{tech.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Compatible Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {tech.examples.map((example, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Browser Compatibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Browser and Platform Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-3">Supported Browsers:</h4>
                      <div className="space-y-2">
                        {[
                          { browser: 'Chrome', version: '90+', support: 'Full' },
                          { browser: 'Firefox', version: '88+', support: 'Full' },
                          { browser: 'Safari', version: '14+', support: 'Full' },
                          { browser: 'Edge', version: '90+', support: 'Full' },
                          { browser: 'Internet Explorer', version: '11', support: 'Limited' }
                        ].map((browser, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{browser.browser} {browser.version}</span>
                            <Badge 
                              variant={browser.support === 'Full' ? 'default' : 'secondary'}
                              className={browser.support === 'Full' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {browser.support}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Supported Platforms:</h4>
                      <div className="space-y-2">
                        {[
                          { platform: 'Windows', version: '10+', support: 'Full' },
                          { platform: 'macOS', version: '10.15+', support: 'Full' },
                          { platform: 'iOS', version: '14+', support: 'Full' },
                          { platform: 'Android', version: '8+', support: 'Full' },
                          { platform: 'Linux', version: 'Modern', support: 'Full' }
                        ].map((platform, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{platform.platform} {platform.version}</span>
                            <Badge className="bg-green-100 text-green-800">
                              {platform.support}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Accessibility Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Accessibility Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your experience with these accessibility options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {accessibilitySettings.map((setting, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-semibold">{setting.setting}</h4>
                        <div className="grid gap-2 md:grid-cols-4">
                          {setting.options.map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={setting.setting}
                                defaultChecked={option === setting.default}
                                className="rounded"
                              />
                              <span className="text-sm">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Settings */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Enable High Contrast</span>
                          <Contrast className="h-4 w-4" />
                        </div>
                      </button>
                      <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Increase Text Size</span>
                          <Type className="h-4 w-4" />
                        </div>
                      </button>
                      <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Reduce Motion</span>
                          <Settings className="h-4 w-4" />
                        </div>
                      </button>
                      <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Enable Audio Descriptions</span>
                          <Volume2 className="h-4 w-4" />
                        </div>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="h-5 w-5 mr-2 text-blue-600" />
                      Accessibility Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-1">Browser Extensions</h4>
                        <p className="text-sm text-gray-600">Download accessibility extensions for enhanced support</p>
                        <a href="#" className="text-blue-600 text-sm hover:underline flex items-center mt-1">
                          View recommendations <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-1">Mobile Apps</h4>
                        <p className="text-sm text-gray-600">Accessibility-optimized mobile applications</p>
                        <a href="#" className="text-blue-600 text-sm hover:underline flex items-center mt-1">
                          Download apps <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-1">User Guide</h4>
                        <p className="text-sm text-gray-600">Comprehensive accessibility guide and tutorials</p>
                        <a href="#" className="text-blue-600 text-sm hover:underline flex items-center mt-1">
                          View guide <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Accessibility Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Email:</h4>
                        <p className="text-sm text-gray-700">accessibility@govwhiz.uk</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Phone:</h4>
                        <p className="text-sm text-gray-700">0300 123 4567 (Text phone available)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Post:</h4>
                        <p className="text-sm text-gray-700">
                          Accessibility Team<br />
                          GOVWHIZ<br />
                          PO Box 123<br />
                          London, SW1A 1AA
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Response Time:</h4>
                        <Badge variant="outline">Within 2 business days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Alternative Access Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Phone Service:</h4>
                        <p className="text-sm text-gray-700">
                          Complete government services available by phone
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">In-Person Support:</h4>
                        <p className="text-sm text-gray-700">
                          Visit local government offices for assistance
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Large Print Materials:</h4>
                        <p className="text-sm text-gray-700">
                          Request documents in alternative formats
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Sign Language:</h4>
                        <p className="text-sm text-gray-700">
                          BSL interpreters available by appointment
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Feedback and Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We value your feedback on our accessibility features. Your input helps us improve 
                      the experience for all users.
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-blue-900 mb-1">Email Feedback</h4>
                        <p className="text-xs text-blue-700">accessibility@govwhiz.uk</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <Phone className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-900 mb-1">Phone Feedback</h4>
                        <p className="text-xs text-green-700">0300 123 4567</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg text-center">
                        <ExternalLink className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-purple-900 mb-1">Online Form</h4>
                        <p className="text-xs text-purple-700">Feedback form available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Information */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Legal Information</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      This accessibility statement was prepared on 15 January 2024. It was last reviewed on 15 January 2024.
                    </p>
                    <p>
                      This website is run by GOVWHIZ Ltd. We want as many people as possible to be able to use this website.
                    </p>
                    <p>
                      If you cannot access any part of this website or want to report an accessibility problem, 
                      please contact our accessibility team using the details above.
                    </p>
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

export default AccessibilityPage;