import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Clock, 
  Vote, 
  FileText, 
  TrendingUp, 
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Gavel
} from 'lucide-react';

interface MPData {
  id: string;
  name: string;
  party: string;
  constituency: string;
  votingRecord: number;
  attendance: number;
  expenses: number;
  committees: string[];
}

interface BillData {
  id: string;
  title: string;
  stage: string;
  description: string;
  sponsor: string;
  lastUpdated: string;
  status: 'active' | 'passed' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
}

interface CommitteeData {
  id: string;
  name: string;
  chair: string;
  members: number;
  nextMeeting: string;
  recentReports: string[];
}

const ParliamentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from UK Parliament API
  const [parliamentData, setParliamentData] = useState({
    currentSession: {
      name: "2023-24 Session",
      startDate: "2023-11-07",
      sittingDays: 142,
      billsIntroduced: 89,
      questionsAnswered: 2847
    },
    recentVotes: [
      {
        id: "1",
        title: "Finance Bill 2024 - Third Reading",
        date: "2024-01-15",
        result: "Passed",
        ayes: 342,
        noes: 287,
        abstentions: 21
      },
      {
        id: "2", 
        title: "Digital Markets, Competition and Consumers Bill",
        date: "2024-01-12",
        result: "Passed",
        ayes: 398,
        noes: 242,
        abstentions: 10
      }
    ],
    upcomingBusiness: [
      {
        date: "2024-01-16",
        time: "14:30",
        event: "Prime Minister's Questions",
        chamber: "House of Commons"
      },
      {
        date: "2024-01-17",
        time: "11:00", 
        event: "Education Committee - School Funding Inquiry",
        chamber: "Committee Room 10"
      }
    ]
  });

  const [mps, setMps] = useState<MPData[]>([
    {
      id: "1",
      name: "Rt Hon Rishi Sunak MP",
      party: "Conservative",
      constituency: "Richmond (Yorks)",
      votingRecord: 89,
      attendance: 76,
      expenses: 12450,
      committees: ["Treasury Committee"]
    },
    {
      id: "2",
      name: "Rt Hon Sir Keir Starmer MP",
      party: "Labour",
      constituency: "Holborn and St Pancras",
      votingRecord: 94,
      attendance: 88,
      expenses: 8920,
      committees: ["Liaison Committee"]
    }
  ]);

  const [bills, setBills] = useState<BillData[]>([
    {
      id: "1",
      title: "Online Safety Bill",
      stage: "Royal Assent",
      description: "A Bill to make provision for and in connection with the regulation by OFCOM of certain internet services",
      sponsor: "Department for Science, Innovation and Technology",
      lastUpdated: "2023-10-26",
      status: "passed",
      votesFor: 359,
      votesAgainst: 242,
      abstentions: 49
    },
    {
      id: "2",
      title: "Renters (Reform) Bill",
      stage: "Committee Stage",
      description: "A Bill to make provision about residential tenancies in England",
      sponsor: "Department for Levelling Up, Housing and Communities",
      lastUpdated: "2024-01-10",
      status: "active",
      votesFor: 0,
      votesAgainst: 0,
      abstentions: 0
    }
  ]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMPs = mps.filter(mp => 
    mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = bills.filter(bill =>
    bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UK Parliament</h1>
          <p className="text-xl text-gray-600 mb-6">
            Live data from the Houses of Parliament, including MPs, bills, votes, and parliamentary business.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search MPs, bills, or constituencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mps">MPs</TabsTrigger>
            <TabsTrigger value="bills">Bills & Legislation</TabsTrigger>
            <TabsTrigger value="committees">Committees</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Current Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Session</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parliamentData.currentSession.name}</div>
                  <p className="text-xs text-muted-foreground">
                    Started {new Date(parliamentData.currentSession.startDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sitting Days</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parliamentData.currentSession.sittingDays}</div>
                  <p className="text-xs text-muted-foreground">
                    This session
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bills Introduced</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parliamentData.currentSession.billsIntroduced}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parliamentData.currentSession.questionsAnswered}</div>
                  <p className="text-xs text-muted-foreground">
                    Parliamentary questions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Votes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  Recent Votes
                </CardTitle>
                <CardDescription>Latest division results from the House of Commons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parliamentData.recentVotes.map((vote) => (
                    <div key={vote.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{vote.title}</h3>
                        <Badge variant={vote.result === 'Passed' ? 'default' : 'destructive'}>
                          {vote.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(vote.date).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex gap-6 text-sm">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Ayes: {vote.ayes}
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Noes: {vote.noes}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          Abstentions: {vote.abstentions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Parliamentary Business
                </CardTitle>
                <CardDescription>Scheduled events and proceedings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parliamentData.upcomingBusiness.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.event}</h3>
                        <p className="text-sm text-gray-600">{event.chamber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MPs Tab */}
          <TabsContent value="mps" className="space-y-6">
            <div className="grid gap-6">
              {filteredMPs.map((mp) => (
                <Card key={mp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{mp.name}</CardTitle>
                        <CardDescription>{mp.constituency}</CardDescription>
                      </div>
                      <Badge variant="outline">{mp.party}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Voting Record</p>
                        <Progress value={mp.votingRecord} className="mb-1" />
                        <p className="text-xs text-gray-600">{mp.votingRecord}% participation</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Attendance</p>
                        <Progress value={mp.attendance} className="mb-1" />
                        <p className="text-xs text-gray-600">{mp.attendance}% of sessions</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Annual Expenses</p>
                        <p className="text-lg font-semibold">£{mp.expenses.toLocaleString()}</p>
                      </div>
                    </div>
                    {mp.committees.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Committee Memberships</p>
                        <div className="flex flex-wrap gap-2">
                          {mp.committees.map((committee, index) => (
                            <Badge key={index} variant="secondary">{committee}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            <div className="grid gap-6">
              {filteredBills.map((bill) => (
                <Card key={bill.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Gavel className="w-5 h-5" />
                          {bill.title}
                        </CardTitle>
                        <CardDescription>{bill.sponsor}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            bill.status === 'passed' ? 'default' : 
                            bill.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {bill.stage}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          Updated {new Date(bill.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{bill.description}</p>
                    
                    {bill.status === 'passed' && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{bill.votesFor}</p>
                          <p className="text-xs text-gray-600">For</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{bill.votesAgainst}</p>
                          <p className="text-xs text-gray-600">Against</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{bill.abstentions}</p>
                          <p className="text-xs text-gray-600">Abstentions</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Parliament.uk
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Read Full Text
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Committees Tab */}
          <TabsContent value="committees" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Committee Information</h3>
              <p className="text-gray-600 mb-4">
                Detailed committee information and schedules will be available here.
              </p>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Parliament.uk
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParliamentPage;