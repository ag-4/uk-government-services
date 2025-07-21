import React from 'react';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Heart, 
  ExternalLink, 
  ArrowRight, 
  Phone,
  Mail,
  Globe,
  MapPin,
  Megaphone,
  FileText
} from 'lucide-react';

export default function CallToAction() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const engagementOptions = [
    {
      icon: MessageCircle,
      title: 'Join Online Petitions',
      description: 'Support causes you care about through official UK government petitions',
      action: 'Start Petitioning',
      link: 'https://petition.parliament.uk',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      icon: Calendar,
      title: 'Attend Council Meetings',
      description: 'Participate in local council meetings and have your voice heard in community decisions',
      action: 'Find Meetings',
      link: 'https://www.gov.uk/find-local-council',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      icon: Heart,
      title: 'Community Volunteering',
      description: 'Get involved in local community projects and make a difference in your area',
      action: 'Find Opportunities',
      link: 'https://www.gov.uk/volunteering',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Political Parties',
      description: 'Join a political party to influence policy and support candidates you believe in',
      action: 'Explore Parties',
      link: 'https://www.parliament.uk/about/mps-and-lords/members/parties/',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      icon: Megaphone,
      title: 'Campaign for Change',
      description: 'Start or join campaigns for issues that matter to your community',
      action: 'Get Campaigning',
      link: 'https://www.38degrees.org.uk/',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600'
    },
    {
      icon: FileText,
      title: 'Freedom of Information',
      description: 'Request information from public bodies to increase government transparency',
      action: 'Make Requests',
      link: 'https://www.gov.uk/make-a-freedom-of-information-request',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-indigo-600'
    }
  ];

  const quickActions = [
    {
      icon: Phone,
      title: 'Contact Your Council',
      description: 'Find and contact your local council members',
      action: 'Call Now',
      onClick: () => scrollToSection('council-search')
    },
    {
      icon: Mail,
      title: 'Send a Letter',
      description: 'Write a formal letter using our templates',
      action: 'Write Letter',
      onClick: () => scrollToSection('templates')
    },
    {
      icon: Globe,
      title: 'Follow Parliament',
      description: 'Stay updated with parliamentary proceedings',
      action: 'Watch Live',
      onClick: () => handleExternalLink('https://parliamentlive.tv/')
    },
    {
      icon: MapPin,
      title: 'Local Issues',
      description: 'Report problems in your community',
      action: 'Report Issue',
      onClick: () => handleExternalLink('https://www.gov.uk/report-problem-to-council')
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Get Involved in Democracy</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Make Your Voice Count in
            <span className="block text-accent">British Democracy</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Democracy works best when citizens are actively engaged. Discover the many ways 
            you can participate in shaping your community and country's future.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Take Action Today</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} action={action} />
            ))}
          </div>
        </div>

        {/* Main Engagement Options */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ways to Get Involved</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              Choose from various ways to engage with the democratic process and make a meaningful impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementOptions.map((option, index) => (
              <EngagementCard key={index} option={option} />
            ))}
          </div>
        </div>

        {/* Democratic Participation Stats */}
        <div className="mt-16 pt-16 border-t border-white/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatCard
              number="73.6%"
              label="Voter Turnout 2019"
              icon={<Users className="w-8 h-8 mx-auto mb-2 text-accent" />}
            />
            <StatCard
              number="650"
              label="MPs in Parliament"
              icon={<MessageCircle className="w-8 h-8 mx-auto mb-2 text-accent" />}
            />
            <StatCard
              number="10,000+"
              label="Annual Petitions"
              icon={<FileText className="w-8 h-8 mx-auto mb-2 text-accent" />}
            />
            <StatCard
              number="418"
              label="Local Authorities"
              icon={<MapPin className="w-8 h-8 mx-auto mb-2 text-accent" />}
            />
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Democracy Needs Your Participation
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Every voice matters in shaping the future of Britain. Whether you vote, volunteer, 
              petition, or simply stay informed, your participation strengthens our democracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="uk-gov-accent inline-flex items-center space-x-2 text-lg">
                <span>Find Your Council</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white transition-colors inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium text-lg">
                <span>Register to Vote</span>
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface EngagementCardProps {
  option: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action: string;
    link: string;
    color: string;
    textColor: string;
  };
}

function EngagementCard({ option }: EngagementCardProps) {
  const Icon = option.icon;

  const handleClick = () => {
    if (option.link.startsWith('http')) {
      window.open(option.link, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal navigation
      window.location.hash = option.link;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all group">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${option.color.replace('hover:', '')} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
            {option.title}
          </h3>
        </div>
        
        <p className="text-white/80 text-sm leading-relaxed">
          {option.description}
        </p>
        
        <button 
          onClick={handleClick}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white transition-colors px-4 py-2 rounded-md font-medium text-sm"
        >
          {option.action}
        </button>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  action: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action: string;
    onClick: () => void;
  };
}

function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all group cursor-pointer"
      onClick={action.onClick}
    >
      <div className="text-center space-y-3">
        <Icon className="w-8 h-8 mx-auto text-accent group-hover:scale-110 transition-transform" />
        <div>
          <h4 className="font-semibold text-white group-hover:text-accent transition-colors">
            {action.title}
          </h4>
          <p className="text-white/70 text-xs">{action.description}</p>
        </div>
        <button className="text-accent hover:text-accent/80 font-medium text-sm transition-colors">
          {action.action}
        </button>
      </div>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

function StatCard({ number, label, icon }: StatCardProps) {
  return (
    <div className="space-y-2">
      {icon}
      <div className="text-3xl font-bold text-accent">{number}</div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
}