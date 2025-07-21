import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, RefreshCw, ExternalLink, Calendar, User, Building, ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { apiService, fallbackData } from '../lib/api';
import type { Bill } from '../lib/api';

// Using Bill interface from api.ts

type BillStatus = 'all' | 'proposed' | 'in-progress' | 'enacted' | 'defeated' | 'withdrawn';
type BillType = 'all' | 'government' | 'private-members' | 'private' | 'hybrid';
type Chamber = 'all' | 'commons' | 'lords';

const BillTracker: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus>('all');
  const [typeFilter, setTypeFilter] = useState<BillType>('all');
  const [chamberFilter, setChamberFilter] = useState<Chamber>('all');
  const [expandedBills, setExpandedBills] = useState<Set<number>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);



  const generateAIEnhancedBills = async (): Promise<Bill[]> => {
    try {
      // Generate fallback bills directly
      console.log('Generating fallback bill data');
    } catch (error) {
      console.error('Error generating bills:', error);
    }
    
    // Return empty array, will fall back to other sources
    return [];
  };

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let billsData: Bill[] = [];
      
      try {
        // First try the real Parliamentary Bills API
        const billsApiUrl = 'https://bills-api.parliament.uk/api/v1/Bills';
        const response = await fetch(`${billsApiUrl}?take=20&skip=0`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            billsData = data.items.map((item: any) => ({
              id: `bill-${item.billId}`,
              billId: item.billId.toString(),
              title: item.shortTitle || item.longTitle,
              longTitle: item.longTitle,
              summary: item.summary || item.longTitle,
              description: item.summary || item.longTitle,
              status: item.currentStage?.description || 'Unknown',
              stage: item.currentStage?.description || 'Unknown',
              currentHouse: item.currentStage?.house || 'House of Commons',
              house: item.currentStage?.house || 'House of Commons',
              introducedDate: item.introducedDate,
              lastUpdated: item.lastUpdate,
              lastUpdate: item.lastUpdate,
              sponsor: item.sponsor?.name || item.promoter?.name || 'Unknown',
              promoter: item.promoter?.name || 'Unknown',
              type: item.billType?.name || 'Government Bill',
              category: 'Parliamentary Bill',
              url: `https://bills.parliament.uk/bills/${item.billId}`,
              parliamentUrl: `https://bills.parliament.uk/bills/${item.billId}`,
              sessions: item.sessions || []
            }));
            console.log(`Successfully fetched ${billsData.length} bills from Parliamentary API`);
          }
        }
      } catch (apiError) {
        console.warn('Parliamentary Bills API failed, trying fallback:', apiError);
      }
      
      // If Parliamentary API failed, try our API service
      if (billsData.length === 0) {
        try {
          billsData = await apiService.getCurrentBills({ limit: 20 });
          if (billsData && billsData.length > 0) {
            console.log(`Successfully fetched ${billsData.length} bills from API service`);
          }
        } catch (apiError) {
          console.warn('API service failed, trying AI-enhanced bills:', apiError);
        }
      }
      
      // If still no data, try AI enhancement
      if (billsData.length === 0) {
        try {
          billsData = await generateAIEnhancedBills();
          if (billsData.length > 0) {
            console.log(`Successfully generated ${billsData.length} AI-enhanced bills`);
          }
        } catch (aiError) {
          console.warn('AI bill generation failed, trying fallback data:', aiError);
        }
      }
      
      // Final fallback to static data
      if (billsData.length === 0) {
        try {
          const fallbackBills = await fallbackData.bills();
          billsData = fallbackBills;
          console.log(`Loaded ${fallbackBills.length} bills from fallback data`);
        } catch (fallbackError) {
          console.error('All sources failed:', fallbackError);
          setError('Failed to fetch bills data from all sources.');
          billsData = [];
        }
      }
      
      setBills(billsData);
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Error in fetchBills:', error);
      setError('Failed to fetch bills data. Please try again.');
      setBills([]);
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
    if (bill.status) {
      const status = bill.status.toLowerCase();
      if (status.includes('withdrawn')) return 'withdrawn';
      if (status.includes('defeated') || status.includes('rejected')) return 'defeated';
      if (status.includes('royal assent') || status.includes('enacted')) return 'enacted';
      if (status.includes('first reading') || status.includes('introduced')) return 'proposed';
      return 'in-progress';
    }
    // Fallback to stage-based detection
    if (bill.stage) {
      const stage = bill.stage.toLowerCase();
      if (stage.includes('royal assent')) return 'enacted';
      if (stage.includes('first reading')) return 'proposed';
      return 'in-progress';
    }
    return 'in-progress';
  };

  const getBillType = (bill: Bill): BillType => {
    if (bill.type) {
      const type = bill.type.toLowerCase();
      if (type.includes('government')) return 'government';
      if (type.includes('private member')) return 'private-members';
      if (type.includes('private')) return 'private';
      if (type.includes('hybrid')) return 'hybrid';
    }
    // Default to government if no type specified
    return 'government';
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
      const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bill.description && bill.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (bill.summary && bill.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || getBillStatus(bill) === statusFilter;
      const matchesType = typeFilter === 'all' || getBillType(bill) === typeFilter;
      const matchesChamber = chamberFilter === 'all' || 
                            (bill.house && bill.house.toLowerCase().includes(chamberFilter));

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
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
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
              filteredBills.map((bill, index) => {
                const status = getBillStatus(bill);
                const billKey = bill.id || bill.billId || index;
                const isExpanded = expandedBills.has(billKey);
                
                return (
                  <Card key={bill.id || bill.billId || index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Bill Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {bill.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {bill.description || bill.summary || 'No description available'}
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
                          <span className="font-medium">{bill.stage || bill.status || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Last Update:</span>
                          <span className="font-medium">{formatDate(bill.lastUpdate || bill.date || new Date().toISOString())}</span>
                        </div>
                        {bill.sponsor && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Sponsor:</span>
                            <span className="font-medium">{bill.sponsor}</span>
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleBillExpansion(bill.id || bill.billId || index)}
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

                          {/* Sponsor */}
                          {bill.sponsor && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Sponsor</h4>
                              <Badge variant="outline" className="text-xs">
                                {bill.sponsor}
                              </Badge>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {bill.house && (
                              <div>
                                <span className="text-gray-600">House:</span>
                                <span className="ml-2 font-medium">{bill.house}</span>
                              </div>
                            )}
                            {bill.type && (
                              <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="ml-2 font-medium">{bill.type}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-4 pt-2">
                            {bill.url ? (
                              <a
                                href={bill.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>View Details</span>
                              </a>
                            ) : (
                              <a
                                href={`https://bills.parliament.uk/bills/${bill.id || bill.billId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>View on Parliament.uk</span>
                              </a>
                            )}
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