import React from 'react';
import { Crown, Mail, Phone, MapPin, ExternalLink, Shield, Globe, Users, FileText } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Government Services': [
      { name: 'UK Parliament', url: 'https://parliament.uk' },
      { name: 'GOV.UK', url: 'https://gov.uk' },
      { name: 'NHS', url: 'https://nhs.uk' },
      { name: 'HMRC', url: 'https://hmrc.gov.uk' }
    ],
    'Your Rights': [
      { name: 'Human Rights', url: '#rights' },
      { name: 'Freedom of Information', url: '#foi' },
      { name: 'Data Protection', url: '#privacy' },
      { name: 'Equality Act', url: '#equality' }
    ],
    'Get Involved': [
      { name: 'Find Your MP', url: '#mp-search' },
      { name: 'Petition Parliament', url: 'https://petition.parliament.uk' },
      { name: 'Local Councils', url: '#councils' },
      { name: 'Volunteer', url: '#volunteer' }
    ],
    'Support': [
      { name: 'Contact Us', url: '#contact' },
      { name: 'Privacy Policy', url: '#privacy' },
      { name: 'Terms of Service', url: '#terms' },
      { name: 'Accessibility', url: '#accessibility' }
    ]
  };

  const importantContacts = [
    {
      icon: Phone,
      title: 'General Enquiries',
      detail: '0800 123 4567',
      subtitle: 'Mon-Fri, 9AM-5PM'
    },
    {
      icon: Mail,
      title: 'Email Support',
      detail: 'info@gov.uk',
      subtitle: 'Response within 2 days'
    },
    {
      icon: MapPin,
      title: 'Address',
      detail: 'Westminster, London',
      subtitle: 'SW1A 0AA'
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-xl font-bold">Unofficial Gov Services</h3>
                  <p className="text-primary-foreground/80 text-sm">United Kingdom</p>
                </div>
              </div>
              
              <p className="text-primary-foreground/80 leading-relaxed max-w-md">
                Your unofficial gateway to British government services, democratic participation, 
                and citizen engagement. Connecting you with your representatives and your rights.
              </p>

              {/* Government Badge */}
              <div className="inline-flex items-center space-x-2 bg-accent px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-accent-foreground" />
                <span className="text-accent-foreground text-sm font-medium">
                  Unofficial Government Service
                </span>
              </div>

              {/* Important Contacts */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary-foreground">Quick Contact</h4>
                {importantContacts.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <contact.icon className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{contact.detail}</p>
                      <p className="text-xs text-primary-foreground/70">{contact.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([section, links]) => (
                <div key={section} className="space-y-4">
                  <h4 className="font-semibold text-primary-foreground">{section}</h4>
                  <ul className="space-y-2">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-primary-foreground/80 hover:text-accent transition-colors text-sm flex items-center space-x-1 group"
                        >
                          <span>{link.name}</span>
                          {link.url.startsWith('http') && (
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="py-8 border-t border-primary-foreground/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureSummary
              icon={<Users className="w-5 h-5" />}
              title="Find Your MP"
              description="Connect with your local representative"
            />
            <FeatureSummary
              icon={<FileText className="w-5 h-5" />}
              title="Stay Informed"
              description="AI-powered news summaries"
            />
            <FeatureSummary
              icon={<Shield className="w-5 h-5" />}
              title="Know Your Rights"
              description="Complete guide to citizen rights"
            />
            <FeatureSummary
              icon={<Globe className="w-5 h-5" />}
              title="Get Involved"
              description="Participate in democracy"
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-primary-foreground/80">
              <p>&copy; {currentYear} Crown Copyright. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <a href="#privacy" className="hover:text-accent transition-colors">
                  Privacy
                </a>
                <a href="#cookies" className="hover:text-accent transition-colors">
                  Cookies
                </a>
                <a href="#accessibility" className="hover:text-accent transition-colors">
                  Accessibility
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Online/Offline Status */}
              <div className="flex items-center space-x-2">
                {navigator.onLine ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-primary-foreground/70">Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-primary-foreground/70">Offline</span>
                  </>
                )}
              </div>
              
              <img 
                src="/images/union-jack.jpg" 
                alt="Union Jack" 
                className="w-8 h-6 rounded border border-primary-foreground/20"
              />
              <span className="text-sm font-medium">United Kingdom</span>
            </div>
          </div>
        </div>

        {/* Government Notice */}
        <div className="py-4 border-t border-primary-foreground/20">
          <div className="bg-primary-foreground/10 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary-foreground/90">
                <p className="font-medium mb-1">Unofficial Government Service Platform</p>
                <p>
                  This is an unofficial service designed to help citizens engage with UK democratic processes. 
                  Information is provided for guidance only. For official government services, please visit 
                  <a href="https://gov.uk" className="text-accent hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                    GOV.UK
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FeatureSummaryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureSummary({ icon, title, description }: FeatureSummaryProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 p-2 bg-accent rounded-lg text-accent-foreground">
        {icon}
      </div>
      <div>
        <h5 className="font-medium text-primary-foreground text-sm">{title}</h5>
        <p className="text-primary-foreground/70 text-xs">{description}</p>
      </div>
    </div>
  );
}