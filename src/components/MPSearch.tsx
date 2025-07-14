import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Search, MapPin, Phone, Mail, ExternalLink, User, Building2, Wifi, WifiOff, Bookmark, BookmarkCheck } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { bookmarkItem, unbookmarkItem, database, trackAction } from '../services/database';
import { apiService, fallbackData } from '../lib/api';
import type { MP } from '../lib/api';

// MP interface is now imported from api.ts

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
  const [bookmarkedMPs, setBookmarkedMPs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const resultsPerPage = 10;

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

    // Load bookmarked MPs from database
    loadBookmarkedMPs();

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

  const loadBookmarkedMPs = async () => {
    try {
      const bookmarks = await database.getBookmarks();
      const mpBookmarks = bookmarks.filter(b => b.type === 'mp').map(b => b.itemId);
      setBookmarkedMPs(new Set(mpBookmarks));
    } catch (error) {
      console.error('Error loading bookmarked MPs:', error);
    }
  };

  const handleBookmarkMP = async (mp: MP) => {
    try {
      if (bookmarkedMPs.has(mp.id)) {
        // Remove bookmark
        const bookmarks = await database.getBookmarks();
        const bookmark = bookmarks.find(b => b.type === 'mp' && b.itemId === mp.id);
        if (bookmark) {
          await unbookmarkItem(bookmark.id);
          setBookmarkedMPs(prev => {
            const newSet = new Set(prev);
            newSet.delete(mp.id);
            return newSet;
          });
          await trackAction('mp_unbookmarked', { mpId: mp.id, mpName: mp.name });
        }
      } else {
        // Add bookmark
        await bookmarkItem('mp', mp.id, mp.name, `${mp.party} MP for ${mp.constituency}`);
        setBookmarkedMPs(prev => new Set([...prev, mp.id]));
        await trackAction('mp_bookmarked', { mpId: mp.id, mpName: mp.name });
      }
    } catch (error) {
      console.error('Error toggling MP bookmark:', error);
    }
  };

  const loadMPs = async () => {
    try {
      // Use the new API service to get all MPs
      const allMPs = await apiService.getAllMPs();
      setMps(allMPs);
      console.log(`Successfully loaded ${allMPs.length} MPs from API service`);
    } catch (err) {
      console.error('Error loading MPs from API service:', err);
      try {
        // Fallback to fallback data
        const fallbackMPs = await fallbackData.mps();
        setMps(fallbackMPs);
        console.log(`Loaded ${fallbackMPs.length} MPs from fallback data`);
      } catch (fallbackErr) {
        console.error('Error loading fallback MP data:', fallbackErr);
        setError('Unable to load MP data. Please check your internet connection and try again later.');
      }
    }
  };

  const searchMPs = async (query: string): Promise<MP[]> => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    
    try {
      // Use the new API service search methods
      if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(normalizedQuery)) {
        // Postcode search
        return await apiService.getMPByPostcode(normalizedQuery);
      }
      
      // General search by name, party, or constituency
      const searchParams: any = {};
      
      if (searchTab === 'postcode') {
        searchParams.postcode = query;
      } else if (searchTab === 'name') {
        searchParams.search = query;
      } else if (searchTab === 'party') {
        searchParams.party = query;
      } else if (searchTab === 'constituency') {
        searchParams.constituency = query;
      } else {
        searchParams.search = query;
      }
      
      return await apiService.searchMPs(searchParams);
    } catch (err) {
      console.error('API search failed, falling back to local search:', err);
      
      // Fallback to local search if API fails
      if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(normalizedQuery)) {
        return await searchByPostcode(normalizedQuery);
      }
      
      return mps.filter(mp => 
        mp.name.toLowerCase().includes(normalizedQuery) ||
        mp.party.toLowerCase().includes(normalizedQuery) ||
        mp.constituency.toLowerCase().includes(normalizedQuery)
      );
    }
  };

  const searchByPostcode = async (postcode: string): Promise<MP[]> => {
    try {
      // Clean postcode
      const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
      
      // Try API service first
      try {
        return await apiService.getMPByPostcode(normalizedPostcode);
      } catch (apiError) {
        console.warn('API postcode search failed, falling back to local approach:', apiError);
      }
      
      // Fallback to postcodes.io + local MP matching
      const pcResponse = await fetch(`https://api.postcodes.io/postcodes/${normalizedPostcode}`);
      const pcJson = await pcResponse.json();
      
      if (!pcJson.result) {
        throw new Error('Invalid postcode');
      }
      
      const constituency = pcJson.result.parliamentary_constituency;
      const adminDistrict = pcJson.result.admin_district;
      
      // Enhanced constituency matching with loaded MPs
      if (constituency) {
        // First try exact constituency match from loaded MPs
        let foundMPs = mps.filter(mp => 
          mp.constituency.toLowerCase() === constituency.toLowerCase()
        );
        
        // If no exact match, try partial match
        if (foundMPs.length === 0) {
          foundMPs = mps.filter(mp => 
            mp.constituency.toLowerCase().includes(constituency.toLowerCase()) ||
            constituency.toLowerCase().includes(mp.constituency.toLowerCase())
          );
        }
        
        // If still no match, try to find by admin district
        if (foundMPs.length === 0 && adminDistrict) {
          foundMPs = mps.filter(mp => 
            mp.constituency.toLowerCase().includes(adminDistrict.toLowerCase()) ||
            adminDistrict.toLowerCase().includes(mp.constituency.toLowerCase())
          );
        }
        
        if (foundMPs.length > 0) {
          return foundMPs;
        }
      }
      
      // Final fallback: search by postcode area
      const postcodeArea = normalizedPostcode.match(/^([A-Z]{1,2})/)?.[1];
      if (postcodeArea) {
        return mps.filter(mp => 
          mp.postcodes?.some(p => p.startsWith(postcodeArea)) ||
          mp.constituency.toLowerCase().includes(postcodeArea.toLowerCase())
        );
      }
      
      return [];
    } catch (err) {
      console.error('Error searching by postcode:', err);
      return [];
    }
  };

  const searchByPostcodeArea = async (area: string): Promise<MP[]> => {
    try {
      const normalizedArea = area.toUpperCase();
      
      // Search MPs by postcode area pattern
      return mps.filter(mp => 
        mp.postcodes?.some(p => p.startsWith(normalizedArea)) ||
        mp.constituency.toLowerCase().includes(normalizedArea.toLowerCase())
      );
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
        // Enhanced error message with suggestions
        if (/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(searchQuery)) {
          setError('No MPs found for this postcode. Please check the postcode is correct (e.g., SW1A 1AA) or try searching by constituency name.');
        } else {
          setError('No MPs found for your search. Try searching by:\n• Full postcode (e.g., SW1A 1AA)\n• Constituency name (e.g., Westminster)\n• MP name (e.g., John Smith)\n• Political party (e.g., Conservative)');
        }
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



  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return searchResults.slice(startIndex, startIndex + resultsPerPage);
  }, [searchResults, currentPage, resultsPerPage]);

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

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
    return mp.thumbnailUrl || mp.image || '/images/mp-placeholder.jpg';
  };

  const renderMPCard = (mp: MP) => (
    <Card key={mp.id} className="hover:shadow-lg transition-shadow mb-4 group" role="article" aria-labelledby={`mp-${mp.id}-name`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <img
              src={getImageUrl(mp)}
              alt={`Portrait of ${mp.name}, MP for ${mp.constituency}`}
              className="h-full w-full object-cover"
              onError={() => handleImageError(mp.id)}
            />
          </Avatar>
          <div className="flex-1">
            <CardTitle id={`mp-${mp.id}-name`} className="text-xl">{mp.name}</CardTitle>
            <CardDescription className="text-lg">{mp.constituency}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={partyColors[mp.party] || 'bg-gray-600 text-white'}>
                {mp.party}
              </Badge>
              {bookmarkedMPs.has(mp.id) && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  <BookmarkCheck className="h-3 w-3 mr-1" />
                  Bookmarked
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkMP(mp);
              }}
              aria-label={bookmarkedMPs.has(mp.id) ? `Remove ${mp.name} from bookmarks` : `Add ${mp.name} to bookmarks`}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {bookmarkedMPs.has(mp.id) ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSelectMP(mp)}
              aria-label={`View details for ${mp.name}`}
            >
              View Details
            </Button>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Search Results ({searchResults.length} found)
            </h2>
            {searchResults.length > resultsPerPage && (
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * resultsPerPage) + 1}-{Math.min(currentPage * resultsPerPage, searchResults.length)} of {searchResults.length}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {paginatedResults.map(renderMPCard)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          )}
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
