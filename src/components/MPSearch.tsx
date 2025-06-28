import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, ExternalLink, User, Building2, Wifi, WifiOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';

// Define the MP interface to match our data structure
interface MP {
  id: string;
  name: string;
  party: string;
  constituency: string;
  email?: string;
  phone?: string;
  postcodes?: string[];
  image?: string;
  isActive?: boolean;
  fullTitle?: string;
  addresses?: any[];
  address?: string;
  website?: string;
  socialMedia?: any;
}

const partyColors: { [key: string]: string } = {
  'Conservative': 'bg-blue-700 text-white',
  'Labour': 'bg-red-600 text-white',
  'Liberal Democrat': 'bg-yellow-500 text-white',
  'Green': 'bg-green-600 text-white',
  'Scottish National Party': 'bg-yellow-400 text-white',
  'SNP': 'bg-yellow-400 text-white',
  'Plaid Cymru': 'bg-green-500 text-white',
  'DUP': 'bg-red-700 text-white',
  'Sinn Féin': 'bg-green-700 text-white',
  'SDLP': 'bg-green-600 text-white',
  'Alliance': 'bg-yellow-600 text-white',
  'UUP': 'bg-blue-800 text-white',
  'Independent': 'bg-gray-600 text-white'
};

export function MPSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('postcode');
  const [error, setError] = useState('');
  const [selectedMPId, setSelectedMPId] = useState<string | null>(null);
  const [mps, setMps] = useState<MP[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchResults, setSearchResults] = useState<MP[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [mpLoading, setMpLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Image error handling
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Load MPs data on component mount
  useEffect(() => {
    loadMPs();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load MP details when selectedMPId changes
  useEffect(() => {
    if (selectedMPId) {
      const mp = mps.find(m => m.id === selectedMPId);
      if (mp) {
        setSelectedMP(mp);
      }
    }
  }, [selectedMPId, mps]);

  const loadMPs = async () => {
    try {
      const response = await fetch('/data/mps.json');
      const data = await response.json();
      setMps(data);
    } catch (err) {
      console.error('Error loading MPs:', err);
      setError('Failed to load MP data');
    }
  };

  const searchMPs = async (query: string): Promise<MP[]> => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    
    // If it looks like a postcode, try postcode lookup first
    if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(normalizedQuery)) {
      return await searchByPostcode(normalizedQuery);
    }
    
    // If it looks like a postcode area (e.g., "SW1", "E1"), search by area
    if (/^[A-Z]{1,2}[0-9]{1,2}$/i.test(normalizedQuery)) {
      return await searchByPostcodeArea(normalizedQuery);
    }

    // Search by name, party, or constituency
    return mps.filter(mp => 
      mp.name.toLowerCase().includes(normalizedQuery) ||
      mp.party.toLowerCase().includes(normalizedQuery) ||
      mp.constituency.toLowerCase().includes(normalizedQuery)
    );
  };

  const searchByPostcode = async (postcode: string): Promise<MP[]> => {
    try {
      // Load postcode to constituency mapping
      const response = await fetch('/data/postcode-to-constituency.json');
      const postcodeMapping = await response.json();
      
      // Normalize postcode (remove spaces, uppercase)
      const normalizedPostcode = postcode.replace(/\s/g, '').toUpperCase();
      
      // Extract postcode area (first part before digits)
      const postcodeArea = normalizedPostcode.match(/^([A-Z]{1,2})/)?.[1];
      
      if (postcodeArea && postcodeMapping[postcodeArea]) {
        const constituency = postcodeMapping[postcodeArea];
        return mps.filter(mp => mp.constituency === constituency);
      }
      
      return [];
    } catch (err) {
      console.error('Error searching by postcode:', err);
      return [];
    }
  };

  const searchByPostcodeArea = async (area: string): Promise<MP[]> => {
    try {
      const response = await fetch('/data/postcode-to-constituency.json');
      const postcodeMapping = await response.json();
      
      const normalizedArea = area.toUpperCase();
      
      if (postcodeMapping[normalizedArea]) {
        const constituency = postcodeMapping[normalizedArea];
        return mps.filter(mp => mp.constituency === constituency);
      }
      
      return [];
    } catch (err) {
      console.error('Error searching by postcode area:', err);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setError('');
    setSearchAttempted(true);

    try {
      const results = await searchMPs(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No MPs found for your search. Please try a different postcode or search term.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err as Error);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectMP = (mp: MP) => {
    setSelectedMPId(mp.id);
    setSelectedMP(mp);
  };

  const handleImageError = (mpId: string) => {
    setImageErrors(prev => new Set(prev).add(mpId));
  };

  const getImageUrl = (mp: MP) => {
    if (imageErrors.has(mp.id)) {
      // Return party logo or placeholder if main image failed
      const partyLogos: { [key: string]: string } = {
        'Conservative': '/images/conservative-logo.jpeg',
        'Labour': '/images/labour-logo.png',
        'Liberal Democrat': '/images/lib-dem-logo.png',
        'Green': '/images/green-logo.png',
        'SNP': '/images/snp-logo.png',
        'Scottish National Party': '/images/snp-logo.png'
      };
      return partyLogos[mp.party] || '/images/mp-placeholder.jpg';
    }
    return mp.image || '/images/mp-placeholder.jpg';
  };

  const renderMPCard = (mp: MP) => (
    <Card key={mp.id} className="hover:shadow-lg transition-shadow cursor-pointer mb-4" onClick={() => handleSelectMP(mp)}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <img
              src={getImageUrl(mp)}
              alt={mp.name}
              className="h-full w-full object-cover"
              onError={() => handleImageError(mp.id)}
            />
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{mp.name}</CardTitle>
            <CardDescription className="text-lg">{mp.constituency}</CardDescription>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
              partyColors[mp.party] || 'bg-gray-600 text-white'
            }`}>
              {mp.party}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  const renderSelectedMP = (mp: MP) => (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <img
              src={getImageUrl(mp)}
              alt={mp.name}
              className="h-full w-full object-cover"
              onError={() => handleImageError(mp.id)}
            />
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{mp.name}</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              Member of Parliament for {mp.constituency}
            </CardDescription>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mt-3 ${
              partyColors[mp.party] || 'bg-gray-600 text-white'
            }`}>
              {mp.party}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </h4>
            <div className="space-y-2">
              {mp.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${mp.email}`} className="text-blue-600 hover:underline">
                    {mp.email}
                  </a>
                </div>
              )}
              {mp.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${mp.phone}`} className="text-blue-600 hover:underline">
                    {mp.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Parliamentary Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{mp.constituency}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{mp.party}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Find Your Member of Parliament
        </h1>
        <p className="text-xl text-gray-600">
          Search by postcode, name, party, or constituency
        </p>
        {!isOnline && (
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
            <WifiOff className="h-5 w-5" />
            <span>You're offline. Showing cached data.</span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <Tabs value={searchTab} onValueChange={setSearchTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="postcode">Postcode</TabsTrigger>
            <TabsTrigger value="name">MP Name</TabsTrigger>
            <TabsTrigger value="party">Party</TabsTrigger>
            <TabsTrigger value="constituency">Constituency</TabsTrigger>
          </TabsList>

          <TabsContent value="postcode" className="mt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your postcode (e.g., SW1A 0AA)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="name" className="mt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter MP name (e.g., Boris Johnson)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="party" className="mt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter party name (e.g., Conservative, Labour)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="constituency" className="mt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter constituency name (e.g., Cities of London and Westminster)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {searchAttempted && searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Search Results ({searchResults.length} found)
          </h2>
          <div className="space-y-4">
            {searchResults.map(renderMPCard)}
          </div>
        </div>
      )}

      {selectedMP && renderSelectedMP(selectedMP)}

      {searchAttempted && searchResults.length === 0 && !error && !searchLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No MPs found for "{searchQuery}". Please try a different search term.
          </div>
        </div>
      )}
    </div>
  );
}

export default MPSearch;
