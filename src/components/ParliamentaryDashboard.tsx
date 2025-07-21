import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Vote, 
  AlertCircle, 
  TrendingUp,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';

interface ParliamentarySession {
  id: string;
  title: string;
  type: 'debate' | 'committee' | 'voting' | 'question_time';
  status: 'live' | 'upcoming' | 'completed';
  startTime: string;
  endTime?: string;
  chamber: 'commons' | 'lords';
  participants: number;
  description: string;
  bills?: string[];
}

interface VotingResult {
  id: string;
  billTitle: string;
  voteType: 'division' | 'voice' | 'committee';
  result: 'passed' | 'rejected' | 'pending';
  ayes: number;
  noes: number;
  abstentions: number;
  timestamp: string;
  significance: 'high' | 'medium' | 'low';
}

interface CommitteeMeeting {
  id: string;
  committee: string;
  title: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  witnesses: string[];
  topics: string[];
  room: string;
}

const ParliamentaryDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<ParliamentarySession[]>([]);
  const [votingResults, setVotingResults] = useState<VotingResult[]>([]);
  const [committeeMeetings, setCommitteeMeetings] = useState<CommitteeMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    // Simulate loading parliamentary data
    const loadParliamentaryData = async () => {
      setLoading(true);
      
      // Mock data - in real implementation, this would come from UK Parliament API
      const mockSessions: ParliamentarySession[] = [
        {
          id: '1',
          title: 'Prime Minister\'s Questions',
          type: 'question_time',
          status: 'live',
          startTime: '2024-01-17T12:00:00Z',
          chamber: 'commons',
          participants: 650,
          description: 'Weekly questions to the Prime Minister from MPs',
          bills: []
        },
        {
          id: '2',
          title: 'Housing and Planning Bill - Second Reading',
          type: 'debate',
          status: 'upcoming',
          startTime: '2024-01-17T14:30:00Z',
          chamber: 'commons',
          participants: 0,
          description: 'Debate on the Housing and Planning Bill second reading',
          bills: ['Housing and Planning Bill 2024']
        },
        {
          id: '3',
          title: 'Economic Affairs Committee',
          type: 'committee',
          status: 'upcoming',
          startTime: '2024-01-17T15:00:00Z',
          chamber: 'lords',
          participants: 12,
          description: 'Discussion on inflation and monetary policy',
          bills: []
        }
      ];

      const mockVotingResults: VotingResult[] = [
        {
          id: '1',
          billTitle: 'Digital Markets, Competition and Consumers Bill',
          voteType: 'division',
          result: 'passed',
          ayes: 342,
          noes: 278,
          abstentions: 12,
          timestamp: '2024-01-16T18:45:00Z',
          significance: 'high'
        },
        {
          id: '2',
          billTitle: 'Energy Security and Net Zero Bill',
          voteType: 'division',
          result: 'passed',
          ayes: 398,
          noes: 234,
          abstentions: 8,
          timestamp: '2024-01-16T16:30:00Z',
          significance: 'high'
        },
        {
          id: '3',
          billTitle: 'Local Government Finance Amendment',
          voteType: 'committee',
          result: 'rejected',
          ayes: 4,
          noes: 8,
          abstentions: 1,
          timestamp: '2024-01-16T14:15:00Z',
          significance: 'medium'
        }
      ];

      const mockCommittees: CommitteeMeeting[] = [
        {
          id: '1',
          committee: 'Treasury Committee',
          title: 'Bank of England Monetary Policy Report',
          date: '2024-01-18',
          time: '09:30',
          status: 'scheduled',
          witnesses: ['Andrew Bailey (Governor, Bank of England)', 'Sarah Breeden (Deputy Governor)'],
          topics: ['Interest rates', 'Inflation targets', 'Economic outlook'],
          room: 'Committee Room 15'
        },
        {
          id: '2',
          committee: 'Health and Social Care Committee',
          title: 'NHS Winter Pressures Inquiry',
          date: '2024-01-18',
          time: '14:00',
          status: 'scheduled',
          witnesses: ['NHS England executives', 'Royal College representatives'],
          topics: ['A&E waiting times', 'Staff shortages', 'Capacity planning'],
          room: 'Committee Room 14'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(mockSessions);
      setVotingResults(mockVotingResults);
      setCommitteeMeetings(mockCommittees);
      setLoading(false);
    };

    loadParliamentaryData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="destructive" className="animate-pulse">🔴 LIVE</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">📅 Upcoming</Badge>;
      case 'completed':
        return <Badge variant="outline">✅ Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVoteResultIcon = (result: string) => {
    switch (result) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Minus className="w-5 h-5 text-yellow-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Parliamentary data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏛️ Live Parliamentary Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time updates from the UK Parliament - debates, votes, and committee meetings as they happen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === 'live').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Vote className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Votes</p>
                  <p className="text-2xl font-bold text-gray-900">{votingResults.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Committees Today</p>
                  <p className="text-2xl font-bold text-gray-900">{committeeMeetings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bills Passed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {votingResults.filter(v => v.result === 'passed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live">Live Sessions</TabsTrigger>
            <TabsTrigger value="votes">Recent Votes</TabsTrigger>
            <TabsTrigger value="committees">Committees</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Live Sessions Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {session.description}
                        </CardDescription>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {formatTime(session.startTime)}
                          {session.endTime && ` - ${formatTime(session.endTime)}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {session.chamber === 'commons' ? 'House of Commons' : 'House of Lords'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{session.participants} participants</span>
                      </div>
                    </div>
                    {session.bills && session.bills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Related Bills:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.bills.map((bill, index) => (
                            <Badge key={index} variant="outline">{bill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.status === 'live' && (
                      <div className="mt-4">
                        <Button className="w-full md:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          Watch Live Stream
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Votes Tab */}
          <TabsContent value="votes" className="space-y-6">
            <div className="grid gap-6">
              {votingResults.map((vote) => (
                <Card key={vote.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center space-x-2">
                          {getVoteResultIcon(vote.result)}
                          <span>{vote.billTitle}</span>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {vote.voteType === 'division' ? 'Parliamentary Division' : 'Committee Vote'} • 
                          {formatDate(vote.timestamp)} at {formatTime(vote.timestamp)}
                        </CardDescription>
                      </div>
                      <Badge variant={vote.result === 'passed' ? 'default' : 'destructive'}>
                        {vote.result.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{vote.ayes}</div>
                        <div className="text-sm text-gray-600">Ayes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{vote.noes}</div>
                        <div className="text-sm text-gray-600">Noes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{vote.abstentions}</div>
                        <div className="text-sm text-gray-600">Abstentions</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(vote.ayes / (vote.ayes + vote.noes + vote.abstentions)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Majority: {Math.abs(vote.ayes - vote.noes)}</span>
                        <span>Total: {vote.ayes + vote.noes + vote.abstentions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Committees Tab */}
          <TabsContent value="committees" className="space-y-6">
            <div className="grid gap-6">
              {committeeMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{meeting.committee}</CardTitle>
                        <CardDescription className="mt-2">
                          {meeting.title}
                        </CardDescription>
                      </div>
                      <Badge variant={meeting.status === 'in_progress' ? 'destructive' : 'secondary'}>
                        {meeting.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{meeting.date} at {meeting.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{meeting.room}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                        <div className="flex flex-wrap gap-2">
                          {meeting.topics.map((topic, index) => (
                            <Badge key={index} variant="outline">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Witnesses:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {meeting.witnesses.map((witness, index) => (
                            <li key={index}>• {witness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📅 Upcoming Parliamentary Schedule</CardTitle>
                <CardDescription>
                  Key dates and events in Parliament this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Today - Wednesday, January 17</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• 12:00 PM - Prime Minister's Questions</li>
                      <li>• 2:30 PM - Housing and Planning Bill (Second Reading)</li>
                      <li>• 3:00 PM - Economic Affairs Committee</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Tomorrow - Thursday, January 18</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• 9:30 AM - Treasury Committee</li>
                      <li>• 11:30 AM - General Debate</li>
                      <li>• 2:00 PM - Health and Social Care Committee</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Friday, January 19</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• 9:30 AM - Private Members' Bills</li>
                      <li>• 11:00 AM - Backbench Business</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Stay Connected with Parliament</h3>
              <p className="text-blue-100 mb-6">
                Get real-time notifications about parliamentary activities that matter to you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Set Up Alerts
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                  <FileText className="w-5 h-5 mr-2" />
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ParliamentaryDashboard;