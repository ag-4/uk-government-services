import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MapPin, 
  Building, 
  Code, 
  Globe, 
  Palette, 
  Smartphone,
  Monitor,
  Award,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  Heart,
  Flag
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const skills = [
    { name: 'React & TypeScript', level: 'Expert', icon: Code },
    { name: 'Node.js & Express', level: 'Expert', icon: Globe },
    { name: 'UI/UX Design', level: 'Expert', icon: Palette },
    { name: 'Mobile Development', level: 'Advanced', icon: Smartphone },
    { name: 'Full-Stack Development', level: 'Expert', icon: Monitor },
    { name: 'Database Design', level: 'Advanced', icon: Building }
  ];

  const services = [
    {
      title: 'Web Application Development',
      description: 'Custom web applications built with modern technologies like React, TypeScript, and Node.js',
      features: ['Responsive Design', 'Performance Optimization', 'SEO-Friendly', 'Cross-browser Compatibility']
    },
    {
      title: 'Website Design & Development',
      description: 'Professional websites that combine beautiful design with powerful functionality',
      features: ['Modern UI/UX', 'Mobile-First Design', 'Content Management', 'E-commerce Solutions']
    },
    {
      title: 'Technical Consulting',
      description: 'Strategic guidance on technology choices, architecture, and development best practices',
      features: ['Technology Assessment', 'Architecture Planning', 'Code Review', 'Performance Audits']
    }
  ];

  const achievements = [
    'Owner and Founder of AG (Development Agency)',
    'Expert in Modern Web Technologies',
    'Advocate for Accessible and Inclusive Design',
    'Community Contributor and Mentor'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              IA
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              <Flag className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ibrahim Altaqatqa
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Palestinian in the UK
            </Badge>
            <Badge variant="default" className="text-lg px-4 py-2 bg-blue-600">
              <Building className="w-4 h-4 mr-2" />
              Owner of AG
            </Badge>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert in web application and website design & development, passionate about creating 
            innovative digital solutions that make a difference in people's lives.
          </p>
        </div>

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                As a Palestinian developer based in the UK, I bring a unique perspective to web development, 
                combining technical expertise with a deep understanding of diverse user needs and cultural considerations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                I am the proud owner of AG, a development agency focused on delivering high-quality web applications 
                and websites that not only look great but also provide exceptional user experiences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                My passion lies in creating accessible, inclusive, and innovative digital solutions that bridge 
                gaps and connect communities, particularly in the government and public sector space.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Technical Expertise
            </CardTitle>
            <CardDescription>
              Specialized skills in modern web development technologies and methodologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <skill.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <Badge variant={skill.level === 'Expert' ? 'default' : 'secondary'} className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Services Offered</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AG Company Section */}
        <Card className="shadow-lg mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building className="w-6 h-6" />
              AG - Development Agency
            </CardTitle>
            <CardDescription className="text-blue-100">
              Leading the way in innovative web solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-50 leading-relaxed">
              AG is my development agency that specializes in creating cutting-edge web applications and websites. 
              We focus on delivering solutions that are not only technically excellent but also user-centered and accessible.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2">Our Mission</h4>
                <p className="text-blue-100 text-sm">
                  To bridge the digital divide by creating inclusive, accessible, and innovative web solutions 
                  that serve diverse communities and organizations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Our Values</h4>
                <p className="text-blue-100 text-sm">
                  Quality, accessibility, innovation, and cultural sensitivity guide every project we undertake, 
                  ensuring solutions that truly serve their intended users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Get In Touch
            </CardTitle>
            <CardDescription>
              Ready to discuss your next project or collaboration opportunity?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                onClick={() => window.open('mailto:owl47d@gmail.com', '_blank')}
              >
                <Mail className="w-4 h-4" />
                owl47d@gmail.com
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.open('https://www.linkedin.com/in/ag-47-ps/', '_blank')}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                View Projects
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 italic">
                "Building bridges through code, one application at a time."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;