import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, RefreshCw, ExternalLink, Calendar, User, Building, ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface Bill {
  billId: number;
  shortTitle: string;
  longTitle: string;
  currentStage: {
    id: number;
    description: string;
    house: string;
    stageSittings: any[];
  };
  originatingHouse: string;
  lastUpdate: string;
  billWithdrawn: string | null;
  isDefeated: boolean;
  billTypeId: number;
  introducedSessionId: number;
  includePrintedVersions: boolean;
  petitioningPeriod: string | null;
  petitionInformation: string | null;
  agent: {
    id: number;
    name: string;
    memberFrom: string;
    house: string;
    party: string;
  } | null;
  sponsors: Array<{
    member: {
      value: {
        id: number;
        nameDisplayAs: string;
        party: {
          name: string;
          abbreviation: string;
        };
      };
    };
  }>;
  promoters: any[];
  summary: string | null;
  publications: any[];
}

interface BillsResponse {
  items: Bill[];
  itemsPerPage: number;
  totalResults: number;
  links: any[];
}

type BillStatus = 'all' | 'proposed' | 'in-progress' | 'enacted' | 'defeated' | 'withdrawn';
type BillType = 'all' | 'government' | 'private-members' | 'private' | 'hybrid';
type Chamber = 'all' | 'commons' | 'lords';

