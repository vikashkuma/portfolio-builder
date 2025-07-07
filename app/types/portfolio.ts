export interface About {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface Contact {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface Portfolio {
  id: string;
  about: About;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  awards: Award[];
  testimonials: Testimonial[];
  contact: Contact;
  theme: 'light' | 'dark' | 'modern' | 'minimal';
  layout: 'single-page' | 'navigation';
  createdAt: string;
  updatedAt: string;
}

export type PortfolioStep = 
  | 'about'
  | 'experience'
  | 'education'
  | 'skills'
  | 'awards'
  | 'testimonials'
  | 'contact'
  | 'preview'; 