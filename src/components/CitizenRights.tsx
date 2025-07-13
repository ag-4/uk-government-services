import React, { useState, useEffect } from 'react';
import { Shield, Scale, Heart, Users, Globe, Lock, CheckCircle, ArrowRight } from 'lucide-react';

interface Right {
  id: string;
  category: string;
  title: string;
  description: string;
  details: string[];
}

interface Responsibility {
  title: string;
  description: string;
  examples: string[];
}

interface CitizenData {
  rights: Right[];
  responsibilities: Responsibility[];
}

const categoryIcons = {
  'Fundamental Rights': Shield,
  'Democratic Rights': Users,
  'Legal Rights': Scale,
  'Social Rights': Heart,
  'Civil Liberties': Globe,
  'Privacy Rights': Lock,
};

const categoryColors = {
  'Fundamental Rights': 'bg-blue-100 text-blue-800 border-blue-200',
  'Democratic Rights': 'bg-green-100 text-green-800 border-green-200',
  'Legal Rights': 'bg-purple-100 text-purple-800 border-purple-200',
  'Social Rights': 'bg-red-100 text-red-800 border-red-200',
  'Civil Liberties': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Privacy Rights': 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export default function CitizenRights() {
  const [data, setData] = useState<CitizenData>({ rights: [], responsibilities: [] });
  const [activeTab, setActiveTab] = useState<'rights' | 'responsibilities'>('rights');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchCitizenRights();
  }, []);

  const fetchCitizenRights = async () => {
    try {
      // Create citizen rights data programmatically instead of relying on local files
    const fetchedData = {
      rights: [
        {
          id: '1',
          title: 'Right to Vote',
          description: 'Every eligible citizen has the right to vote in elections and referendums',
          category: 'Democratic Rights',
          details: ['Must be 18 or over', 'Must be registered to vote', 'Applies to general, local, and European elections']
        },
        {
          id: '2',
          title: 'Freedom of Speech',
          description: 'The right to express opinions and ideas without government interference',
          category: 'Civil Liberties',
          details: ['Protected under Article 10 of ECHR', 'Subject to certain legal limitations', 'Includes freedom of press and media']
        },
        {
          id: '3',
          title: 'Right to Healthcare',
          description: 'Access to free healthcare through the National Health Service (NHS)',
          category: 'Social Rights',
          details: ['Free at point of use', 'Emergency treatment guaranteed', 'Prescription charges may apply']
        },
        {
          id: '4',
          title: 'Right to Education',
          description: 'Free education for children and access to further education opportunities',
          category: 'Social Rights',
          details: ['Compulsory education ages 5-16', 'Free state education available', 'Special educational needs support']
        },
        {
          id: '5',
          title: 'Right to Fair Trial',
          description: 'The right to a fair and public hearing by an independent tribunal',
          category: 'Legal Rights',
          details: ['Presumption of innocence', 'Right to legal representation', 'Right to appeal']
        },
        {
          id: '6',
          title: 'Freedom of Movement',
          description: 'The right to move freely within the UK and travel abroad',
          category: 'Civil Liberties',
          details: ['No internal passport required', 'Right to leave and return to UK', 'Subject to immigration controls']
        }
      ],
      responsibilities: [
        {
          title: 'Obey the Law',
          description: 'All citizens must follow UK laws and regulations'
        },
        {
          title: 'Pay Taxes',
          description: 'Contribute to public services through taxation'
        },
        {
          title: 'Jury Service',
          description: 'Serve on juries when called upon by the courts'
        },
        {
          title: 'Respect Others',
          description: 'Treat all people with dignity and respect regardless of background'
        }
      ]
    };
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching citizen rights:', error);
    }
  };

  const categories = ['All', ...Array.from(new Set(data.rights.map(r => r.category)))];
  const filteredRights = selectedCategory === 'All' 
    ? data.rights 
    : data.rights.filter(r => r.category === selectedCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Know Your Rights</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            British Citizen Rights & Responsibilities
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding your fundamental rights as a British citizen and your civic responsibilities 
            is essential for active participation in democracy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('rights')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rights'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Your Rights
            </button>
            <button
              onClick={() => setActiveTab('responsibilities')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'responsibilities'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Your Responsibilities
            </button>
          </div>
        </div>

        {activeTab === 'rights' ? (
          <div className="space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Rights Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRights.map((right) => (
                <RightCard key={right.id} right={right} />
              ))}
            </div>

            {/* Rights Summary */}
            <div className="uk-gov-card bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary rounded-lg">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Rights are Protected
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    These rights are enshrined in British law and protected by various acts including 
                    the Human Rights Act 1998, which incorporates the European Convention on Human Rights 
                    into UK law. If you believe your rights have been violated, you can seek legal recourse 
                    through the courts or contact relevant ombudsman services.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Human Rights Act 1998
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Constitutional Protections
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Legal Remedies Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Responsibilities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.responsibilities.map((responsibility, index) => (
                <ResponsibilityCard key={index} responsibility={responsibility} />
              ))}
            </div>

            {/* Civic Engagement Call-to-Action */}
            <div className="uk-gov-card bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-accent rounded-full">
                    <Users className="w-8 h-8 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Active Citizenship Matters
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Being a responsible citizen means more than just following laws. It involves 
                  active participation in your community, staying informed about political issues, 
                  and contributing to the common good.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => scrollToSection('action')}
                    className="uk-gov-accent inline-flex items-center space-x-2"
                  >
                    <span>Get Involved</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.open('https://www.gov.uk/browse/citizenship', '_blank')}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface RightCardProps {
  right: Right;
}

function RightCard({ right }: RightCardProps) {
  const CategoryIcon = categoryIcons[right.category as keyof typeof categoryIcons];
  const categoryClass = categoryColors[right.category as keyof typeof categoryColors];

  return (
    <div className="uk-gov-card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryClass}`}>
            {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
            <span>{right.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">
            {right.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {right.description}
          </p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Key protections:</h4>
            <ul className="space-y-1">
              {right.details.map((detail, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResponsibilityCardProps {
  responsibility: Responsibility;
}

function ResponsibilityCard({ responsibility }: ResponsibilityCardProps) {
  return (
    <div className="uk-gov-card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-lg">
            <CheckCircle className="w-5 h-5 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {responsibility.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {responsibility.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Examples:</h4>
          <ul className="space-y-1">
            {responsibility.examples.map((example, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}