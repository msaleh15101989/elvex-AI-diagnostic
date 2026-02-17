
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface UserData {
  fullName: string;
  email: string;
  industry: string;
  role: string;
  yearsExperience: string;
  location: string;
}

export interface Question {
  id: number;
  part: string;
  text: string;
  subtext?: string;
  type: 'choice' | 'scale';
  options?: Record<OptionKey, string>;
  min?: number;
  max?: number;
}

export interface UserAnswers {
  [key: number]: string | number;
}

export interface FrameworkMetadata {
  name: string;
  owner: string;
  author: string;
  tagline: string;
}
