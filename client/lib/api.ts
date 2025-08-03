// API configuration for LanguageKonnect
export const API_CONFIG = {
  BASE_URL: '', // Use relative URLs for local API
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    GET_PROFILE: '/api/auth/profile',
    USER_PROFILE: '/api/user/profile',
    CONTEST_ENTRY: '/api/contest/entry',
    CONTEST_LEADERBOARD: '/api/contest/leaderboard',
    CONTEST_VOTE: '/api/contest/vote',
    CONTEST_VOTES: '/api/contest/votes',
    RAFFLE_ENTRY: '/api/raffle-entry',
    REFERRAL_LEADERBOARD: '/api/referral/leaderboard',
  },
  // Auth token should be obtained from Slack - placeholder for now
  AUTH_TOKEN: import.meta.env.VITE_API_TOKEN || 'your-token-here',
  CACHE_DURATION: 60000, // 60 seconds
};

// Response types based on the API specification
export interface UserProfile {
  name: string;
  email: string;
  nativeLanguages: string[];
  targetLanguages: string[];
  experienceLevel: string;
  profilePicture?: string;
  videoIntro?: string;
}

export interface ContestEntry {
  id: string;
  language: string;
  region: string;
  caption: string;
  videoUrl: string;
  votes: number;
  createdAt: string;
  userId: string;
}

export interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  rank: number;
  language?: string;
  region?: string;
}

export interface RaffleEntry {
  userId: string;
  referralId: string;
  ticketCount: number;
}

export interface ReferralStats {
  userId: string;
  referralId: string;
  totalReferrals: number;
  ticketsEarned: number;
  rank: number;
}

// API utility class
class LanguageKonnectAPI {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.authToken = API_CONFIG.AUTH_TOKEN;
  }

  // Helper method to make API requests
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {};

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    // Only add auth header if we have a valid token
    if (this.authToken && this.authToken !== 'your-token-here') {
      defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch {
        errorText = `HTTP ${response.status} ${response.statusText}`;
      }
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // Handle empty responses - check content type before reading body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as T;
  }

  // Voting endpoints
  async voteOnEntry(entryId: string, userId: string, action: 'like' | 'unlike'): Promise<{ success: boolean; votes: number; isLiked: boolean }> {
    try {
      const result = await this.makeRequest<{ success: boolean; votes: number; isLiked: boolean }>(
        API_CONFIG.ENDPOINTS.CONTEST_VOTE,
        {
          method: 'POST',
          body: JSON.stringify({ entryId, userId, action }),
        }
      );

      console.log('Vote processed:', result);
      return result;
    } catch (error) {
      console.error('Error processing vote:', error);
      throw error;
    }
  }

  async getVotes(entryId: string): Promise<{ success: boolean; votes: number }> {
    try {
      const result = await this.makeRequest<{ success: boolean; votes: number }>(
        `${API_CONFIG.ENDPOINTS.CONTEST_VOTES}/${entryId}`
      );

      return result;
    } catch (error) {
      console.error('Error fetching votes:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const result = await this.makeRequest<{ success: boolean; message: string; user?: any }>(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );

      console.log('User login successful:', result);
      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<{ success: boolean; user?: any }> {
    try {
      const result = await this.makeRequest<{ success: boolean; user?: any }>(
        `${API_CONFIG.ENDPOINTS.GET_PROFILE}/${userId}`
      );

      console.log('User profile fetched:', result);
      return result;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // User Profile endpoints
  async createUserProfile(profileData: UserProfile): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result = await this.makeRequest<{ success: boolean; message: string }>(
        API_CONFIG.ENDPOINTS.USER_PROFILE,
        {
          method: 'POST',
          body: JSON.stringify(profileData),
        }
      );
      
      console.log('User profile created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Contest endpoints
  async submitContestEntry(entryData: {
    language: string;
    region: string;
    caption: string;
    videoFile: File;
  }): Promise<{ success: boolean; entryId: string }> {
    try {
      const formData = new FormData();
      formData.append('language', entryData.language);
      formData.append('region', entryData.region);
      formData.append('caption', entryData.caption);
      formData.append('video', entryData.videoFile);

      const result = await this.makeRequest<{ success: boolean; entryId: string }>(
        API_CONFIG.ENDPOINTS.CONTEST_ENTRY,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Contest entry submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting contest entry:', error);
      throw error;
    }
  }

  async getContestLeaderboard(filters?: {
    sortBy?: 'votes' | 'recent' | 'rating';
    language?: string;
    region?: string;
  }): Promise<LeaderboardEntry[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const url = `${API_CONFIG.ENDPOINTS.CONTEST_LEADERBOARD}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await this.makeRequest<LeaderboardEntry[]>(url);
      
      console.log('Contest leaderboard fetched:', result);
      return result;
    } catch (error) {
      console.error('Error fetching contest leaderboard:', error);
      throw error;
    }
  }

  // Raffle and referral endpoints
  async submitRaffleEntry(referralId: string): Promise<{ success: boolean; ticketsEarned: number }> {
    try {
      const result = await this.makeRequest<{ success: boolean; ticketsEarned: number }>(
        API_CONFIG.ENDPOINTS.RAFFLE_ENTRY,
        {
          method: 'POST',
          body: JSON.stringify({ referralId }),
        }
      );

      console.log('Raffle entry submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting raffle entry:', error);
      throw error;
    }
  }

  async getReferralLeaderboard(): Promise<ReferralStats[]> {
    try {
      const result = await this.makeRequest<ReferralStats[]>(
        API_CONFIG.ENDPOINTS.REFERRAL_LEADERBOARD
      );
      
      console.log('Referral leaderboard fetched:', result);
      return result;
    } catch (error) {
      console.error('Error fetching referral leaderboard:', error);
      throw error;
    }
  }

  // Utility method to generate unique referral ID
  generateReferralId(userId: string): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${userId}-${timestamp}-${randomStr}`.toUpperCase();
  }
}

// Export a singleton instance
export const api = new LanguageKonnectAPI();

// Auto-refresh functionality for live updates
export class LiveDataManager {
  private refreshInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, (() => void)[]> = new Map();

  startAutoRefresh(endpoint: string, callback: () => void, interval: number = 300000) { // 5 minutes default
    const key = endpoint;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key)!.push(callback);

    // Start refresh interval if not already running
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(() => {
        this.listeners.forEach((callbacks) => {
          callbacks.forEach(cb => cb());
        });
      }, interval);
    }
  }

  stopAutoRefresh(endpoint: string, callback: () => void) {
    const key = endpoint;
    const callbacks = this.listeners.get(key);
    
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.listeners.delete(key);
      }
    }

    // Stop interval if no listeners
    if (this.listeners.size === 0 && this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.listeners.clear();
  }
}

export const liveDataManager = new LiveDataManager();
