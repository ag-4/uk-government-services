import { MP } from '../types/mp';

export class MPImageService {
  private static readonly DEFAULT_IMAGE = '/images/mp-placeholder.jpg';
  private static readonly IMAGE_BASE_PATH = '/images/mps/';
  
  /**
   * Get the image URL for an MP
   */
  static getImageUrl(mp: MP): string {
    if (!mp.image_url) {
      return this.DEFAULT_IMAGE;
    }
    
    // If it's already a full path, return as is
    if (mp.image_url.startsWith('/') || mp.image_url.startsWith('http')) {
      return mp.image_url;
    }
    
    // Otherwise, construct the full path
    return this.IMAGE_BASE_PATH + mp.image_url;
  }
  
  /**
   * Check if an MP has a real photo (not a placeholder)
   */
  static hasRealPhoto(mp: MP): boolean {
    if (!mp.image_url) return false;
    
    return !mp.image_url.includes('placeholder') && 
           !mp.image_url.includes('.svg') &&
           (mp.image_url.includes('.jpg') || 
            mp.image_url.includes('.jpeg') || 
            mp.image_url.includes('.png'));
  }
  
  /**
   * Get fallback image for party
   */
  static getPartyImage(party: string): string {
    const partyImages: { [key: string]: string } = {
      'Labour': '/images/labour-logo.png',
      'Conservative': '/images/conservative-logo.jpeg',
      'Liberal Democrat': '/images/lib-dem-logo.png',
      'SNP': '/images/snp-logo.png',
      'Green': '/images/green-logo.png',
      'Scottish National Party': '/images/snp-logo.png'
    };
    
    return partyImages[party] || this.DEFAULT_IMAGE;
  }
  
  /**
   * Preload images for better performance
   */
  static preloadImages(mps: MP[]): void {
    mps.forEach(mp => {
      const img = new Image();
      img.src = this.getImageUrl(mp);
    });
  }
}

export default MPImageService;
