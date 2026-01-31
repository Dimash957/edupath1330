
export enum AppTab {
  DASHBOARD = 'dashboard',
  ASSESSMENT = 'assessment',
  UNIVERSITIES = 'universities',
  ROADMAP = 'roadmap',
  MENTOR = 'mentor',
  PROFILE = 'profile',
}

export interface User {
  email: string;
  isVerified: boolean;
  name: string;
  lastName?: string;
  desiredSurname?: string;
  profileImage?: string;
  sportIdol?: {
    name: string;
    image: string;
  };
}

export type ProgramLevel = 'Bachelor' | 'Master' | 'Doctorate' | 'Associate';

export interface University {
  id: string;
  name: string;
  location: string;
  region: 'Americas' | 'Europe' | 'Asia' | 'Oceania';
  rating: number;
  programs: string[];
  requirements: string[];
  minSat: number;
  minIelts: number;
  feeRange: string;
  image: string;
  placementRate: string;
  duration: string;
  programType: ProgramLevel;
}

export interface RoadmapStep {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  type: 'Exam' | 'Submission' | 'Document' | 'Result' | 'Program';
}

export interface CareerScenario {
  title: string;
  description: string;
  whyMatch: string;
  marketDemand: 'High' | 'Very High' | 'Emerging';
}

export interface AssessmentResult {
  unifiedCareer: string;
  recommendedMajor: string;
  rationale: string;
  scenarios: CareerScenario[];
  academicTargets: {
    sat: number;
    ielts: number;
    gpa: string;
  };
  skillsToImprove: string[];
  summerPrograms: {
    name: string;
    description: string;
  }[];
  suggestedUniversities: string[];
  locationPreference?: 'Americas' | 'Europe' | 'Asia' | 'Oceania' | 'Global';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface MediationResult {
  idealCareer: string;
  whyStudentLovesIt: string;
  whyParentApproves: string;
  compromiseExplanation: string;
  suggestedUniversities: string[];
}
