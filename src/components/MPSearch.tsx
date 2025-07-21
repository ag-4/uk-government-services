import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Globe, Twitter, User, Building, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MPMap from './MPMap';
import { MPImageService } from '@/services/mp-image-service';
import { MPLookupService } from '../services/mp-lookup-service';

interface MP {
  id: number;
  name: string;
  party: string;
  constituency: string;
  email: string;
  phone: string;
  website: string;
  office_address: string;
  postcode: string;
  twitter_handle: string;
  image_url?: string;
  parliament_id?: number;
  created_at: string;
}



interface PostcodeMapping {
  postcode: string;
  constituency: string;
  mp: string;
  party: string;
}

export default function MPSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [searchResults, setSearchResults] = useState<MP[]>([]);
  const [allMPs, setAllMPs] = useState<MP[]>([]);
  const [postcodeData, setPostcodeData] = useState<PostcodeMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<'postcode' | 'name' | 'constituency' | 'party'>('postcode');
  const [activeTab, setActiveTab] = useState<'search' | 'map'>('search');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load MP database and comprehensive postcode mapping
      const [mpsResponse, postcodeResponse] = await Promise.all([
        fetch('/data/uk-government-database.json'),
        fetch('/data/postcode-to-mp-complete.json')
      ]);
      
      const mpsData = await mpsResponse.json();
      const postcodeMapping = await postcodeResponse.json();
      
      // Extract MPs from the complete database structure
      const mps = mpsData.mps || mpsData;
      setAllMPs(mps);
      setPostcodeData(postcodeMapping);
      
      // Debug: Check if Carla Denyer is loaded with real postcodes
      const carlaDenyer = mps.find((mp: MP) => mp.name === 'Carla Denyer');
      if (carlaDenyer) {
        console.log('✅ Carla Denyer found in loaded data:', carlaDenyer);
        console.log('📮 Her postcodes:', carlaDenyer.constituencyPostcodes);
        console.log('🔍 Has BS5 9AU?', carlaDenyer.constituencyPostcodes?.includes('BS5 9AU'));
      } else {
        console.log('❌ Carla Denyer not found in loaded data');
      }
      
      console.log('📊 Total MPs loaded:', mps.length);
      console.log('📮 Total postcodes loaded:', postcodeMapping.length);
      console.log('🔍 First MP sample:', mps[0]);
      
      // Show some sample MPs initially
      setSearchResults(mps.slice(0, 6));
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback: create postcode data from MP constituency postcodes
      const fallbackPostcodeData: PostcodeMapping[] = [];
      allMPs.forEach(mp => {
        if (mp.constituencyPostcodes && Array.isArray(mp.constituencyPostcodes)) {
          mp.constituencyPostcodes.forEach(postcode => {
            fallbackPostcodeData.push({
              postcode,
              constituency: mp.constituency,
              mp: mp.name,
              party: mp.party
            });
          });
        }
      });
      setPostcodeData(fallbackPostcodeData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    console.log('🔍 Search initiated:', { searchTerm, searchType });
    console.log('📊 Data available:', { 
      allMPs: allMPs.length
    });

    if (!searchTerm.trim()) {
      setSearchResults(allMPs.slice(0, 6));
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    let results: MP[] = [];

    if (searchType === 'postcode') {
      console.log('🏠 Searching for postcode via API:', term);
      setIsLoading(true);
      
      try {
        // Use API-based lookup for postcodes
        const apiResult = await MPLookupService.lookupByPostcode(term);
        
        if (apiResult.success && apiResult.mp) {
          console.log('✅ API found MP:', apiResult.mp);
          
          // Try to find this MP in our local database for additional info
          const localMP = allMPs.find(mp => 
            mp.name.toLowerCase().includes(apiResult.mp!.name.toLowerCase()) ||
            mp.constituency.toLowerCase().includes(apiResult.mp!.constituency.toLowerCase())
          );
          
          if (localMP) {
            console.log('✅ Found matching local MP:', localMP.name);
            results = [localMP];
          } else {
            console.log('⚠️ Creating temporary MP from API data');
            // Create a temporary MP object from API data
            const tempMP: MP = {
              id: Date.now(), // Temporary ID
              name: apiResult.mp.name,
              constituency: apiResult.mp.constituency,
              party: apiResult.mp.party,
              email: '',
              phone: '',
              address: '',
              website: '',
              twitter: '',
              facebook: '',
              instagram: '',
              linkedin: '',
              youtube: '',
              constituencyPostcodes: [term.toUpperCase()]
            };
            results = [tempMP];
          }
        } else {
          console.log('❌ API lookup failed, falling back to local search');
          // Fallback to local search
          const normalizedTerm = term.replace(/\s/g, '').toUpperCase();
          results = allMPs.filter(mp => {
            if (!mp.constituencyPostcodes || !Array.isArray(mp.constituencyPostcodes)) {
              return false;
            }
            
            return mp.constituencyPostcodes.some(postcode => {
              const normalizedPostcode = postcode.replace(/\s/g, '').toUpperCase();
              return normalizedPostcode === normalizedTerm || 
                     normalizedPostcode.includes(normalizedTerm) ||
                     postcode.toLowerCase().includes(term.toLowerCase());
            });
          });
        }
      } catch (error) {
        console.error('❌ API lookup error:', error);
        // Fallback to local search on error
        const normalizedTerm = term.replace(/\s/g, '').toUpperCase();
        results = allMPs.filter(mp => {
          if (!mp.constituencyPostcodes || !Array.isArray(mp.constituencyPostcodes)) {
            return false;
          }
          
          return mp.constituencyPostcodes.some(postcode => {
            const normalizedPostcode = postcode.replace(/\s/g, '').toUpperCase();
            return normalizedPostcode === normalizedTerm || 
                   normalizedPostcode.includes(normalizedTerm) ||
                   postcode.toLowerCase().includes(term.toLowerCase());
          });
        });
      } finally {
        setIsLoading(false);
      }
    } else if (searchType === 'name') {
      results = allMPs.filter(mp => 
        mp.name.toLowerCase().includes(term)
      );
    } else if (searchType === 'constituency') {
      results = allMPs.filter(mp => 
        mp.constituency.toLowerCase().includes(term)
      );
    } else if (searchType === 'party') {
      results = allMPs.filter(mp => 
        mp.party.toLowerCase().includes(term)
      );
    }

    console.log('📋 Final search results:', results.length);
    setSearchResults(results.slice(0, 20)); // Limit results
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      'Conservative': 'bg-blue-600',
      'Labour': 'bg-red-600',
      'Liberal Democrat': 'bg-orange-500',
      'Scottish National Party': 'bg-yellow-500',
      'Green': 'bg-green-600',
      'Democratic Unionist Party': 'bg-purple-600',
      'Sinn Féin': 'bg-green-700',
      'Plaid Cymru': 'bg-green-500',
      'Independent': 'bg-gray-600'
    };
    return colors[party] || 'bg-gray-500';
  };

  const formatPhoneNumber = (phone: string) => {
    // Format UK phone numbers
    if (phone.startsWith('020')) {
      return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
    } else if (phone.startsWith('01') || phone.startsWith('02')) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
  };

  const getConstituencyPostcodes = (mpId: number) => {
    const mp = allMPs.find(mp => mp.id === mpId);
    if (!mp || !mp.constituencyPostcodes || !Array.isArray(mp.constituencyPostcodes)) {
      return [];
    }
    
    return mp.constituencyPostcodes.slice(0, 5); // Show first 5 postcodes as examples
  };

  const MPImage = ({ mp, size = 'md' }: { mp: MP; size?: 'sm' | 'md' | 'lg' }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    const sizeClasses = {
      sm: 'w-12 h-12 text-sm',
      md: 'w-16 h-16 text-lg',
      lg: 'w-24 h-24 text-2xl'
    };
    
    const initials = mp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const imageUrl = MPImageService.getImageUrl(mp);
    const hasRealPhoto = MPImageService.hasRealPhoto(mp);
    
    const handleImageLoad = () => {
      console.log(`✅ Image loaded successfully for ${mp.name}: ${imageUrl}`);
      setImageLoading(false);
      setImageError(false);
    };
    
    const handleImageError = () => {
      console.log(`❌ Image failed to load for ${mp.name}: ${imageUrl}`);
      setImageLoading(false);
      setImageError(true);
    };
    
    // Show initials if no real photo or image error
    if (!hasRealPhoto || imageError) {
      return (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold`}>
          {initials}
        </div>
      );
    }
    
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200`}>
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        )}
        <img
          src={imageUrl}
          alt={mp.name}
          className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MP data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your MP</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Search for your Member of Parliament by postcode, name, constituency, or political party
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <Button
                variant={activeTab === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('search')}
                className="mr-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Search MPs
              </Button>
              <Button
                variant={activeTab === 'map' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('map')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Interactive Map
              </Button>
            </div>
          </div>

          {/* Search Tab Content */}
          {activeTab === 'search' && (
            <>
              {/* Search Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search for Your MP
                  </CardTitle>
                  <CardDescription>
                    Enter your postcode, MP name, constituency, or party to find your representative
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search Type Selector */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'postcode', label: 'Postcode', icon: MapPin },
                        { key: 'name', label: 'MP Name', icon: User },
                        { key: 'constituency', label: 'Constituency', icon: Building },
                        { key: 'party', label: 'Political Party', icon: Calendar }
                      ].map(({ key, label, icon: Icon }) => (
                        <Button
                          key={key}
                          variant={searchType === key ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSearchType(key as any)}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={
                          searchType === 'postcode' ? 'e.g., SW1A 1AA' :
                          searchType === 'name' ? 'e.g., Boris Johnson' :
                          searchType === 'constituency' ? 'e.g., Uxbridge' :
                          'e.g., Conservative'
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Map Tab Content */}
          {activeTab === 'map' && (
            <MPMap 
              selectedMP={selectedMP}
              postcodeData={postcodeData}
              allMPs={allMPs}
              onMPSelect={setSelectedMP}
            />
          )}

          {/* Results Section - Only show on search tab */}
          {activeTab === 'search' && searchResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? `Search Results (${searchResults.length})` : 'Sample MPs'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((mp) => (
                  <Card 
                    key={mp.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200"
                    onClick={() => setSelectedMP(mp)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <MPImage mp={mp} size="md" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{mp.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{mp.constituency}</p>
                          <Badge 
                            className={`${getPartyColor(mp.party)} text-white text-xs mt-2`}
                          >
                            {mp.party}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results - Only show on search tab */}
          {activeTab === 'search' && searchTerm && searchResults.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  No MPs found for "{searchTerm}". Please try a different search term.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Try searching for:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>A full postcode (e.g., "SW1A 1AA")</li>
                    <li>An MP's name (e.g., "Boris Johnson")</li>
                    <li>A constituency (e.g., "Westminster")</li>
                    <li>A political party (e.g., "Conservative")</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected MP Details */}
          {selectedMP && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <MPImage mp={selectedMP} size="lg" />
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{selectedMP.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      MP for {selectedMP.constituency}
                    </CardDescription>
                    <Badge 
                      className={`${getPartyColor(selectedMP.party)} text-white mt-3`}
                    >
                      {selectedMP.party}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedMP.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <a 
                            href={`mailto:${selectedMP.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedMP.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedMP.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <a 
                            href={`tel:${selectedMP.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {formatPhoneNumber(selectedMP.phone)}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedMP.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a 
                            href={selectedMP.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedMP.twitter_handle && (
                      <div className="flex items-center gap-3">
                        <Twitter className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Twitter</p>
                          <a 
                            href={`https://twitter.com/${selectedMP.twitter_handle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedMP.twitter_handle}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Office Address */}
                {selectedMP.office_address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-gray-700">{selectedMP.office_address}</p>
                        {selectedMP.postcode && (
                          <p className="text-gray-600 text-sm mt-1">{selectedMP.postcode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sample Postcodes */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sample Postcodes in Constituency</h3>
                  <div className="flex flex-wrap gap-2">
                    {getConstituencyPostcodes(selectedMP.id).map((postcode, index) => (
                      <Badge key={index} variant="outline">
                        {postcode}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => setSelectedMP(null)}
                    variant="outline"
                  >
                    Back to Search
                  </Button>
                  <Button 
                    onClick={() => window.open(`mailto:${selectedMP.email}`, '_blank')}
                    disabled={!selectedMP.email}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Data Source Info */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Offline Mode</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Data loaded from local database with {allMPs.length} MPs and {allMPs.reduce((total, mp) => total + (mp.constituencyPostcodes?.length || 0), 0).toLocaleString()} postcodes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}