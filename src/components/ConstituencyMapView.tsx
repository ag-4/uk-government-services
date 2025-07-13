import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, MapPin, User, Phone, Mail, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Info, Filter, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface Constituency {
  id: string;
  name: string;
  mp: {
    name: string;
    party: string;
    partyColor: string;
    email?: string;
    phone?: string;
    website?: string;
    majority?: number;
    firstElected?: string;
  };
  region: string;
  population: number;
  area: number; // in square kilometers
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaries?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

interface MapViewport {
  center: [number, number];
  zoom: number;
}

type PartyFilter = 'all' | 'conservative' | 'labour' | 'liberal-democrat' | 'snp' | 'other';
type RegionFilter = 'all' | 'england' | 'scotland' | 'wales' | 'northern-ireland';

const ConstituencyMapView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null);
  const [hoveredConstituency, setHoveredConstituency] = useState<Constituency | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [partyFilter, setPartyFilter] = useState<PartyFilter>('all');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-2.5, 54.5], // UK center
    zoom: 1
  });
  const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 600 });

  // Mock constituency data - in production, this would come from GeoJSON and MP data APIs
  const mockConstituencies: Constituency[] = [
    {
      id: 'birmingham-ladywood',
      name: 'Birmingham Ladywood',
      mp: {
        name: 'Shabana Mahmood',
        party: 'Labour',
        partyColor: '#E4003B',
        email: 'shabana.mahmood.mp@parliament.uk',
        majority: 28582,
        firstElected: '2010'
      },
      region: 'England',
      population: 73635,
      area: 23.4,
      coordinates: { lat: 52.4862, lng: -1.9090 }
    },
    {
      id: 'cities-of-london-and-westminster',
      name: 'Cities of London and Westminster',
      mp: {
        name: 'Nickie Aiken',
        party: 'Conservative',
        partyColor: '#0087DC',
        email: 'nickie.aiken.mp@parliament.uk',
        majority: 3953,
        firstElected: '2019'
      },
      region: 'England',
      population: 68573,
      area: 12.8,
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
      id: 'manchester-central',
      name: 'Manchester Central',
      mp: {
        name: 'Lucy Powell',
        party: 'Labour',
        partyColor: '#E4003B',
        email: 'lucy.powell.mp@parliament.uk',
        majority: 31445,
        firstElected: '2012'
      },
      region: 'England',
      population: 89129,
      area: 31.2,
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    {
      id: 'edinburgh-south',
      name: 'Edinburgh South',
      mp: {
        name: 'Ian Murray',
        party: 'Labour',
        partyColor: '#E4003B',
        email: 'ian.murray.mp@parliament.uk',
        majority: 11095,
        firstElected: '2010'
      },
      region: 'Scotland',
      population: 67200,
      area: 42.1,
      coordinates: { lat: 55.9533, lng: -3.1883 }
    },
    {
      id: 'glasgow-central',
      name: 'Glasgow Central',
      mp: {
        name: 'Alison Thewliss',
        party: 'SNP',
        partyColor: '#FDF83D',
        email: 'alison.thewliss.mp@parliament.uk',
        majority: 2267,
        firstElected: '2015'
      },
      region: 'Scotland',
      population: 61895,
      area: 18.7,
      coordinates: { lat: 55.8642, lng: -4.2518 }
    },
    {
      id: 'cardiff-central',
      name: 'Cardiff Central',
      mp: {
        name: 'Jo Stevens',
        party: 'Labour',
        partyColor: '#E4003B',
        email: 'jo.stevens.mp@parliament.uk',
        majority: 17196,
        firstElected: '2015'
      },
      region: 'Wales',
      population: 67317,
      area: 28.9,
      coordinates: { lat: 51.4816, lng: -3.1791 }
    },
    {
      id: 'bath',
      name: 'Bath',
      mp: {
        name: 'Wera Hobhouse',
        party: 'Liberal Democrat',
        partyColor: '#FAA61A',
        email: 'wera.hobhouse.mp@parliament.uk',
        majority: 12322,
        firstElected: '2017'
      },
      region: 'England',
      population: 88859,
      area: 351.2,
      coordinates: { lat: 51.3758, lng: -2.3599 }
    },
    {
      id: 'belfast-south',
      name: 'Belfast South',
      mp: {
        name: 'Claire Hanna',
        party: 'SDLP',
        partyColor: '#2AA82C',
        email: 'claire.hanna.mp@parliament.uk',
        majority: 15401,
        firstElected: '2019'
      },
      region: 'Northern Ireland',
      population: 67169,
      area: 44.2,
      coordinates: { lat: 54.5973, lng: -5.9301 }
    }
  ];

  // Simplified UK outline for demonstration
  const ukOutline = `
    M 100 50
    L 150 40
    L 200 60
    L 250 45
    L 300 70
    L 320 120
    L 310 180
    L 280 220
    L 240 250
    L 200 260
    L 160 250
    L 120 230
    L 90 200
    L 80 160
    L 85 120
    L 95 80
    Z
  `;

  useEffect(() => {
    const loadConstituencies = async () => {
      setLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would load GeoJSON data:
        // const response = await fetch('/api/constituencies.geojson');
        // const geoData = await response.json();
        
        setConstituencies(mockConstituencies);
      } catch (error) {
        console.error('Error loading constituency data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConstituencies();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setMapDimensions({
            width: container.clientWidth,
            height: Math.min(container.clientWidth * 0.75, 600)
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter(constituency => {
      const matchesSearch = constituency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           constituency.mp.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesParty = partyFilter === 'all' || 
                          constituency.mp.party.toLowerCase().replace(/\s+/g, '-') === partyFilter ||
                          (partyFilter === 'other' && !['conservative', 'labour', 'liberal-democrat', 'snp'].includes(
                            constituency.mp.party.toLowerCase().replace(/\s+/g, '-')
                          ));
      
      const matchesRegion = regionFilter === 'all' || 
                           constituency.region.toLowerCase().replace(/\s+/g, '-') === regionFilter;

      return matchesSearch && matchesParty && matchesRegion;
    });
  }, [constituencies, searchTerm, partyFilter, regionFilter]);

  const projectCoordinates = useCallback((lat: number, lng: number): [number, number] => {
    // Simple projection for demonstration - in production, use proper map projection
    const x = ((lng + 8) / 16) * mapDimensions.width * viewport.zoom + (mapDimensions.width * (1 - viewport.zoom)) / 2;
    const y = ((60 - lat) / 20) * mapDimensions.height * viewport.zoom + (mapDimensions.height * (1 - viewport.zoom)) / 2;
    return [x, y];
  }, [mapDimensions, viewport]);

  const handleConstituencyClick = (constituency: Constituency) => {
    setSelectedConstituency(constituency);
    // Center map on selected constituency
    setViewport(prev => ({
      ...prev,
      center: [constituency.coordinates.lng, constituency.coordinates.lat],
      zoom: Math.max(prev.zoom, 2)
    }));
  };

  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 5) }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 0.5) }));
  };

  const handleReset = () => {
    setViewport({ center: [-2.5, 54.5], zoom: 1 });
    setSelectedConstituency(null);
  };

  const getPartyStats = () => {
    const stats: Record<string, number> = {};
    constituencies.forEach(constituency => {
      const party = constituency.mp.party;
      stats[party] = (stats[party] || 0) + 1;
    });
    return stats;
  };

  const partyStats = getPartyStats();

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-96 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>Interactive Map</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🗺️ UK Constituency Map
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore UK parliamentary constituencies. Click on areas to view MP information, or search for specific constituencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search constituency or MP..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party
                  </label>
                  <select
                    value={partyFilter}
                    onChange={(e) => setPartyFilter(e.target.value as PartyFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="all">All Parties</option>
                    <option value="conservative">Conservative</option>
                    <option value="labour">Labour</option>
                    <option value="liberal-democrat">Liberal Democrat</option>
                    <option value="snp">SNP</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value as RegionFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="all">All Regions</option>
                    <option value="england">England</option>
                    <option value="scotland">Scotland</option>
                    <option value="wales">Wales</option>
                    <option value="northern-ireland">Northern Ireland</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Map Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleZoomIn}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                    <span>Zoom Out</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset View</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Party Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Party Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(partyStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([party, count]) => (
                    <div key={party} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{party}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map */}
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-blue-50 rounded-lg overflow-hidden">
                  <svg
                    ref={svgRef}
                    width={mapDimensions.width}
                    height={mapDimensions.height}
                    className="w-full h-auto"
                    viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
                  >
                    {/* UK Outline */}
                    <path
                      d={ukOutline}
                      fill="#e5e7eb"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Constituency Points */}
                    {filteredConstituencies.map((constituency) => {
                      const [x, y] = projectCoordinates(
                        constituency.coordinates.lat,
                        constituency.coordinates.lng
                      );
                      
                      const isSelected = selectedConstituency?.id === constituency.id;
                      const isHovered = hoveredConstituency?.id === constituency.id;
                      
                      return (
                        <g key={constituency.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 8 : isHovered ? 6 : 4}
                            fill={constituency.mp.partyColor}
                            stroke="white"
                            strokeWidth={isSelected ? 3 : 2}
                            className="cursor-pointer transition-all duration-200 hover:opacity-80"
                            onClick={() => handleConstituencyClick(constituency)}
                            onMouseEnter={() => setHoveredConstituency(constituency)}
                            onMouseLeave={() => setHoveredConstituency(null)}
                          />
                          {(isSelected || isHovered) && (
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              className="text-xs font-medium fill-gray-900 pointer-events-none"
                              style={{ textShadow: '1px 1px 2px white' }}
                            >
                              {constituency.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Map Info Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="font-medium">Map Legend</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Labour</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Conservative</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span>SNP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                        <span>Lib Dem</span>
                      </div>
                    </div>
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                    Zoom: {viewport.zoom.toFixed(1)}x
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Constituency Details */}
            {selectedConstituency && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedConstituency.name}</span>
                    <Badge 
                      style={{ backgroundColor: selectedConstituency.mp.partyColor }}
                      className="text-white border-0"
                    >
                      {selectedConstituency.mp.party}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedConstituency.region} • Population: {selectedConstituency.population.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MP Information */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary" />
                        Member of Parliament
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-lg">{selectedConstituency.mp.name}</p>
                          <p className="text-gray-600">{selectedConstituency.mp.party}</p>
                        </div>
                        {selectedConstituency.mp.majority && (
                          <div>
                            <p className="text-sm text-gray-600">Majority</p>
                            <p className="font-medium">{selectedConstituency.mp.majority.toLocaleString()} votes</p>
                          </div>
                        )}
                        {selectedConstituency.mp.firstElected && (
                          <div>
                            <p className="text-sm text-gray-600">First Elected</p>
                            <p className="font-medium">{selectedConstituency.mp.firstElected}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-primary" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        {selectedConstituency.mp.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`mailto:${selectedConstituency.mp.email}`}
                              className="text-primary hover:underline"
                            >
                              {selectedConstituency.mp.email}
                            </a>
                          </div>
                        )}
                        {selectedConstituency.mp.website && (
                          <div className="flex items-center space-x-3">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                            <a 
                              href={selectedConstituency.mp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              MP Website
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                          <a 
                            href={`https://members.parliament.uk/constituency/${selectedConstituency.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Parliament Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Constituency Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Constituency Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Population</p>
                        <p className="text-lg font-bold text-blue-900">
                          {selectedConstituency.population.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Area</p>
                        <p className="text-lg font-bold text-green-900">
                          {selectedConstituency.area} km²
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Region</p>
                        <p className="text-lg font-bold text-purple-900">
                          {selectedConstituency.region}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600 font-medium">Density</p>
                        <p className="text-lg font-bold text-orange-900">
                          {Math.round(selectedConstituency.population / selectedConstituency.area)}/km²
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Showing {filteredConstituencies.length} of {constituencies.length} constituencies
                  </span>
                  {(searchTerm || partyFilter !== 'all' || regionFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setPartyFilter('all');
                        setRegionFilter('all');
                      }}
                      className="text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstituencyMapView;