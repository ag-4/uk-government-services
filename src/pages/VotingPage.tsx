import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  Filter,
  ExternalLink,
  FileText,
  BarChart3
} from 'lucide-react';

const VotingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');

  const upcomingElections = [
    {
      id: 1,
      title: 'Local Council Elections',
      date: '2024-05-02',
      type: 'Local',
      status: 'upcoming',
      description: 'Elections for local councillors across England',
      registrationDeadline: '2024-04-16',
      postalVoteDeadline: '2024-04-17',
      proxyVoteDeadline: '2024-04-24'
    },
    {
      id: 2,
      title: 'Police and Crime Commissioner Elections',
      date: '2024-05-02',
      type: 'Regional',
      status: 'upcoming',
      description: 'Elections for Police and Crime Commissioners',
      registrationDeadline: '2024-04-16',
      postalVoteDeadline: '2024-04-17',
      proxyVoteDeadline: '2024-04-24'
    },
    {
      id: 3,
      title: 'European Parliament Elections',
      date: '2024-06-06',
      type: 'European',
      status: 'upcoming',
      description: 'Elections for Members of the European Parliament',
      registrationDeadline: '2024-05-21',
      postalVoteDeadline: '2024-05-22',
      proxyVoteDeadline: '2024-05-29'
    }
  ];

  const recentResults = [
    {
      election: 'General Election 2019',
      date: '2019-12-12',
      turnout: '67.3%',
      winner: 'Conservative Party',
      seats: '365 seats',
      votes: '13,966,454 votes'
    },
    {
      election: 'European Parliament Elections 2019',
      date: '2019-05-23',
      turnout: '37.2%',
      winner: 'Brexit Party',
      seats: '29 seats',
      votes: '5,248,533 votes'
    },
    {
      election: 'Local Elections 2023',
      date: '2023-05-04',
      turnout: '34.9%',
      winner: 'Various',
      seats: '8,000+ seats',
      votes: 'Multiple councils'
    }
  ];

  const votingMethods = [
    {
      method: 'In Person',
      description: 'Vote at your designated polling station on election day',
      requirements: 'Valid photo ID required',
      deadline: 'Election day (7am-10pm)',
      icon: MapPin,
      color: 'blue'
    },
    {
      method: 'Postal Vote',
      description: 'Receive your ballot paper by post and return it by mail',
      requirements: 'Apply for postal vote in advance',
      deadline: '6 working days before election',
      icon: FileText,
      color: 'green'
    },
    {
      method: 'Proxy Vote',
      description: 'Appoint someone to vote on your behalf',
      requirements: 'Valid reason and trusted person',
      deadline: '6 working days before election',
      icon: Users,
      color: 'purple'
    }
  ];

  const constituencies = [
    'Birmingham Edgbaston',
    'Manchester Central',
    'Leeds Central',
    'Liverpool Riverside',
    'Newcastle upon Tyne Central',
    'Sheffield Central',
    'Bristol West',
    'Cardiff Central',
    'Edinburgh Central',
    'Glasgow Central'
  ];

  const voterStats = {
    totalRegistered: '47.5M',
    turnoutLastElection: '67.3%',
    youngVoters: '66.4%',
    onlineRegistrations: '89.2%'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Vote className="h-12 w-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Voting & Elections</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about voting, elections, and democratic participation in the UK
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Vote className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Register to Vote</h3>
                <p className="text-sm text-blue-700">Quick online registration</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Find Polling Station</h3>
                <p className="text-sm text-green-700">Locate your voting location</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Apply for Postal Vote</h3>
                <p className="text-sm text-purple-700">Vote by post</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900">Election Results</h3>
                <p className="text-sm text-orange-700">View past results</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="elections" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="elections">Elections</TabsTrigger>
              <TabsTrigger value="voting">How to Vote</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="elections" className="space-y-6">
              {/* Upcoming Elections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Elections
                  </CardTitle>
                  <CardDescription>
                    Important dates and deadlines for upcoming elections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingElections.map((election) => (
                      <Card key={election.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold text-lg mr-3">{election.title}</h3>
                                <Badge variant="outline">{election.type}</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{election.description}</p>
                              
                              <div className="grid gap-2 md:grid-cols-3 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                  <span>Election: {election.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                  <span>Register by: {election.registrationDeadline}</span>
                                </div>
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                                  <span>Postal by: {election.postalVoteDeadline}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Info className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voting" className="space-y-6">
              {/* Voting Methods */}
              <div className="grid gap-6 md:grid-cols-3">
                {votingMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <Card key={index} className={`border-${method.color}-200 bg-${method.color}-50`}>
                      <CardHeader>
                        <div className="flex items-center">
                          <div className={`p-2 bg-${method.color}-100 rounded-lg mr-3`}>
                            <IconComponent className={`h-6 w-6 text-${method.color}-600`} />
                          </div>
                          <CardTitle className={`text-${method.color}-900`}>{method.method}</CardTitle>
                        </div>
                        <CardDescription className={`text-${method.color}-700`}>
                          {method.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Requirements:</h4>
                            <p className="text-sm text-gray-700">{method.requirements}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Deadline:</h4>
                            <p className="text-sm text-gray-700">{method.deadline}</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Voter ID Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                    Voter ID Requirements
                  </CardTitle>
                  <CardDescription>
                    You need to bring photo ID to vote in person
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3 text-green-700">✓ Accepted ID</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• UK or Irish passport</li>
                        <li>• UK driving licence</li>
                        <li>• Biometric residence permit</li>
                        <li>• Identity card with PASS mark</li>
                        <li>• Older person's bus pass</li>
                        <li>• Disabled person's bus pass</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-red-700">✗ Not Accepted</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Bank cards</li>
                        <li>• Credit cards</li>
                        <li>• Utility bills</li>
                        <li>• Council tax bills</li>
                        <li>• Birth certificates</li>
                        <li>• Marriage certificates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Info className="h-4 w-4 inline mr-2" />
                      Don't have accepted ID? You can apply for a free Voter Authority Certificate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registration" className="space-y-6">
              {/* Registration Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Voter Registration</CardTitle>
                  <CardDescription>
                    Register to vote online in just a few minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-3">Who can register?</h3>
                        <ul className="space-y-2 text-sm">
                          <li>• UK, Irish, or qualifying Commonwealth citizens</li>
                          <li>• EU citizens (for local elections)</li>
                          <li>• Aged 16 or over (can vote at 18)</li>
                          <li>• Resident at a UK address</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">What you'll need:</h3>
                        <ul className="space-y-2 text-sm">
                          <li>• Your National Insurance number</li>
                          <li>• Your current address</li>
                          <li>• Your date of birth</li>
                          <li>• Your nationality</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register Online
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Paper Form
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Check Registration */}
              <Card>
                <CardHeader>
                  <CardTitle>Check Your Registration</CardTitle>
                  <CardDescription>
                    Verify your voter registration status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input placeholder="Enter your postcode" />
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Check Registration
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter your postcode to check if you're registered to vote at your current address
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {/* Recent Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Recent Election Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentResults.map((result, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{result.election}</h3>
                              <div className="grid gap-2 md:grid-cols-3 text-sm">
                                <div>
                                  <span className="font-medium">Date:</span> {result.date}
                                </div>
                                <div>
                                  <span className="font-medium">Turnout:</span> {result.turnout}
                                </div>
                                <div>
                                  <span className="font-medium">Winner:</span> {result.winner}
                                </div>
                                <div>
                                  <span className="font-medium">Seats:</span> {result.seats}
                                </div>
                                <div>
                                  <span className="font-medium">Votes:</span> {result.votes}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Full Results
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Voting Statistics */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{voterStats.totalRegistered}</div>
                    <div className="text-sm text-gray-600">Registered Voters</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">{voterStats.turnoutLastElection}</div>
                    <div className="text-sm text-gray-600">Last Election Turnout</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{voterStats.youngVoters}</div>
                    <div className="text-sm text-gray-600">Young Voter Turnout</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{voterStats.onlineRegistrations}</div>
                    <div className="text-sm text-gray-600">Online Registrations</div>
                  </CardContent>
                </Card>
              </div>

              {/* Turnout by Age Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Voter Turnout by Age Group (2019 General Election)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">18-24</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '47%'}}></div>
                        </div>
                        <span className="text-sm">47%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">25-34</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '54%'}}></div>
                        </div>
                        <span className="text-sm">54%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">35-54</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '66%'}}></div>
                        </div>
                        <span className="text-sm">66%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">55-64</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '74%'}}></div>
                        </div>
                        <span className="text-sm">74%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">65+</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '77%'}}></div>
                        </div>
                        <span className="text-sm">77%</span>
                      </div>
                    </div>
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

export default VotingPage;