const BillTracker: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus>('all');
  const [typeFilter, setTypeFilter] = useState<BillType>('all');
  const [chamberFilter, setChamberFilter] = useState<Chamber>('all');
  const [expandedBills, setExpandedBills] = useState<Set<number>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock data for demonstration - in production, this would come from the Parliament API
  const mockBills: Bill[] = [
    {
      billId: 1,
      shortTitle: "Online Safety Bill",
      longTitle: "A Bill to make provision for and in connection with the regulation by OFCOM of certain internet services; and for connected purposes.",
      currentStage: {
        id: 8,
        description: "Royal Assent",
        house: "Commons",
        stageSittings: []
      },
      originatingHouse: "Commons",
      lastUpdate: "2023-10-26T00:00:00Z",
      billWithdrawn: null,
      isDefeated: false,
      billTypeId: 1,
      introducedSessionId: 1,
      includePrintedVersions: true,
      petitioningPeriod: null,
      petitionInformation: null,
      agent: {
        id: 1,
        name: "Michelle Donelan MP",
        memberFrom: "Chippenham",
        house: "Commons",
        party: "Conservative"
      },
      sponsors: [
        {
          member: {
            value: {
              id: 1,
              nameDisplayAs: "Michelle Donelan",
              party: {
                name: "Conservative",
                abbreviation: "Con"
              }
            }
          }
        }
      ],
      promoters: [],
      summary: "The Online Safety Bill aims to make the UK the safest place in the world to be online while defending free expression. It will require tech companies to take greater responsibility for the safety of their users and tackle illegal content and activity online.",
      publications: []
    },
    {
      billId: 2,
      shortTitle: "Levelling-up and Regeneration Bill",
      longTitle: "A Bill to make provision about town and country planning; to make provision about infrastructure levy and community infrastructure levy; and for connected purposes.",
      currentStage: {
        id: 6,
        description: "Committee Stage",
        house: "Lords",
        stageSittings: []
      },
      originatingHouse: "Commons",
      lastUpdate: "2023-09-15T00:00:00Z",
      billWithdrawn: null,
      isDefeated: false,
      billTypeId: 1,
      introducedSessionId: 1,
      includePrintedVersions: true,
      petitioningPeriod: null,
      petitionInformation: null,
      agent: {
        id: 2,
        name: "Michael Gove MP",
        memberFrom: "Surrey Heath",
        house: "Commons",
        party: "Conservative"
      },
      sponsors: [],
      promoters: [],
      summary: "The Levelling-up and Regeneration Bill will reform the planning system to give communities a stronger voice in local development, while making it easier and faster to build the homes and infrastructure that communities need.",
      publications: []
    },
    {
      billId: 3,
      shortTitle: "Data Protection and Digital Information Bill",
      longTitle: "A Bill to make provision about the processing of personal data; to make provision about electronic communications; and for connected purposes.",
      currentStage: {
        id: 3,
        description: "Second Reading",
        house: "Commons",
        stageSittings: []
      },
      originatingHouse: "Commons",
      lastUpdate: "2023-08-20T00:00:00Z",
      billWithdrawn: null,
      isDefeated: false,
      billTypeId: 1,
      introducedSessionId: 1,
      includePrintedVersions: true,
      petitioningPeriod: null,
      petitionInformation: null,
      agent: {
        id: 3,
        name: "John Whittingdale MP",
        memberFrom: "Maldon",
        house: "Commons",
        party: "Conservative"
      },
      sponsors: [],
      promoters: [],
      summary: "This Bill will reform the UK's data protection regime to reduce burdens on businesses while maintaining high data protection standards. It will also reform electronic communications regulations.",
      publications: []
    },
    {
      billId: 4,
      shortTitle: "Tobacco and Vapes Bill",
      longTitle: "A Bill to make provision about the sale of tobacco and vaping products; and for connected purposes.",
      currentStage: {
        id: 2,
        description: "First Reading",
        house: "Commons",
        stageSittings: []
      },
      originatingHouse: "Commons",
      lastUpdate: "2024-01-10T00:00:00Z",
      billWithdrawn: null,
      isDefeated: false,
      billTypeId: 1,
      introducedSessionId: 1,
      includePrintedVersions: true,
      petitioningPeriod: null,
      petitionInformation: null,
      agent: {
        id: 4,
        name: "Victoria Atkins MP",
        memberFrom: "Louth and Horncastle",
        house: "Commons",
        party: "Conservative"
      },
      sponsors: [],
      promoters: [],
      summary: "The Tobacco and Vapes Bill will create a smokefree generation by preventing anyone born on or after 1 January 2009 from ever legally being sold tobacco products.",
      publications: []
    }
  ];

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from real Parliament API first
      try {
        const response = await fetch('https://bills.parliament.uk/api/v1/Bills?take=50&skip=0');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data: BillsResponse = await response.json();
        
        if (data.items && data.items.length > 0) {
          setBills(data.items);
          setLastRefresh(new Date());
          console.log('Successfully fetched bills from Parliament API');
          return;
        }
      } catch (apiError) {
        console.warn('Parliament API unavailable, falling back to mock data:', apiError);
      }
      
      // Fallback to mock data if API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBills(mockBills);
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError('Failed to fetch bills data. Please try again.');
      // Even on error, show mock data as fallback
      setBills(mockBills);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchBills();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, fetchBills]);

  const getBillStatus = (bill: Bill): BillStatus => {
    if (bill.billWithdrawn) return 'withdrawn';
    if (bill.isDefeated) return 'defeated';
    if (bill.currentStage.description === 'Royal Assent') return 'enacted';
    if (bill.currentStage.description === 'First Reading') return 'proposed';
    return 'in-progress';
  };

  const getBillType = (bill: Bill): BillType => {
    switch (bill.billTypeId) {
      case 1: return 'government';
      case 2: return 'private-members';
      case 3: return 'private';
      case 4: return 'hybrid';
      default: return 'government';
    }
  };

  const getStatusColor = (status: BillStatus): string => {
    switch (status) {
      case 'proposed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'enacted': return 'bg-green-100 text-green-800';
      case 'defeated': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: BillStatus) => {
    switch (status) {
      case 'proposed': return <FileText className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'enacted': return <CheckCircle className="w-4 h-4" />;
      case 'defeated': return <AlertCircle className="w-4 h-4" />;
      case 'withdrawn': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesSearch = bill.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.longTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bill.summary && bill.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || getBillStatus(bill) === statusFilter;
      const matchesType = typeFilter === 'all' || getBillType(bill) === typeFilter;
      const matchesChamber = chamberFilter === 'all' || 
                            bill.originatingHouse.toLowerCase() === chamberFilter ||
                            bill.currentStage.house.toLowerCase() === chamberFilter;

      return matchesSearch && matchesStatus && matchesType && matchesChamber;
    });
  }, [bills, searchTerm, statusFilter, typeFilter, chamberFilter]);

  const toggleBillExpansion = (billId: number) => {
    setExpandedBills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(billId)) {
        newSet.delete(billId);
      } else {
        newSet.add(billId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusCounts = () => {
    const counts = {
      all: bills.length,
      proposed: 0,
      'in-progress': 0,
      enacted: 0,
      defeated: 0,
      withdrawn: 0
    };

    bills.forEach(bill => {
      const status = getBillStatus(bill);
      counts[status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building className="w-4 h-4" />
            <span>UK Parliament</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            📋 Parliamentary Bill Tracker
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Track the progress of bills through Parliament. Monitor proposed legislation, current debates, and enacted laws.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Refresh */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bills by title or content..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Search bills"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchBills}
                disabled={loading}
                className="uk-gov-button-secondary flex items-center space-x-2 disabled:opacity-50"
                aria-label="Refresh bills data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  autoRefresh 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`${autoRefresh ? 'Disable' : 'Enable'} auto-refresh`}
              >
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BillStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="proposed">Proposed ({statusCounts.proposed})</option>
                <option value="in-progress">In Progress ({statusCounts['in-progress']})</option>
                <option value="enacted">Enacted ({statusCounts.enacted})</option>
                <option value="defeated">Defeated ({statusCounts.defeated})</option>
                <option value="withdrawn">Withdrawn ({statusCounts.withdrawn})</option>
              </select>
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as BillType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="government">Government Bills</option>
                <option value="private-members">Private Members' Bills</option>
                <option value="private">Private Bills</option>
                <option value="hybrid">Hybrid Bills</option>
              </select>
            </div>
            <div>
              <label htmlFor="chamber-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Chamber
              </label>
              <select
                id="chamber-filter"
                value={chamberFilter}
                onChange={(e) => setChamberFilter(e.target.value as Chamber)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Chambers</option>
                <option value="commons">House of Commons</option>
                <option value="lords">House of Lords</option>
              </select>
            </div>
          </div>

          {/* Last Refresh Info */}
          {lastRefresh && (
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastRefresh.toLocaleTimeString('en-GB')}</span>
              {autoRefresh && <span className="text-green-600">(Auto-refresh enabled)</span>}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {!loading && (
          <div className="space-y-4">
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredBills.length} of {bills.length} bills
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Bills List */}
            {filteredBills.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters.' 
                      : 'No bills match the current filters.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBills.map((bill) => {
                const status = getBillStatus(bill);
                const isExpanded = expandedBills.has(bill.billId);
                
                return (
                  <Card key={bill.billId} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Bill Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {bill.shortTitle}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {bill.longTitle}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={`${getStatusColor(status)} border-0 flex items-center space-x-1`}>
                            {getStatusIcon(status)}
                            <span className="capitalize">{status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Bill Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Current Stage:</span>
                          <span className="font-medium">{bill.currentStage.description}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Last Update:</span>
                          <span className="font-medium">{formatDate(bill.lastUpdate)}</span>
                        </div>
                        {bill.agent && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Sponsor:</span>
                            <span className="font-medium">{bill.agent.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleBillExpansion(bill.billId)}
                        className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} bill details`}
                      >
                        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          {/* Summary */}
                          {bill.summary && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                              <p className="text-gray-600 text-sm leading-relaxed">{bill.summary}</p>
                            </div>
                          )}

                          {/* Sponsors */}
                          {bill.sponsors.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Sponsors</h4>
                              <div className="flex flex-wrap gap-2">
                                {bill.sponsors.map((sponsor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {sponsor.member.value.nameDisplayAs} ({sponsor.member.value.party.abbreviation})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Originating House:</span>
                              <span className="ml-2 font-medium">{bill.originatingHouse}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Current House:</span>
                              <span className="ml-2 font-medium">{bill.currentStage.house}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-4 pt-2">
                            <a
                              href={`https://bills.parliament.uk/bills/${bill.billId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View on Parliament.uk</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BillTracker;