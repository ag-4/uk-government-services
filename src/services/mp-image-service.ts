/**
 * MP Image Service - Fetches real MP photos from official sources
 * 
 * This service attempts to fetch MP images from multiple reliable sources:
 * 1. UK Parliament official API
 * 2. TheyWorkForYou.com (has most MP photos)
 * 3. Wikipedia (fallback for missing photos)
 * 4. Parliament.uk official photos
 * 
 * Created: June 28, 2025
 */

interface MPImageSources {
  parliamentApiId?: number;
  theyWorkForYouId?: number;
  wikipediaPage?: string;
  officialImageUrl?: string;
}

class MPImageService {
  private imageCache = new Map<string, string>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get the real image URL for an MP
   */
  async getMPImage(mp: any): Promise<string> {
    const cacheKey = `mp-image-${mp.id}`;
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    try {
      // Try multiple sources in order of reliability
      let imageUrl = await this.tryParliamentAPI(mp) ||
                     await this.tryTheyWorkForYou(mp) ||
                     await this.tryWikipedia(mp) ||
                     await this.tryOfficialParliamentSite(mp) ||
                     this.getDefaultImage(mp);

      // Cache the result
      this.imageCache.set(cacheKey, imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.warn(`Failed to fetch image for ${mp.name}:`, error);
      return this.getDefaultImage(mp);
    }
  }

  /**
   * Try to get image from UK Parliament Members API
   */
  private async tryParliamentAPI(mp: any): Promise<string | null> {
    try {
      // Search for the MP in the Parliament API
      const searchResponse = await fetch(
        `https://members-api.parliament.uk/api/Members/Search?Name=${encodeURIComponent(mp.name)}&IsEligible=true`
      );
      
      if (!searchResponse.ok) return null;
      
      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        // Find the exact match or best match
        const mpMatch = searchData.items.find((item: any) => 
          item.value.latestParty?.name === mp.party ||
          item.value.latestHouseMembership?.membershipFrom === mp.constituency
        ) || searchData.items[0];

        if (mpMatch?.value?.id) {
          // Get detailed member info including photo
          const detailResponse = await fetch(
            `https://members-api.parliament.uk/api/Members/${mpMatch.value.id}`
          );
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            
            // Check if there's a photo URL
            if (detailData.value?.thumbnailUrl) {
              return detailData.value.thumbnailUrl;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Parliament API failed:', error);
    }
    
    return null;
  }

  /**
   * Try to get image from TheyWorkForYou.com
   */
  private async tryTheyWorkForYou(mp: any): Promise<string | null> {
    try {
      // TheyWorkForYou has a more reliable image API
      const response = await fetch(
        `https://www.theyworkforyou.com/api/getMPInfo?name=${encodeURIComponent(mp.name)}&constituency=${encodeURIComponent(mp.constituency)}&output=js`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          return `https://www.theyworkforyou.com${data.image}`;
        }
      }
    } catch (error) {
      console.warn('TheyWorkForYou failed:', error);
    }
    
    return null;
  }

  /**
   * Try to get image from Wikipedia
   */
  private async tryWikipedia(mp: any): Promise<string | null> {
    try {
      // Search Wikipedia for the MP
      const searchResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mp.name)}`
      );
      
      if (searchResponse.ok) {
        const data = await searchResponse.json();
        if (data.thumbnail?.source) {
          return data.thumbnail.source;
        }
      }
    } catch (error) {
      console.warn('Wikipedia failed:', error);
    }
    
    return null;
  }

  /**
   * Try to get image from official Parliament website
   */
  private async tryOfficialParliamentSite(mp: any): Promise<string | null> {
    try {
      // This is a more direct approach using the Parliament website structure
      const nameSlug = mp.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      const possibleUrls = [
        `https://members.parliament.uk/member/${nameSlug}/portrait`,
        `https://www.parliament.uk/biographies/commons/${nameSlug}/portrait.jpg`,
        `https://www.parliament.uk/mps-lords-and-offices/mps/${nameSlug}/portrait.jpg`
      ];

      for (const url of possibleUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            return url;
          }
        } catch (e) {
          // Continue to next URL
        }
      }
    } catch (error) {
      console.warn('Official Parliament site failed:', error);
    }
    
    return null;
  }

  /**
   * Get a default image based on party or generic placeholder
   */
  private getDefaultImage(mp: any): string {
    // Return party-specific or generic placeholder
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

  /**
   * Preload images for better performance
   */
  async preloadImages(mps: any[]): Promise<void> {
    const promises = mps.slice(0, 10).map(mp => this.getMPImage(mp)); // Only preload first 10
    await Promise.allSettled(promises);
  }

  /**
   * Clear image cache
   */
  clearCache(): void {
    this.imageCache.clear();
  }

  /**
   * Update MP data with correct image URLs
   */
  async updateMPsWithImages(mps: any[]): Promise<any[]> {
    console.log('🖼️ Updating MP images...');
    
    const updatedMPs = await Promise.all(
      mps.map(async (mp, index) => {
        if (index % 10 === 0) {
          console.log(`📸 Processing images: ${index + 1}/${mps.length}`);
        }
        
        const imageUrl = await this.getMPImage(mp);
        return {
          ...mp,
          image: imageUrl,
          imageUpdated: new Date().toISOString()
        };
      })
    );

    console.log('✅ MP images updated successfully');
    return updatedMPs;
  }
}

export const mpImageService = new MPImageService();
export default mpImageService;
