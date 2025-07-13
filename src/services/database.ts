// Database service for storing user data
// This provides a unified interface for data persistence
// Integrated with backend API for real database functionality

export interface UserBookmark {
  id: string;
  type: 'mp' | 'bill' | 'news';
  itemId: string;
  title: string;
  description?: string;
  url?: string;
  createdAt: string;
  userId?: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  subscriptionTypes: string[];
  frequency: string;
  interests: string[];
  consentGiven: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface SentMessage {
  id: string;
  template: string;
  mpName: string;
  userDetails: {
    name: string;
    email: string;
    address: string;
  };
  content: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

class DatabaseService {
  private isInitialized = false;
  private useRealDatabase = false;
  private baseUrl = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/database` : '/api/database';

  async initialize() {
    if (this.isInitialized) return;
    
    // Test backend API connection
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      
      if (result.success && result.status === 'healthy') {
        this.useRealDatabase = true;
        console.log('Database service initialized (using backend API)');
      } else {
        console.warn('Backend API unhealthy, using localStorage:', result.error);
      }
    } catch (error) {
      console.warn('Backend API unavailable, using localStorage:', error);
    }
    
    this.isInitialized = true;
  }

  private async apiRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Bookmarks management
  async getBookmarks(userId?: string): Promise<UserBookmark[]> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const endpoint = userId ? `/bookmarks?userId=${userId}` : '/bookmarks';
        const result = await this.apiRequest(endpoint);
        return result.data || [];
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }
    
    // localStorage fallback
    const bookmarks = localStorage.getItem('user_bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  async addBookmark(bookmark: Omit<UserBookmark, 'id' | 'createdAt'>): Promise<UserBookmark> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const result = await this.apiRequest('/bookmarks', {
          method: 'POST',
          body: JSON.stringify(bookmark)
        });
        return result.data;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback
    const newBookmark: UserBookmark = {
      ...bookmark,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    const existingBookmarks = await this.getBookmarks();
    const updatedBookmarks = [...existingBookmarks, newBookmark];
    localStorage.setItem('user_bookmarks', JSON.stringify(updatedBookmarks));
    
    return newBookmark;
  }

  async removeBookmark(bookmarkId: string): Promise<void> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        await this.apiRequest(`/bookmarks/${bookmarkId}`, {
          method: 'DELETE'
        });
        return;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback
    const existingBookmarks = await this.getBookmarks();
    const updatedBookmarks = existingBookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem('user_bookmarks', JSON.stringify(updatedBookmarks));
  }

  // Newsletter subscriptions
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const result = await this.apiRequest('/subscriptions');
        return result.data || [];
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }
    
    // localStorage fallback
    const subscriptions = localStorage.getItem('newsletter_subscriptions');
    return subscriptions ? JSON.parse(subscriptions) : [];
  }

  async addNewsletterSubscription(subscription: Omit<NewsletterSubscription, 'id' | 'createdAt'>): Promise<NewsletterSubscription> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const result = await this.apiRequest('/subscriptions', {
          method: 'POST',
          body: JSON.stringify(subscription)
        });
        return result.data;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback
    const newSubscription: NewsletterSubscription = {
      ...subscription,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    const existingSubscriptions = await this.getNewsletterSubscriptions();
    const updatedSubscriptions = [...existingSubscriptions, newSubscription];
    localStorage.setItem('newsletter_subscriptions', JSON.stringify(updatedSubscriptions));
    
    return newSubscription;
  }

  async updateNewsletterSubscription(subscriptionId: string, updates: Partial<NewsletterSubscription>): Promise<void> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        await this.apiRequest(`/subscriptions/${subscriptionId}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });
        return;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback
    const existingSubscriptions = await this.getNewsletterSubscriptions();
    const updatedSubscriptions = existingSubscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, ...updates } : sub
    );
    localStorage.setItem('newsletter_subscriptions', JSON.stringify(updatedSubscriptions));
  }

  // Sent messages
  async getSentMessages(): Promise<SentMessage[]> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const result = await this.apiRequest('/messages');
        return result.data || [];
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }
    
    // localStorage fallback
    const messages = localStorage.getItem('sent_messages');
    return messages ? JSON.parse(messages) : [];
  }

  async addSentMessage(message: Omit<SentMessage, 'id'>): Promise<SentMessage> {
    await this.initialize();
    
    if (this.useRealDatabase) {
      try {
        const result = await this.apiRequest('/messages', {
          method: 'POST',
          body: JSON.stringify(message)
        });
        return result.data;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback
    const newMessage: SentMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const existingMessages = await this.getSentMessages();
    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem('sent_messages', JSON.stringify(updatedMessages));
    
    return newMessage;
  }

  // Analytics and usage tracking
  async trackUserAction(action: string, details?: any): Promise<void> {
    await this.initialize();
    
    const trackingData = {
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (this.useRealDatabase) {
      try {
        await this.apiRequest('/track', {
          method: 'POST',
          body: JSON.stringify(trackingData)
        });
        return;
      } catch (error) {
        console.warn('API request failed, using localStorage:', error);
      }
    }

    // localStorage fallback (limited storage)
    try {
      const fullTrackingData = {
        ...trackingData,
        timestamp: new Date().toISOString()
      };
      const existingActions = JSON.parse(localStorage.getItem('user_actions') || '[]');
      const updatedActions = [...existingActions.slice(-99), fullTrackingData]; // Keep last 100 actions
      localStorage.setItem('user_actions', JSON.stringify(updatedActions));
    } catch (error) {
      console.warn('Failed to track user action:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', details: any }> {
    await this.initialize();
    
    try {
      if (this.useRealDatabase) {
        try {
          const result = await this.apiRequest('/health');
          return { 
            status: result.status === 'healthy' ? 'healthy' : 'degraded', 
            details: { 
              database: 'backend-api', 
              connected: result.success,
              fallback: 'localStorage',
              ...result.details
            } 
          };
        } catch (error) {
          return {
            status: 'degraded',
            details: { database: 'backend-api', connected: false, error: error.message, fallback: 'localStorage' }
          };
        }
      }
      
      // localStorage health check
      const testKey = 'health_check_test';
      localStorage.setItem(testKey, 'test');
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      return {
        status: testValue === 'test' ? 'healthy' : 'degraded',
        details: { storage: 'localStorage', available: testValue === 'test' }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error.message }
      };
    }
  }
}

// Export singleton instance
export const database = new DatabaseService();

// Export utility functions
export const bookmarkItem = async (type: UserBookmark['type'], itemId: string, title: string, description?: string, url?: string) => {
  return await database.addBookmark({ type, itemId, title, description, url });
};

export const unbookmarkItem = async (bookmarkId: string) => {
  return await database.removeBookmark(bookmarkId);
};

export const subscribeToNewsletter = async (subscriptionData: Omit<NewsletterSubscription, 'id' | 'createdAt'>) => {
  return await database.addNewsletterSubscription(subscriptionData);
};

export const trackAction = async (action: string, details?: any) => {
  return await database.trackUserAction(action, details);
};