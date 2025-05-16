export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  headline?: string;
  token?: string;
  age?: string;
  location?: string;
  specialty?: string;
  profession?: string;
  bio?: string;
  interests?: string;
  isVisible?: boolean;
  onboardingComplete?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface VideoCall {
  id: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'call' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
  relatedEntityId?: string;
}

export interface MatchPreference {
  userId: string;
  specialties: string[];
  locations: string[];
  languages: string[];
  expertiseLevels: string[];
}