import { useState } from 'react';

interface MPData {
  full_name: string;
  party: string;
  constituency: string;
  person_id?: string;
  mp_id?: string;
  office?: Array<{
    dept: string;
    position: string;
  }>;
}

interface CouncilData {
  name: string;
  type: string;
  website?: string;
  contact?: string;
}

interface MPandCouncilData {
  mp: MPData;
  council: CouncilData;
  postcode: string;
  constituency: string;
  adminDistrict: string;
}

export function useMPandCouncil() {
  const [data, setData] = useState<MPandCouncilData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchData(postcode: string) {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Clean postcode
      const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

      // 1. Validate postcode & get district using Postcodes.io
      const pcResponse = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
      const pcJson = await pcResponse.json();
      
      if (!pcJson.result) {
        throw new Error('Invalid postcode. Please check and try again.');
      }

      const constituency = pcJson.result.parliamentary_constituency;
      const adminDistrict = pcJson.result.admin_district;
      const councilName = pcJson.result.admin_district;

      // 2. Council data from Postcodes.io
      const council: CouncilData = {
        name: councilName,
        type: 'Local Authority',
        website: `https://www.gov.uk/find-local-council`,
        contact: 'Contact via local council website'
      };

      // 3. Try TheyWorkForYou API for MP lookup
      let mpData: MPData;
      
      try {
        // Note: In production, you would use your TheyWorkForYou API key
        // const twfyKey = process.env.REACT_APP_TWFY_KEY;
        // const mpResponse = await fetch(
        //   `https://www.theyworkforyou.com/api/getMP?key=${twfyKey}&postcode=${cleanPostcode}&output=json`
        // );
        // const mpJson = await mpResponse.json();
        // 
        // if (mpJson.error) {
        //   throw new Error(mpJson.error);
        // }
        // 
        // mpData = mpJson;

        // Fallback: Use Parliament API for MP data
        const parliamentResponse = await fetch(
          `https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&take=650`
        );
        
        if (!parliamentResponse.ok) {
          throw new Error('Unable to fetch MP data from Parliament API');
        }
        
        const parliamentData = await parliamentResponse.json();
        
        // Find MP by constituency
        const foundMP = parliamentData.items?.find((member: any) => {
          const mpConstituency = member.value.latestHouseMembership?.membershipFrom || '';
          return mpConstituency.toLowerCase() === constituency.toLowerCase() ||
                 mpConstituency.toLowerCase().includes(constituency.toLowerCase()) ||
                 constituency.toLowerCase().includes(mpConstituency.toLowerCase());
        });
        
        if (!foundMP) {
          throw new Error(`No MP found for constituency: ${constituency}`);
        }
        
        mpData = {
          full_name: foundMP.value.nameDisplayAs,
          party: foundMP.value.latestParty?.name || 'Unknown',
          constituency: foundMP.value.latestHouseMembership?.membershipFrom || constituency,
          person_id: foundMP.value.id.toString(),
          mp_id: foundMP.value.id.toString()
        };
        
      } catch (mpError) {
        console.error('Error fetching MP data:', mpError);
        throw new Error(`Unable to find MP for ${constituency}. Please try a different postcode.`);
      }

      // 4. Set the combined data
      setData({
        mp: mpData,
        council,
        postcode: cleanPostcode,
        constituency,
        adminDistrict
      });
      
    } catch (e: any) {
      console.error('Error in fetchData:', e);
      setError(e.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { 
    fetchData, 
    data, 
    error, 
    loading,
    reset
  };
}

export default useMPandCouncil;