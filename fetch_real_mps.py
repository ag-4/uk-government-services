import requests
import json
from datetime import datetime
import time

def fetch_real_mp_data():
    """
    Fetch real MP data from the UK Parliament API
    """
    base_url = "https://members-api.parliament.uk/api"
    
    # Fetch all current MPs
    current_mps_url = f"{base_url}/Members/Search?House=Commons&IsCurrentMember=true"
    
    print("Fetching current MPs from UK Parliament API...")
    
    try:
        response = requests.get(current_mps_url)
        response.raise_for_status()
        
        mps_data = response.json()
        print(f"Found {len(mps_data['items'])} current MPs")
        
        processed_mps = []
        
        for i, mp in enumerate(mps_data['items']):
            if i % 50 == 0:
                print(f"Processing MP {i+1}/{len(mps_data['items'])}")
            
            # Get detailed MP information
            mp_id = mp['value']['id']
            
            # Fetch contact details
            contact_url = f"{base_url}/Members/{mp_id}/Contact"
            try:
                contact_response = requests.get(contact_url)
                if contact_response.status_code == 200:
                    contact_data = contact_response.json()
                else:
                    contact_data = {"value": []}
            except:
                contact_data = {"value": []}
            
            # Fetch constituency details
            constituency_url = f"{base_url}/Members/{mp_id}/Constituencies?since=2019-01-01"
            try:
                constituency_response = requests.get(constituency_url)
                if constituency_response.status_code == 200:
                    constituency_data = constituency_response.json()
                else:
                    constituency_data = {"value": []}
            except:
                constituency_data = {"value": []}
            
            # Process MP data
            mp_info = mp['value']
            
            # Get current constituency
            current_constituency = None
            if constituency_data.get('value'):
                for const in constituency_data['value']:
                    if const.get('endDate') is None:  # Current constituency
                        current_constituency = const
                        break
            
            # Extract contact information
            email = None
            phone = None
            addresses = []
            
            for contact in contact_data.get('value', []):
                if contact.get('type') == 'Parliamentary':
                    if contact.get('email'):
                        email = contact['email']
                    if contact.get('phone'):
                        phone = contact['phone']
                    
                    # Add parliamentary address
                    addresses.append({
                        "type": "Parliamentary",
                        "fullAddress": contact.get('postcode', 'House of Commons, Westminster, London SW1A 0AA'),
                        "postcode": "SW1A 0AA",
                        "line1": "House of Commons",
                        "line2": "Westminster",
                        "town": "London",
                        "county": "Greater London",
                        "country": "UK"
                    })
                
                elif contact.get('type') == 'Constituency':
                    if contact.get('postcode'):
                        addresses.append({
                            "type": "Constituency",
                            "fullAddress": contact.get('line1', '') + (f", {contact.get('line2', '')}" if contact.get('line2') else ''),
                            "postcode": contact.get('postcode', ''),
                            "line1": contact.get('line1', ''),
                            "line2": contact.get('line2', ''),
                            "town": contact.get('town', ''),
                            "county": contact.get('county', ''),
                            "country": "UK"
                        })
            
            # Create processed MP record
            processed_mp = {
                "id": f"MP{mp_info['id']}",
                "parliamentId": mp_info['id'],
                "name": mp_info['nameDisplayAs'],
                "displayName": mp_info['nameFullTitle'] or mp_info['nameDisplayAs'],
                "fullTitle": mp_info['nameFullTitle'] or mp_info['nameDisplayAs'],
                "constituency": current_constituency['name'] if current_constituency else "Unknown",
                "constituencyId": current_constituency['id'] if current_constituency else None,
                "party": mp_info.get('latestParty', {}).get('name', 'Unknown'),
                "partyAbbreviation": mp_info.get('latestParty', {}).get('abbreviation', ''),
                "partyColor": get_party_color(mp_info.get('latestParty', {}).get('name', '')),
                "gender": mp_info.get('gender', 'U'),
                "membershipStartDate": mp_info.get('membershipStartDate', ''),
                "membershipEndDate": mp_info.get('membershipEndDate'),
                "isActive": True,
                "email": email,
                "phone": phone,
                "website": None,  # Will need to be added manually or from other sources
                "addresses": addresses,
                "biography": f"{mp_info['nameDisplayAs']} is the {mp_info.get('latestParty', {}).get('name', 'Unknown')} MP for {current_constituency['name'] if current_constituency else 'Unknown'}.",
                "thumbnailUrl": f"https://members-api.parliament.uk/api/Members/{mp_info['id']}/Thumbnail",
                "postcodes": [],  # Will need to be populated with constituency postcodes
                "constituencyPostcodes": [],
                "committees": [],  # Could be fetched from additional API calls
                "experience": [],  # Could be fetched from additional API calls
                "socialMedia": {}
            }
            
            processed_mps.append(processed_mp)
            
            # Add a small delay to avoid overwhelming the API
            time.sleep(0.1)
        
        return processed_mps
        
    except requests.RequestException as e:
        print(f"Error fetching MP data: {e}")
        return None

def get_party_color(party_name):
    """Get party colors for major UK political parties"""
    colors = {
        'Conservative': '0087dc',
        'Labour': 'e4003b',
        'Liberal Democrat': 'faa61a',
        'Scottish National Party': 'fff95d',
        'Green Party': '6ab023',
        'Reform UK': '12b6cf',
        'Plaid Cymru': '008142',
        'Democratic Unionist Party': 'd46a4c',
        'Social Democratic and Labour Party': '2aa82c',
        'Alliance Party of Northern Ireland': 'f6cb2f',
        'Ulster Unionist Party': '9999ff',
        'Independent': '909090'
    }
    return colors.get(party_name, '909090')

if __name__ == "__main__":
    print("Starting MP data fetch...")
    mps = fetch_real_mp_data()
    
    if mps:
        # Save to file
        with open('real_mps_complete.json', 'w', encoding='utf-8') as f:
            json.dump(mps, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully saved {len(mps)} MPs to real_mps_complete.json")
        
        # Show some examples
        print("\nFirst 3 MPs as examples:")
        for mp in mps[:3]:
            print(f"- {mp['name']} ({mp['party']}) - {mp['constituency']}")
            print(f"  Email: {mp['email']}")
            print(f"  Phone: {mp['phone']}")
            print()
    else:
        print("Failed to fetch MP data")
