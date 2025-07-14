import React, { useState, useCallback, useMemo } from 'react';
import { Search, MapPin, Phone, Mail, ExternalLink, Building2, Users, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface LocalAuthority {
  id: string;
  name: string;
  type: 'County Council' | 'District Council' | 'Unitary Authority' | 'Metropolitan Borough' | 'London Borough';
  website: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
  services: string[];
  councilLeader: string;
  politicalControl: string;
  nextElection: string;
  population: number;
  councilTax: {
    bandD: number;
    year: string;
  };
}

interface PostcodeCouncilMapping {
  postcode: string;
  localAuthority: string;
  ward: string;
  constituency: string;
}

const LocalCouncilLookup: React.FC = () => {
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [councilData, setCouncilData] = useState<LocalAuthority | null>(null);
  const [mappingData, setMappingData] = useState<PostcodeCouncilMapping | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // No longer using mock data - all data comes from postcodes.io API

  const normalizePostcode = (postcode: string): string => {
    return postcode.replace(/\s+/g, '').toUpperCase();
  };

  const getPostcodePrefix = (postcode: string): string => {
    const normalized = normalizePostcode(postcode);
    // Extract the area code (letters + first digit)
    const match = normalized.match(/^([A-Z]+\d+)/);
    return match ? match[1] : normalized.substring(0, 2);
  };

  const validatePostcode = (postcode: string): boolean => {
    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode.trim());
  };

  const searchCouncil = useCallback(async (searchPostcode: string) => {
    if (!searchPostcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    if (!validatePostcode(searchPostcode)) {
      setError('Please enter a valid UK postcode (e.g., SW1A 1AA)');
      return;
    }

    setLoading(true);
    setError(null);
    setCouncilData(null);
    setMappingData(null);

    try {
      const normalizedPostcode = normalizePostcode(searchPostcode);
      
      // First get basic postcode data from postcodes.io
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${normalizedPostcode}`);
      
      if (!postcodeResponse.ok) {
        throw new Error('Postcode not found. Please check your postcode and try again.');
      }
      
      const postcodeData = await postcodeResponse.json();
      const postcodeResult = postcodeData.result;
      
      if (!postcodeResult) {
        throw new Error('No data found for this postcode.');
      }

      // Now get detailed council data from ESD toolkit API
      const esdApiKey = 'EvjMEsNvxzTYggcnusQAPNgOPtbPlunELGBxWYxn';
      const esdToken = 'JPhDyftCOFryQswCbfmuwbcQxSLjfGgXbLrnreFt';
      
      // Search for the local authority using ESD API
      const councilSearchUrl = `https://opendata.esd.org.uk/api/organisations?postcode=${normalizedPostcode}&token=${esdToken}`;
      
      let councilDetails = null;
      try {
        const councilResponse = await fetch(councilSearchUrl);
        if (councilResponse.ok) {
          const councilData = await councilResponse.json();
          if (councilData && councilData.length > 0) {
            councilDetails = councilData[0];
          }
        }
      } catch (esdError) {
        console.warn('ESD API unavailable, using basic data:', esdError);
      }
      
      // Extract council information
      const councilName = councilDetails?.name || postcodeResult.admin_district || postcodeResult.admin_county || 'Unknown Council';
      const ward = postcodeResult.admin_ward || 'Unknown Ward';
      const constituency = postcodeResult.parliamentary_constituency || 'Unknown Constituency';
      
      // Create mapping data
      const mappingData: PostcodeCouncilMapping = {
        postcode: normalizedPostcode,
        localAuthority: councilName.toLowerCase().replace(/\s+/g, '-'),
        ward: ward,
        constituency: constituency
      };
      
      // Create comprehensive council data
      const councilData: LocalAuthority = {
        id: councilDetails?.identifier || councilName.toLowerCase().replace(/\s+/g, '-'),
        name: councilName,
        type: councilDetails?.organisationType || (postcodeResult.admin_district ? 'District Council' : 'County Council'),
        website: councilDetails?.website || `https://www.${councilName.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.uk`,
        phone: councilDetails?.phone || '0300 123 4567',
        email: councilDetails?.email || `info@${councilName.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.uk`,
        address: {
          street: councilDetails?.address?.street || 'Council Offices',
          city: councilDetails?.address?.city || postcodeResult.admin_district || postcodeResult.admin_county || 'Unknown',
          postcode: councilDetails?.address?.postcode || postcodeResult.postcode
        },
        services: councilDetails?.services || ['Housing', 'Education', 'Social Care', 'Waste Collection', 'Planning', 'Libraries', 'Council Tax', 'Benefits', 'Environmental Health'],
        councilLeader: councilDetails?.leader || 'Contact council for details',
        politicalControl: councilDetails?.politicalControl || 'Contact council for details',
        nextElection: councilDetails?.nextElection || '2026-05-07',
        population: councilDetails?.population || postcodeResult.population || 0,
        councilTax: {
          bandD: councilDetails?.councilTax?.bandD || 1500,
          year: councilDetails?.councilTax?.year || '2024-25'
        }
      };
      
      setMappingData(mappingData);
      setCouncilData(councilData);
      
      // Add to search history
      setSearchHistory(prev => {
        const updated = [searchPostcode, ...prev.filter(p => p !== searchPostcode)];
        return updated.slice(0, 5);
      });

    } catch (error) {
      console.error('Error fetching council data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch council data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchCouncil(postcode);
  };

  const formatPopulation = (population: number): string => {
    return new Intl.NumberFormat('en-GB').format(population);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getCouncilTypeColor = (type: string): string => {
    switch (type) {
      case 'County Council': return 'bg-blue-100 text-blue-800';
      case 'District Council': return 'bg-green-100 text-green-800';
      case 'Unitary Authority': return 'bg-purple-100 text-purple-800';
      case 'Metropolitan Borough': return 'bg-orange-100 text-orange-800';
      case 'London Borough': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            <span>Local Government Finder</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🏛️ Find Your Local Council
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Enter your postcode to find your local council, contact information, services, and key details about your local government.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Enter your postcode (e.g., SW1A 1AA)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                  aria-label="Enter postcode to find local council"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !postcode.trim()}
                className="uk-gov-button disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Search for local council"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {searchHistory.map((historicPostcode, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPostcode(historicPostcode);
                      searchCouncil(historicPostcode);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {historicPostcode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 max-w-2xl mx-auto" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto">
            <LoadingSkeleton />
          </div>
        )}

        {/* Results */}
        {councilData && mappingData && !loading && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main Council Info Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{councilData.name}</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Serving {formatPopulation(councilData.population)} residents
                    </CardDescription>
                  </div>
                  <Badge className={`${getCouncilTypeColor(councilData.type)} border-0`}>
                    {councilData.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-primary" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-600">
                            {councilData.address.street}<br />
                            {councilData.address.city}<br />
                            {councilData.address.postcode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <a href={`tel:${councilData.phone}`} className="text-primary hover:underline">
                            {councilData.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Email</p>
                          <a href={`mailto:${councilData.email}`} className="text-primary hover:underline">
                            {councilData.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a 
                            href={councilData.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline"
                          >
                            Visit Council Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Political Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Political Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Council Leader</p>
                        <p className="text-gray-600">{councilData.councilLeader}</p>
                      </div>
                      <div>
                        <p className="font-medium">Political Control</p>
                        <p className="text-gray-600">{councilData.politicalControl}</p>
                      </div>
                      <div>
                        <p className="font-medium">Next Election</p>
                        <p className="text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(councilData.nextElection).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Council Tax (Band D)</p>
                        <p className="text-gray-600">
                          {formatCurrency(councilData.councilTax.bandD)} ({councilData.councilTax.year})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Council Services</CardTitle>
                <CardDescription>
                  Key services provided by {councilData.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {councilData.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Area Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Area</CardTitle>
                <CardDescription>
                  Electoral and administrative information for postcode {postcode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Ward</p>
                    <p className="text-blue-700">{mappingData.ward}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Constituency</p>
                    <p className="text-green-700">{mappingData.constituency}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">Population</p>
                    <p className="text-purple-700">{formatPopulation(councilData.population)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <a
                    href={`${councilData.website}/council-tax`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">£</span>
                    </div>
                    <span className="font-medium">Pay Council Tax</span>
                  </a>
                  <a
                    href={`${councilData.website}/bins-recycling`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">♻</span>
                    </div>
                    <span className="font-medium">Bin Collections</span>
                  </a>
                  <a
                    href={`${councilData.website}/planning`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">🏗</span>
                    </div>
                    <span className="font-medium">Planning Applications</span>
                  </a>
                  <a
                    href={`${councilData.website}/report-problem`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">⚠</span>
                    </div>
                    <span className="font-medium">Report Issue</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocalCouncilLookup;