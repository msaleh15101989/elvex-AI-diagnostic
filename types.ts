export type LayerKey = 'elevate' | 'execute' | 'evolve';
export type StyleKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ChoiceQuestion {
  id: string;
  text: string;
  options: Record<StyleKey, string>;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  scope: 'personal' | 'organization';
}

export type Section =
  | { key: string; kind: 'choice'; title: string; description: string; questions: ChoiceQuestion[] }
  | { key: string; kind: 'scale'; layer: LayerKey; title: string; description: string; questions: ScaleQuestion[] };

export interface Contact {
  fullName: string;
  role: string;
  company: string;
  email: string;
  mobile: string;
  country: string;
  industry: string;
  orgSize: string;
  consent: boolean;
}

// Choice answers are 'A' to 'F'. Scale answers are 1 to 5, or 0 for "not sure".
export type Answers = Record<string, string | number>;

export interface SavedState {
  submissionId: string;
  contact: Contact;
  answers: Answers;
}

export interface StyleScore { key: StyleKey; name: string; count: number; share: number }

export interface ItemScore { id: string; text: string; value: number; scope: 'personal' | 'organization' }

export interface Results {
  readiness: number;
  band: { name: string; summary: string };
  layers: Record<LayerKey, number | null>;
  personal: number | null;
  organization: number | null;
  weakestLayer: LayerKey;
  pattern: { name: string; description: string };
  styles: StyleScore[];
  primary: StyleScore;
  secondary: StyleScore;
  tiedTop: boolean;     // primary and secondary chosen equally often
  rated: number;        // scale statements actually rated (not "not sure")
  gaps: ItemScore[];
  strengths: ItemScore[];
}
