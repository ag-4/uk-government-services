import React from 'react';
import { Crown, Mail, Phone, MapPin, ExternalLink, Shield, Globe, Users, FileText, Github, Cookie, Lock, Info } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'About': [
      { name: 'About Us', url: '/about-us.html', icon: Info },
      { name: 'How It Works', url: '#how-it-works' },
      { name: 'Data Sources', url: '#data-sources' },
      { name: 'Contact Support', url: '#contact' }
    ],
    'Services': [
      { name: 'Find Your MP', url: '#mp-search' },
      { name: 'Contact Templates', url: '#templates' },
      { name: 'Newsletter Subscription', url: '#newsletter' },
      { name: 'Manage Subscriptions', url: '/subscription-management.html' },
      { name: 'Voting Information', url: '#voting' },
      { name: 'Citizen Rights', url: '#rights' }
    ],
    'Government Links': [
      { name: 'UK Parliament', url: 'https://parliament.uk' },
      { name: 'GOV.UK', url: 'https://gov.uk' },
      { name: 'NHS', url: 'https://nhs.uk' },
      { name: 'HMRC', url: 'https://hmrc.gov.uk' }
    ],
    'Legal & Privacy': [
      { name: 'Privacy Policy', url: '/privacy-policy.html', icon: Lock },
      { name: 'Cookie Policy', url: '/cookie-policy.html', icon: Cookie },
      { name: 'Accessibility', url: '#accessibility' },
      { name: 'Terms of Service', url: '#terms' }
    ]
  };

  const importantContacts = [
    {
      icon: Phone,
      title: 'General Enquiries',
      detail: '07522187669',
      subtitle: 'Mon-Fri, 9AM-5PM'
    },
    {
      icon: Mail,
      title: 'Email Support',
      detail: 'owl47d@gmail.com',
      subtitle: 'Response within 2 days'
    },
    {
      icon: MapPin,
      title: 'Address',
      detail: 'Manchester, UK',
      subtitle: 'M21 9WQ'
    }
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-primary">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : '_self'}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.icon && <link.icon className="h-4 w-4 mr-2" />}
                      {link.name}
                      {link.url.startsWith('http') && <ExternalLink className="h-3 w-3 ml-1" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid gap-6 md:grid-cols-3">
            {importantContacts.map((contact, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                  <contact.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{contact.title}</h4>
                  <p className="text-sm text-muted-foreground">{contact.detail}</p>
                  <p className="text-xs text-muted-foreground">{contact.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UK Government Compliance Notice */}
        <div className="mt-8 pt-6 border-t bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">UK Government Compliance</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                This service complies with UK government digital standards, data protection laws (UK GDPR), 
                and accessibility requirements. We are committed to transparency, security, and serving the public interest.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-blue-700 dark:text-blue-300">
                <span>✓ UK GDPR Compliant</span>
                <span>✓ WCAG 2.1 AA Accessible</span>
                <span>✓ GDS Standards</span>
                <span>✓ Data Protection Act 2018</span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Legal Links */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a
              href="/privacy-policy.html"
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 font-medium"
            >
              <Lock className="h-4 w-4 mr-2" />
              Privacy Policy
            </a>
            <a
              href="/cookie-policy.html"
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 font-medium"
            >
              <Cookie className="h-4 w-4 mr-2" />
              Cookie Policy
            </a>
            <a
              href="/about-us.html"
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 font-medium"
            >
              <Info className="h-4 w-4 mr-2" />
              About Us
            </a>
          </div>
        </div>
        
        {/* Copyright and Final Notice */}
        <div className="mt-6 pt-6 border-t text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-semibold text-primary">UK Government Services</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            🇬🇧 Connecting Citizens with Their Government • Empowering Democratic Engagement
          </p>
          <p className="text-xs text-muted-foreground">
            © {currentYear} UK Government Services. All rights reserved. 
            This is a public service platform designed to enhance democratic participation.
          </p>
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