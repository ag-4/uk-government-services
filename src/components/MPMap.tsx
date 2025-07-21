import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Globe, Twitter, User, Building, Calendar, ExternalLink, Map } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  id: number;
  postcode: string;
  mp_id: number;
  council_id: number | null;
  latitude: number;
  longitude: number;
  created_at: string;
}

// Interactive Map Component
const MPMap = ({ selectedMP, postcodeData, allMPs, onMPSelect }: {
  selectedMP: MP | null;
  postcodeData: PostcodeMapping[];
  allMPs: MP[];
  onMPSelect: (mp: MP) => void;
}) => {
  const [mapData, setMapData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  // UK regions for the map
  const ukRegions = [
    'London', 'South East', 'South West', 'East of England', 'West Midlands',
    'East Midlands', 'Yorkshire and The Humber', 'North West', 'North East',
    'Scotland', 'Wales', 'Northern Ireland'
  ];

  const getRegionMPs = (region: string) => {
    // Simple region mapping based on constituency names
    const regionKeywords: { [key: string]: string[] } = {
      'London': ['london', 'westminster', 'kensington', 'chelsea', 'camden', 'islington', 'hackney', 'tower hamlets', 'greenwich', 'lewisham', 'southwark', 'lambeth', 'wandsworth', 'hammersmith', 'fulham', 'brent', 'ealing', 'hounslow', 'richmond', 'kingston', 'merton', 'sutton', 'croydon', 'bromley', 'bexley', 'barking', 'dagenham', 'redbridge', 'newham', 'waltham forest', 'haringey', 'enfield', 'barnet', 'harrow', 'hillingdon'],
      'South East': ['kent', 'surrey', 'sussex', 'hampshire', 'berkshire', 'oxfordshire', 'buckinghamshire', 'hertfordshire', 'essex', 'isle of wight'],
      'South West': ['cornwall', 'devon', 'dorset', 'somerset', 'gloucestershire', 'wiltshire', 'bristol', 'bath'],
      'East of England': ['norfolk', 'suffolk', 'cambridgeshire', 'bedfordshire', 'hertfordshire', 'essex'],
      'West Midlands': ['birmingham', 'coventry', 'wolverhampton', 'walsall', 'dudley', 'sandwell', 'solihull', 'staffordshire', 'warwickshire', 'worcestershire', 'herefordshire', 'shropshire'],
      'East Midlands': ['nottinghamshire', 'leicestershire', 'derbyshire', 'lincolnshire', 'northamptonshire', 'rutland'],
      'Yorkshire and The Humber': ['yorkshire', 'leeds', 'sheffield', 'bradford', 'hull', 'york', 'doncaster', 'rotherham', 'barnsley', 'wakefield', 'kirklees', 'calderdale'],
      'North West': ['manchester', 'liverpool', 'preston', 'blackpool', 'lancaster', 'cumbria', 'cheshire', 'merseyside', 'greater manchester', 'lancashire'],
      'North East': ['newcastle', 'sunderland', 'middlesbrough', 'durham', 'northumberland', 'tyne and wear'],
      'Scotland': ['glasgow', 'edinburgh', 'aberdeen', 'dundee', 'stirling', 'perth', 'inverness', 'highlands', 'borders', 'dumfries', 'galloway', 'fife', 'angus', 'moray', 'aberdeenshire', 'renfrewshire', 'lanarkshire', 'ayrshire', 'falkirk', 'clackmannanshire', 'west lothian', 'east lothian', 'midlothian', 'scottish borders', 'argyll', 'bute', 'western isles', 'orkney', 'shetland'],
      'Wales': ['cardiff', 'swansea', 'newport', 'wrexham', 'bangor', 'aberystwyth', 'carmarthen', 'pembroke', 'conwy', 'flint', 'merthyr', 'rhondda', 'bridgend', 'neath', 'port talbot', 'caerphilly', 'torfaen', 'monmouth', 'powys', 'ceredigion', 'pembrokeshire', 'carmarthenshire', 'gwynedd', 'anglesey', 'denbighshire', 'flintshire', 'wrexham', 'conwy', 'isle of anglesey'],
      'Northern Ireland': ['belfast', 'derry', 'londonderry', 'lisburn', 'newry', 'bangor', 'craigavon', 'ballymena', 'newtownabbey', 'carrickfergus', 'coleraine', 'omagh', 'larne', 'strabane', 'limavady', 'enniskillen', 'antrim', 'ballymoney', 'downpatrick', 'magherafelt', 'cookstown', 'dungannon', 'armagh', 'fermanagh', 'tyrone']
    };

    const keywords = regionKeywords[region] || [];
    return allMPs.filter(mp => 
      keywords.some(keyword => 
        mp.constituency.toLowerCase().includes(keyword)
      )
    );
  };

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      'Conservative': '#0087DC',
      'Labour': '#E4003B',
      'Liberal Democrat': '#FAA61A',
      'Scottish National Party': '#FDF23B',
      'Green': '#6AB023',
      'Democratic Unionist Party': '#D46A4C',
      'Sinn Féin': '#326760',
      'Plaid Cymru': '#005B54',
      'Independent': '#999999'
    };
    return colors[party] || '#999999';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          UK Parliamentary Map
        </CardTitle>
        <CardDescription>
          Explore MPs by region and constituency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Region Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ukRegions.map(region => {
              const regionMPs = getRegionMPs(region);
              return (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(selectedRegion === region ? '' : region)}
                  className="text-xs p-2 h-auto"
                >
                  <div className="text-center">
                    <div className="font-medium">{region}</div>
                    <div className="text-xs opacity-70">{regionMPs.length} MPs</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Selected Region Details */}
          {selectedRegion && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">{selectedRegion} - MPs by Party</h3>
              <div className="space-y-2">
                {(() => {
                  const regionMPs = getRegionMPs(selectedRegion);
                  const partyGroups = regionMPs.reduce((acc, mp) => {
                    acc[mp.party] = (acc[mp.party] || 0) + 1;
                    return acc;
                  }, {} as { [key: string]: number });

                  return Object.entries(partyGroups)
                    .sort(([,a], [,b]) => b - a)
                    .map(([party, count]) => (
                      <div key={party} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: getPartyColor(party) }}
                          />
                          <span className="text-sm">{party}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ));
                })()}
              </div>

              {/* MPs in Selected Region */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">MPs in {selectedRegion}:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {getRegionMPs(selectedRegion).map(mp => (
                    <Button
                      key={mp.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onMPSelect(mp)}
                      className="justify-start text-left h-auto p-2"
                    >
                      <div>
                        <div className="font-medium text-xs">{mp.name}</div>
                        <div className="text-xs text-gray-500">{mp.constituency}</div>
                        <div className="text-xs" style={{ color: getPartyColor(mp.party) }}>
                          {mp.party}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{allMPs.length}</div>
              <div className="text-xs text-blue-600">Total MPs</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{postcodeData.length}</div>
              <div className="text-xs text-green-600">Postcodes</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(allMPs.map(mp => mp.party)).size}
              </div>
              <div className="text-xs text-purple-600">Parties</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">650</div>
              <div className="text-xs text-orange-600">Constituencies</div>
            </div>
          </div>

          {/* IPSA Integration Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-900">
                  Enhanced Map Data Available
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  For detailed constituency boundaries and interactive mapping, visit the{' '}
                  <a 
                    href="https://www.theipsa.org.uk/mp-staffing-business-costs/interactive-map" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900"
                  >
                    IPSA Interactive Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MPMap;