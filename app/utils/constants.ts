export const MAX_PORTFOLIO_LENGTH = 2000
export const MAX_TITLE_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 500

export const DEFAULT_PORTFOLIO = {
  id: '',
  about: {
    name: '',
    role: '',
    bio: '',
  },
  experiences: [],
  education: [],
  skills: [],
  awards: [],
  testimonials: [],
  contact: {
    email: '',
  },
  theme: 'light' as const,
  layout: 'single-page' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "UI/UX Design",
  "Project Management",
  "Agile",
  "DevOps",
  "Machine Learning",
] as const 