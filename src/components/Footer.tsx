import React from 'react';
import { Crown, Mail, Phone, MapPin, ExternalLink, Shield, Globe, Users, FileText, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'About': [
      { name: 'About This Service', url: '#about' },
      { name: 'How It Works', url: '#how-it-works' },
      { name: 'Data Sources', url: '#data-sources' },
      { name: 'Contact Support', url: '#contact' }
    ],
    'Services': [
      { name: 'Find Your MP', url: '#mp-search' },
      { name: 'Contact Templates', url: '#templates' },
      { name: 'Voting Information', url: '#voting' },
      { name: 'Citizen Rights', url: '#rights' }
    ],
    'Government Links': [
      { name: 'UK Parliament', url: 'https://parliament.uk' },
      { name: 'GOV.UK', url: 'https://gov.uk' },
      { name: 'NHS', url: 'https://nhs.uk' },
      { name: 'HMRC', url: 'https://hmrc.gov.uk' }
    ],
    'Legal': [
      { name: 'Privacy Policy', url: '#privacy' },
      { name: 'Terms of Service', url: '#terms' },
      { name: 'Accessibility', url: '#accessibility' },
      { name: 'Disclaimer', url: '#disclaimer' }
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
      detail: 'support@govwhiz.uk',
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
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">About GOVWHIZ</h3>
            <p className="text-muted-foreground">
              GOVWHIZ is your gateway to UK Government services and parliamentary engagement.
              Our platform helps you connect with your MP and stay informed about parliamentary activities.
            </p>
          </div>
          
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-2">Service Information</h3>
            <p className="text-muted-foreground">
              GOVWHIZ - Your Gateway to UK Government Services
              <br />
              United Kingdom
            </p>
            <div className="mt-4">
              <a
                href="https://govwhiz.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit GOVWHIZ
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            GOVWHIZ is committed to improving citizen engagement with Parliament through innovative digital solutions.
          </p>
          <p className="mt-2">
            © {currentYear} GOVWHIZ. All rights reserved.
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