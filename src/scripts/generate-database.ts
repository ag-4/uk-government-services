import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

interface MP {
    id: string;
    name: string;
    party: string;
    constituency: string;
    email: string;
    phone: string;
    website: string;
    imageUrl: string;
    parliamentId: number;
    mailingAddress: string;
    socialMedia: {
        twitter?: string;
        facebook?: string;
        linkedin?: string;
    };
}

interface Council {
    id: string;
    name: string;
    type: 'County' | 'District' | 'Unitary' | 'Metropolitan' | 'London Borough';
    address: string;
    phone: string;
    email: string;
    website: string;
    mainContact: string;
    services: string[];
    postcodes: string[];
    location: {
        latitude: number;
        longitude: number;
    };
}

interface Postcode {
    postcode: string;
    mpId: string;
    councilId: string;
    latitude: number;
    longitude: number;
}

interface LocalAuthorityRecord {
    id: string;
    name: string;
    type: 'County' | 'District' | 'Unitary' | 'Metropolitan' | 'London Borough';
}

class DatabaseGenerator {
    private mps: MP[] = [];
    private councils: Council[] = [];
    private postcodes: Postcode[] = [];
    
    private readonly OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');
    private readonly IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'mps');
    
    async generateMPDatabase() {
        console.log('Fetching MP data from Parliament API...');
        
        try {
            const response = await axios.get('https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&take=650');
            const parliamentMPs = response.data.items;
            
            for (const mp of parliamentMPs) {
                const mpData = mp.value;
                const contact = await this.getMPContact(mpData.id);
                
                this.mps.push({
                    id: mpData.id.toString(),
                    name: mpData.nameDisplayAs,
                    party: mpData.latestParty.name,
                    constituency: mpData.latestHouseMembership.membershipFrom,
                    email: contact.email || '',
                    phone: contact.phone || '',
                    website: contact.website || '',
                    imageUrl: '/images/mps/' + mpData.id + '.jpg',
                    parliamentId: mpData.id,
                    mailingAddress: contact.address || '',
                    socialMedia: {
                        twitter: contact.twitter,
                        facebook: contact.facebook,
                        linkedin: contact.linkedin
                    }
                });
                
                await this.downloadMPImage(mpData.id, mpData.thumbnailUrl);
            }
            
            await this.saveToFile('mps.json', this.mps);
            console.log('Successfully generated database for ' + this.mps.length + ' MPs');
            
        } catch (error) {
            console.error('Error generating MP database:', error);
            throw error;
        }
    }
    
    async generateCouncilDatabase() {
        console.log('Fetching council data...');
        
        try {
            const response = await axios.get('https://local-authority-eng.register.gov.uk/records.json');
            const councils = Object.values(response.data) as LocalAuthorityRecord[];
            
            for (const council of councils) {
                const councilData = await this.getCouncilDetails(council.id);
                
                this.councils.push({
                    id: council.id,
                    name: council.name,
                    type: council.type,
                    address: councilData.address || '',
                    phone: councilData.phone || '',
                    email: councilData.email || '',
                    website: councilData.website || '',
                    mainContact: councilData.mainContact || '',
                    services: councilData.services || [],
                    postcodes: councilData.postcodes || [],
                    location: {
                        latitude: councilData.latitude || 0,
                        longitude: councilData.longitude || 0
                    }
                });
            }
            
            await this.saveToFile('councils.json', this.councils);
            console.log('Successfully generated database for ' + this.councils.length + ' councils');
            
        } catch (error) {
            console.error('Error generating council database:', error);
            throw error;
        }
    }
    
    async generatePostcodeDatabase() {
        console.log('Generating postcode database...');
        
        try {
            const response = await axios.get('https://geoportal.statistics.gov.uk/datasets/ons::national-statistics-postcode-lookup-february-2023/about');
            const postcodeData = response.data;
            
            for (const data of postcodeData) {
                this.postcodes.push({
                    postcode: data.postcode,
                    mpId: this.findMPByConstituency(data.constituency),
                    councilId: this.findCouncilByLocation(data.latitude, data.longitude),
                    latitude: data.latitude,
                    longitude: data.longitude
                });
            }
            
            await this.saveToFile('postcodes.json', this.postcodes);
            console.log('Successfully generated database for ' + this.postcodes.length + ' postcodes');
            
        } catch (error) {
            console.error('Error generating postcode database:', error);
            throw error;
        }
    }
    
    private async getMPContact(parliamentId: number) {
        try {
            const response = await axios.get('https://members-api.parliament.uk/api/Members/' + parliamentId + '/Contact');
            return response.data;
        } catch (error) {
            console.warn('Could not fetch contact details for MP ' + parliamentId);
            return {};
        }
    }
    
    private async getCouncilDetails(councilId: string) {
        try {
            const lgaResponse = await axios.get('https://api.local.gov.uk/authorities/' + councilId);
            const govukResponse = await axios.get('https://www.register.gov.uk/local-authorities/' + councilId);
            
            return {
                ...lgaResponse.data,
                ...govukResponse.data
            };
        } catch (error) {
            console.warn('Could not fetch details for council ' + councilId);
            return {
                address: '',
                phone: '',
                email: '',
                website: '',
                mainContact: '',
                services: [],
                postcodes: [],
                latitude: 0,
                longitude: 0
            };
        }
    }
    
    private async downloadMPImage(mpId: number, imageUrl: string) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            await fs.mkdir(this.IMAGE_DIR, { recursive: true });
            await fs.writeFile(path.join(this.IMAGE_DIR, mpId + '.jpg'), response.data);
        } catch (error) {
            console.warn('Could not download image for MP ' + mpId);
        }
    }
    
    private findMPByConstituency(constituency: string): string {
        const mp = this.mps.find(mp => mp.constituency.toLowerCase() === constituency.toLowerCase());
        return mp ? mp.id : '';
    }
    
    private findCouncilByLocation(latitude: number, longitude: number): string {
        if (!latitude || !longitude) return '';
        
        let nearestCouncil: Council | undefined;
        let shortestDistance = Infinity;
        
        for (const council of this.councils) {
            const distance = this.calculateDistance(
                latitude,
                longitude,
                council.location.latitude,
                council.location.longitude
            );
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestCouncil = council;
            }
        }
        
        return nearestCouncil ? nearestCouncil.id : '';
    }
    
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
    
    private async saveToFile(filename: string, data: any) {
        await fs.mkdir(this.OUTPUT_DIR, { recursive: true });
        await fs.writeFile(
            path.join(this.OUTPUT_DIR, filename),
            JSON.stringify(data, null, 2)
        );
    }
    
    async generateAll() {
        console.log('Starting database generation...');
        await this.generateMPDatabase();
        await this.generateCouncilDatabase();
        await this.generatePostcodeDatabase();
        console.log('Database generation complete!');
    }
}

// Run the generator
const generator = new DatabaseGenerator();
generator.generateAll().catch(console.error);
