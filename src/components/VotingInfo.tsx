import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle, Clock, Users, MapPin, Mail, User, Calendar, AlertCircle } from 'lucide-react';

interface RegistrationStep {
  step: number;
  title: string;
  description: string;
  action: string;
}

interface VotingMethod {
  type: string;
  title: string;
  steps: string[];
  hours?: string;
  deadline?: string;
}

interface ElectionType {
  name: string;
  description: string;
  frequency: string;
  voting_system: string;
}

interface VotingData {
  registration: {
    title: string;
    description: string;
    eligibility: string[];
    steps: RegistrationStep[];
    deadlines: Record<string, string>;
  };
  voting_process: {
    title: string;
    description: string;
    methods: VotingMethod[];
  };
  elections: {
    types: ElectionType[];
  };
  important_dates: Record<string, string>;
}

export default function VotingInfo() {
  const [data, setData] = useState<VotingData | null>(null);
  const [activeSection, setActiveSection] = useState<'registration' | 'voting' | 'elections'>('registration');

  useEffect(() => {
    fetchVotingInfo();
  }, []);

  const fetchVotingInfo = async () => {
    try {
      // Create voting info data programmatically instead of relying on local files
      const votingInfoData = {
        registration: {
          title: 'Voter Registration',
          description: 'Register to vote to participate in UK elections and make your voice heard in democracy.',
          eligibility: [
            'British, Irish, or qualifying Commonwealth citizen',
            'At least 18 years old on polling day',
            'Resident at an address in the UK',
            'Not legally excluded from voting'
          ],
          steps: [
            {
              title: 'Check if you\'re already registered',
              description: 'Contact your local Electoral Registration Office or check online',
              timeRequired: '5 minutes',
              difficulty: 'Easy'
            },
            {
              title: 'Register online at gov.uk',
              description: 'Complete the online registration form with your details',
              timeRequired: '5-10 minutes',
              difficulty: 'Easy'
            },
            {
              title: 'Provide required information',
              description: 'National Insurance number, date of birth, and address details',
              timeRequired: '2 minutes',
              difficulty: 'Easy'
            }
          ],
          deadlines: {
            general_election: '12 working days before polling day',
            local_election: '12 working days before polling day',
            european_election: '12 working days before polling day'
          }
        },
        voting_process: {
          title: 'How to Vote',
          description: 'Learn about the different ways you can cast your vote in UK elections.',
          methods: [
            {
              type: 'In Person',
              title: 'Vote at your polling station',
              description: 'Visit your designated polling station on election day',
              requirements: ['Valid photo ID', 'Polling card (recommended)'],
              timeframe: '7am to 10pm on polling day'
            },
            {
              type: 'By Post',
              title: 'Postal vote',
              description: 'Apply for a postal vote and vote by mail',
              requirements: ['Postal vote application', 'Valid signature'],
              timeframe: 'Apply by 5pm, 11 working days before election'
            },
            {
              type: 'By Proxy',
              title: 'Proxy vote',
              description: 'Appoint someone to vote on your behalf',
              requirements: ['Proxy vote application', 'Valid reason'],
              timeframe: 'Apply by 5pm, 6 working days before election'
            }
          ]
        },
        elections: {
          types: [
            {
              name: 'General Election',
              description: 'Elect MPs to the House of Commons',
              frequency: 'Every 5 years (maximum)',
              scope: 'National'
            },
            {
              name: 'Local Elections',
              description: 'Elect local councillors',
              frequency: 'Every 4 years',
              scope: 'Local authority areas'
            },
            {
              name: 'Mayoral Elections',
              description: 'Elect mayors in certain areas',
              frequency: 'Every 4 years',
              scope: 'Metropolitan areas with mayors'
            },
            {
              name: 'Police and Crime Commissioner',
              description: 'Elect Police and Crime Commissioners',
              frequency: 'Every 4 years',
              scope: 'Police force areas'
            }
          ]
        },
        important_dates: {
          next_general_election: 'By January 2025',
          local_elections_2024: 'May 2024',
          voter_registration_deadline: '12 working days before each election'
        }
      };
      setData(votingInfoData);
    } catch (error) {
      console.error('Error creating voting info:', error);
    }
  };

  if (!data) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading voting information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Vote className="w-4 h-4" />
            <span>Democratic Participation</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Complete Voting Guide
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about registering to vote and participating 
            in British elections. Make your voice heard in democracy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('registration')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'registration'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registration
            </button>
            <button
              onClick={() => setActiveSection('voting')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'voting'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How to Vote
            </button>
            <button
              onClick={() => setActiveSection('elections')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'elections'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Election Types
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'registration' && (
          <div className="space-y-8">
            {/* Eligibility */}
            <div className="uk-gov-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Am I Eligible to Vote?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">You can register if you are:</h4>
                  <ul className="space-y-2">
                    {data.registration.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Important Note</h4>
                      <p className="text-blue-800 text-sm">
                        You must register separately for each address where you are eligible to vote. 
                        Students can register at both their home and university addresses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Steps */}
            <div className="uk-gov-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Registration Process
              </h3>
              <div className="space-y-6">
                {data.registration.steps.map((step, index) => (
                  <RegistrationStepCard key={index} step={step} />
                ))}
              </div>
            </div>

            {/* Deadlines */}
            <div className="uk-gov-card bg-red-50 border border-red-200">
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-4">
                    Registration Deadlines
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(data.registration.deadlines).map(([election, deadline]) => (
                      <div key={election} className="bg-white rounded-lg p-4 border border-red-200">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {election.replace('_', ' ')}
                        </h4>
                        <p className="text-red-700 font-medium">{deadline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'voting' && (
          <div className="space-y-8">
            {data.voting_process.methods.map((method, index) => (
              <VotingMethodCard key={index} method={method} />
            ))}
          </div>
        )}

        {activeSection === 'elections' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {data.elections.types.map((election, index) => (
                <ElectionTypeCard key={index} election={election} />
              ))}
            </div>

            {/* Important Dates */}
            <div className="uk-gov-card bg-yellow-50 border border-yellow-200">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">
                    Upcoming Important Dates
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(data.important_dates).map(([event, date]) => (
                      <div key={event} className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {event.replace('_', ' ')}
                        </h4>
                        <p className="text-yellow-700 font-medium">{date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface RegistrationStepCardProps {
  step: RegistrationStep;
}

function RegistrationStepCard({ step }: RegistrationStepCardProps) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
        {step.step}
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">{step.title}</h4>
        <p className="text-gray-600 text-sm">{step.description}</p>
        <p className="text-primary font-medium text-sm">{step.action}</p>
      </div>
    </div>
  );
}

interface VotingMethodCardProps {
  method: VotingMethod;
}

function VotingMethodCard({ method }: VotingMethodCardProps) {
  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'In Person':
        return <MapPin className="w-6 h-6" />;
      case 'By Post':
        return <Mail className="w-6 h-6" />;
      case 'By Proxy':
        return <User className="w-6 h-6" />;
      default:
        return <Vote className="w-6 h-6" />;
    }
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'In Person':
        return 'bg-green-100 text-green-800';
      case 'By Post':
        return 'bg-blue-100 text-blue-800';
      case 'By Proxy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="uk-gov-card">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-3 rounded-lg ${getMethodColor(method.type)}`}>
          {getMethodIcon(method.type)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
          <p className="text-gray-600">{method.type}</p>
        </div>
      </div>

      <div className="space-y-4">
        <ol className="space-y-3">
          {method.steps.map((stepText, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className="text-gray-700">{stepText}</span>
            </li>
          ))}
        </ol>

        {(method.hours || method.deadline) && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid sm:grid-cols-2 gap-4">
              {method.hours && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{method.hours}</span>
                </div>
              )}
              {method.deadline && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{method.deadline}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ElectionTypeCardProps {
  election: ElectionType;
}

function ElectionTypeCard({ election }: ElectionTypeCardProps) {
  return (
    <div className="uk-gov-card">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{election.name}</h3>
        </div>
        
        <p className="text-gray-600">{election.description}</p>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Frequency</h4>
            <p className="text-gray-600 text-sm">{election.frequency}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Voting System</h4>
            <p className="text-gray-600 text-sm">{election.voting_system}</p>
          </div>
        </div>
      </div>
    </div>
  );
}