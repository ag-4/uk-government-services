import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, ExternalLink, User, Building2, Wifi, WifiOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { apiService, fallbackData, useApiWithFallback, MP as ApiMP } from '../lib/api';

// Use the MP interface from the API
type MP = ApiMP;

const partyColors = {
  'Conservative': 'party-conservative',
  'Labour': 'party-labour',
  'SNP': 'party-snp',
  'Green': 'party-green',
  'Liberal Democrat': 'party-libdem',
};

export default function MPSearch() {
  const [mps, setMps] = useState<MP[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithFallback, isOnline } = useApiWithFallback();

  useEffect(() => {
    fetchMPs();
  }, []);

  const fetchMPs = async () => {
    try {
      const data = await fetchWithFallback(
        () => apiService.getAllMPs(),
        () => fallbackData.mps()
      );
      setMps(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching MPs:', error);
      setError('Failed to load MP data. Please try again later.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchAttempted(true);
    setError(null);
    
    try {
      const results = await fetchWithFallback(
        () => apiService.searchMPs({ q: searchQuery }),
        async () => {
          const allMPs = await fallbackData.mps();
          const query = searchQuery.toLowerCase().trim();
          
          // Load postcode-to-constituency mapping
          let postcodeToConstituency = {};
          try {
            const response = await fetch('/data/postcode-to-constituency.json');
            if (response.ok) {
              postcodeToConstituency = await response.json();
            }
          } catch (e) {
            console.warn('Could not load postcode mapping:', e);
          }
          
          // Function to get MP by postcode using proper lookup
          const getMPByPostcode = (postcode: string): MP | null => {
            // Extract postcode area (e.g., "BS5" from "BS5 1AA" or "EH1" from "EH1 2AB")
            const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
            
            // Try different patterns to extract the postcode area
            let area: string | null = null;
            
            // Pattern 1: Full postcode like "BS51AA" -> extract "BS5"
            const fullMatch = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\d[A-Z]{2}$/);
            if (fullMatch) {
              area = fullMatch[1];
            } else {
              // Pattern 2: Area code only like "BS5"
              const areaMatch = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)$/);
              if (areaMatch) {
                area = areaMatch[1];
              }
            }
            
            if (!area) {
              return null;
            }
            
            // Find constituency for this postcode area
            const constituency = postcodeToConstituency[area];
            if (!constituency) {
              return null;
            }
            
            // Find MP for this constituency
            const mp = allMPs.find(mp => mp.constituency === constituency);
            return mp || null;
          };
          
          // Try postcode-to-constituency lookup first
          const directPostcodeMP = getMPByPostcode(query);
          if (directPostcodeMP) {
            return [directPostcodeMP];
          }
          
          // If no direct postcode match, fall back to general search
          const scoredMPs = allMPs.map(mp => {
            let score = 0;
            let hasMatch = false;
            
            // Check if query matches constituency exactly
            if (mp.constituency && mp.constituency.toLowerCase() === query) {
              score += 200; // Highest priority for exact constituency match
              hasMatch = true;
            }
            
            // Check postcodes (high priority)
            const postcodes = mp.postcodes || [];
            const postcodeMatches = postcodes.filter(pc => 
              pc && pc.toLowerCase().includes(query)
            );
            
            if (postcodeMatches.length > 0) {
              score += 100;
              hasMatch = true;
              
              // Bonus for exact prefix matches
              const exactPrefixMatches = postcodes.filter(pc => 
                pc && pc.toLowerCase().startsWith(query)
              );
              if (exactPrefixMatches.length > 0) {
                score += 50;
              }
            }
            
            // Check other fields (lower priority)
            const otherFields = [
              mp.name,
              mp.displayName,
              mp.constituency,
              mp.party,
              mp.postcode || ''
            ];
            
            otherFields.forEach(field => {
              if (field && field.toLowerCase().includes(query)) {
                score += 10;
                hasMatch = true;
              }
            });
            
            return hasMatch ? { mp, score } : null;
          }).filter(Boolean);
          
          // Sort by score (highest first) and return MPs
          return scoredMPs
            .sort((a, b) => (b?.score || 0) - (a?.score || 0))
            .map(item => item?.mp)
            .filter(Boolean);
        }
      );
      
      if (results.length > 0 && results[0]) {
        setSelectedMP(results[0]);
      } else {
        setSelectedMP(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
      setSelectedMP(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <User className="w-4 h-4" />
            <span>Parliamentary Representatives</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Your Member of Parliament
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your postcode to find your local MP and get their contact information. 
            Connect directly with your representative in Parliament.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="uk-gov-card">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <label htmlFor="postcode" className="text-sm font-medium text-gray-700">
                  Enter your postcode or constituency name
                </label>
              </div>
              
              <div className="flex space-x-3">
                <Input
                  id="postcode"
                  type="text"
                  placeholder="e.g., M1 1AA, Abbott, Westminster, Conservative, or Labour"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-lg"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || loading}
                  className="uk-gov-button"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                Try searching with: M1, B1, EH1, BT1, or MP names like "Abbott", "Johnson", or parties like "Labour", "Conservative"</p>
            </div>
          </div>
        </div>

        {/* Data Source Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Connected - Using live parliamentary data</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-500" />
                <span>Offline mode - Using cached data</span>
              </>
            )}
            <span className="text-gray-400">•</span>
            <span>{mps.length} MPs in database</span>
          </div>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for your MP...</p>
          </div>
        )}

        {selectedMP && !loading && (
          <div className="max-w-4xl mx-auto">
            <MPCard mp={selectedMP} />
          </div>
        )}

        {searchAttempted && !selectedMP && !loading && (
          <div className="text-center py-8">
            <div className="uk-gov-card max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No MP Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find an MP for "{searchQuery}". Please check your postcode or try a different search term.
              </p>
              <p className="text-sm text-gray-500">
                Try using a full UK postcode (e.g., SW1A 0AA) or constituency name.
              </p>
            </div>
          </div>
        )}

        {/* Sample MPs Display */}
        {!searchAttempted && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sample MPs</h3>
              <p className="text-gray-600">Here are some example MPs you can search for:</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mps.slice(0, 6).map((mp) => (
                <SampleMPCard 
                  key={mp.id} 
                  mp={mp} 
                  onSelect={() => {
                    setSelectedMP(mp);
                    setSearchQuery(mp.constituency);
                    setSearchAttempted(true);
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface MPCardProps {
  mp: MP;
}

function MPCard({ mp }: MPCardProps) {
  const partyClass = partyColors[mp.party as keyof typeof partyColors] || 'bg-gray-600 text-white';
  
  // Get the best available image
  const imageUrl = mp.thumbnailUrl || mp.image || '/images/mp-placeholder.jpg';
  
  // Get the best available address
  const address = mp.addresses?.[0]?.fullAddress || mp.address || 'Parliament House, Westminster, London';
  
  // Get display name (prefer displayName, fallback to name)
  const displayName = mp.displayName || mp.name;
  
  // Get biography or create a default one
  const biography = mp.biography || `${displayName} is the MP for ${mp.constituency}, representing the ${mp.party} party.`;

  return (
    <div className="uk-gov-card">
      <div className="grid md:grid-cols-3 gap-6">
        {/* MP Photo and Basic Info */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/mp-placeholder.jpg';
              }}
            />
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${partyClass}`}>
            {mp.party}
          </div>
          
          {/* Active status */}
          {mp.isActive !== undefined && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              mp.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {mp.isActive ? 'Current MP' : 'Former MP'}
            </div>
          )}
        </div>

        {/* MP Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h3>
            {mp.fullTitle && mp.fullTitle !== displayName && (
              <p className="text-lg text-gray-700 mb-2">{mp.fullTitle}</p>
            )}
            <div className="flex items-center space-x-2 text-lg text-gray-600 mb-4">
              <Building2 className="w-5 h-5" />
              <span>MP for {mp.constituency}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{biography}</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${mp.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {mp.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a 
                    href={`tel:${mp.phone}`}
                    className="text-primary hover:underline"
                  >
                    {mp.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-700">{address}</p>
              </div>
            </div>

            {/* Postcodes covered */}
            {mp.postcodes && mp.postcodes.length > 0 && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Sample Postcodes</p>
                  <p className="text-gray-700">{mp.postcodes.slice(0, 5).join(', ')}</p>
                  {mp.postcodes.length > 5 && (
                    <p className="text-xs text-gray-500">and {mp.postcodes.length - 5} more...</p>
                  )}
                </div>
              </div>
            )}

            {mp.website && (
              <div className="pt-4">
                <a 
                  href={mp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
                >
                  <span>Visit official website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SampleMPCardProps {
  mp: MP;
  onSelect: () => void;
}

function SampleMPCard({ mp, onSelect }: SampleMPCardProps) {
  const partyClass = partyColors[mp.party as keyof typeof partyColors] || 'bg-gray-600 text-white';
  
  // Get the best available image
  const imageUrl = mp.thumbnailUrl || mp.image || '/images/mp-placeholder.jpg';
  
  // Get display name (prefer displayName, fallback to name)
  const displayName = mp.displayName || mp.name;

  return (
    <div 
      onClick={onSelect}
      className="uk-gov-card hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mx-auto">
          <img 
            src={imageUrl} 
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/mp-placeholder.jpg';
            }}
          />
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {displayName}
          </h4>
          <p className="text-sm text-gray-600">{mp.constituency}</p>
        </div>
        
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${partyClass}`}>
          {mp.party}
        </div>
        
        {/* Show if active */}
        {mp.isActive !== undefined && (
          <div className={`text-xs ${mp.isActive ? 'text-green-600' : 'text-gray-500'}`}>
            {mp.isActive ? 'Current MP' : 'Former MP'}
          </div>
        )}
      </div>
    </div>
  );
}