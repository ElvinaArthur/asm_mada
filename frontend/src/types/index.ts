export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  institution?: string;
  location?: string;
  expertise?: string;
  publicationsCount?: number;
  memberSince?: string;
  isVerified: boolean | number;
  avatarColor?: string;
  role: 'user' | 'admin';
  graduationYear?: number;
  specialization?: string;
  isActive?: boolean;
  lastLogin?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  phone2?: string;
  birthDate?: string;
  birthYear?: number;
  currentPosition?: string;
  company?: string;
  bio?: string;
  academicBackground?: Record<string, unknown>;
  academicEducations?: unknown[];
  previousPositions?: unknown[];
  privacy?: Record<string, unknown>;
  proof_status?: 'pending' | 'approved' | 'rejected';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  category: string;
  year?: number;
  pages?: number;
  readTime?: string;
  fileName: string;
  thumbnail?: string;
  views: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  imageUrl?: string;
  maxParticipants?: number;
  isPublished: boolean;
  created_at: string;
  updated_at: string;
  participantsCount?: number;
}

export interface Activity {
  id: number;
  userId: number;
  type: 'login' | 'book_read' | 'book_added' | 'event_registered' | 'profile_updated';
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface UserBook {
  id: number;
  userId: number;
  bookId: number;
  status: 'reading' | 'read' | 'to-read';
  isFavorite: boolean;
  currentPage: number;
  dateRead?: string;
  addedAt: string;
  updatedAt: string;
  book?: Book;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  photoUrl?: string;
}

export interface JWTPayload {
  id: number;
  role: 'user' | 'admin';
  isVerified: boolean;
  iat?: number;
  exp?: number;
}
