export interface PortfolioSection {
  about: AboutSection;
  experience: ExperienceSection;
  education: EducationSection;
  skills: SkillsSection;
  awards: AwardsSection;
  testimonials: TestimonialsSection;
  contact: ContactSection;
}

export interface AboutSection {
  name: string;
  role: string;
  bio: string;
}

export interface ExperienceSection {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
}

export interface EducationSection {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface SkillsSection {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface AwardsSection {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface TestimonialsSection {
  name: string;
  role: string;
  company: string;
  content: string;
}

export interface ContactSection {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  address?: string;
}

export interface AIRequest {
  section: keyof PortfolioSection;
  input: string;
  context?: any;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  metadata?: {
    model: string;
    tokens: number;
    cost?: number;
  };
}

export interface ModelConfig {
  name: string;
  provider: 'ollama' | 'openai' | 'mock';
  endpoint?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface PromptTemplate {
  section: keyof PortfolioSection;
  template: string;
  examples?: string[];
} 