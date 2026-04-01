/**
 * Core domain models for the Angular Tutorial Examples application.
 * Following TypeScript best practices: explicit types, readonly where applicable,
 * discriminated unions, and strict interfaces.
 */

export interface TopicMeta {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly difficulty: Difficulty;
  readonly exampleCount: number;
  readonly tags: readonly string[];
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Example {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly concepts: readonly string[];
}

export interface ExerciseChallenge {
  readonly prompt: string;
  readonly hints: readonly string[];
}

// ─── User / Profile Models (used in examples) ──────────────
export interface User {
  readonly id: number;
  name: string;
  email: string;
  role: UserRole;
  readonly createdAt: Date;
  avatar?: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

// ─── Product Models (used in examples) ─────────────────────
export interface Product {
  readonly id: number;
  name: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
  rating: number;
  description: string;
}

export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'food' | 'sports';

// ─── Task / Todo Models (used in examples) ──────────────────
export interface Task {
  readonly id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  dueDate?: Date;
}

export type Priority = 'low' | 'medium' | 'high';

// ─── API Response Wrapper ────────────────────────────────────
export interface ApiResponse<T> {
  readonly data: T;
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// ─── Form Models ─────────────────────────────────────────────
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeToTerms: boolean;
}

// ─── Navigation ───────────────────────────────────────────────
export interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly badge?: string;
}
