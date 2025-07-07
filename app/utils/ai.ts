import { About, Experience, Education, Skill, Award, Testimonial, PortfolioStep } from '../types/portfolio';

interface AIResponse {
  content: Partial<About | Experience[] | Education[] | Skill[] | Award[] | Testimonial[]>;
  suggestions?: string[];
}

// Section-specific prompt templates moved here from server-side
const prompts: Record<string, (input: string) => string> = {
  about: (input) =>
    `Generate a professional bio section for a portfolio based on the following input. Respond with plain text only — no explanations, bullet points, numbers, or formatting tags.\n\n${input}`,
  experience: (input) =>
    `Generate a concise experience/role/achievement section for a portfolio based on the input below. Output plain text only, without bullet points, numbers, <think> blocks, or any other formatting.\n\n${input}`,
  education: (input) =>
    `Generate a clean education section for a portfolio based on this input. Do not include bullet points, numbering, <think> blocks, or any formatting. Output plain text only.\n\n${input}`,
  skills: (input) =>
    `Generate a List of only the relevant skills related to ${input} for a portfolio based on this input. Output a plain, comma-separated list of skills. Do not include sentence, bullet points, numbering, <think> blocks, or any explanation.`,
  awards: (input) =>
    `Generate an awards or recognition section for a portfolio. Respond with plain text only. Do not include bullet points, numbers, <think> blocks, or any formatting.\n\n${input}`,
  testimonials: (input) =>
    `Generate a testimonial suitable for a personal portfolio. Output only the testimonial content. Avoid any formatting, bullet points, <think> blocks, or explanations.\n\n${input}`,
  contact: (input) =>
    `Generate a simple contact section for a portfolio using the input below. Provide only the contact details as plain text — no extra formatting, no <think> blocks, no bullet points.\n\n${input}`,
  preview: (input) =>
    `Generate a short summary preview for a portfolio. Output only plain text content. Do not include bullet points, <think> blocks, or any extra formatting.\n\n${input}`,
};

const mockAIResponses: Record<PortfolioStep, (input: string) => AIResponse> = {
  about: (input: string) => ({
    content: {
      name: "John Doe",
      role: "Senior Full Stack Developer",
      bio: "I am a passionate full-stack developer with over 12 years of experience in building scalable web applications. I specialize in React, Node.js, and Next.js, with a strong focus on creating intuitive user experiences and robust backend systems.",
    },
    suggestions: ['Add more specific achievements', 'Include your core values', 'Mention your leadership experience'],
  }),
  experience: (input: string) => ({
    content: [{
      company: "Tech Corp",
      position: "Senior Full Stack Developer",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Led the development of enterprise-level applications using React and Node.js, resulting in a 40% increase in user engagement. Implemented CI/CD pipelines that reduced deployment time by 60%. Mentored junior developers and conducted code reviews to maintain high code quality standards.",
      achievements: [
        "Increased user engagement by 40%",
        "Reduced deployment time by 60%",
        "Mentored 5 junior developers"
      ]
    }],
    suggestions: ['Quantify your achievements', 'Add more technical details', 'Include team size'],
  }),
  education: (input: string) => ({
    content: [{
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2010-09",
      endDate: "2014-06",
      description: "Specialized in Software Engineering with a focus on web development and distributed systems."
    }],
    suggestions: ['Add relevant coursework', 'Include GPA if notable', 'Mention academic achievements'],
  }),
  skills: (input: string) => ({
    content: [
      { name: "React", level: "expert", category: "Frontend" },
      { name: "Node.js", level: "expert", category: "Backend" },
      { name: "TypeScript", level: "advanced", category: "Frontend" },
      { name: "AWS", level: "advanced", category: "DevOps" }
    ],
    suggestions: ['Add proficiency levels', 'Group by category', 'Include soft skills'],
  }),
  awards: (input: string) => ({
    content: [{
      title: "Best Developer Award",
      issuer: "Tech Excellence Conference",
      date: "2023",
      description: "Recognized for outstanding contributions to open-source projects and technical leadership."
    }],
    suggestions: ['Add context for each award', 'Include impact metrics', 'Mention selection criteria'],
  }),
  testimonials: (input: string) => ({
    content: [{
      name: "John Smith",
      role: "CTO",
      company: "Tech Corp",
      content: "An exceptional developer who consistently delivers high-quality solutions. Their technical expertise and leadership skills have been instrumental in our project's success.",
    }],
    suggestions: ['Add more specific examples', 'Include project context', 'Mention collaboration style'],
  }),
  contact: (input: string) => ({
    content: {
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      website: "johndoe.dev"
    } as any,
    suggestions: ['Add social media links', 'Include preferred contact method', 'Add availability information'],
  }),
  preview: (input: string) => ({
    content: {},
    suggestions: ['Review all sections', 'Check for consistency', 'Test all links'],
  }),
};

export const generateAIContent = async (
  section: PortfolioStep,
  input: string
): Promise<AIResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return mockAIResponses[section](input);
};

export const enhanceContent = async (
  section: PortfolioStep,
  content: string
): Promise<AIResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return mockAIResponses[section](content);
};

// MCP Server configuration
const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001';

export const generateContent = async (section: string, input: string): Promise<string> => {
  try {
    // Try MCP server first
    const response = await fetch(`${MCP_SERVER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        section, 
        input,
        context: { timestamp: Date.now() }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.content) {
        return data.data.content;
      }
    }

    // Fallback to mock responses if MCP server is not available
    console.warn('MCP server not available, using mock responses');
    const mockResponse = mockAIResponses[section as PortfolioStep]?.(input);
    if (mockResponse?.content) {
      if ('bio' in mockResponse.content && mockResponse.content.bio) {
        return mockResponse.content.bio;
      }
      if ('description' in mockResponse.content && typeof mockResponse.content.description === 'string') {
        return mockResponse.content.description;
      }
    }
    return input;

  } catch (error) {
    console.error('Error calling MCP server:', error);
    
    // Fallback to mock responses
    const mockResponse = mockAIResponses[section as PortfolioStep]?.(input);
    if (mockResponse?.content) {
      if ('bio' in mockResponse.content && mockResponse.content.bio) {
        return mockResponse.content.bio;
      }
      if ('description' in mockResponse.content && typeof mockResponse.content.description === 'string') {
        return mockResponse.content.description;
      }
    }
    return input;
  }
};

// New function to get available models
export const getAvailableModels = async () => {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/models`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error getting available models:', error);
  }
  
  return {
    success: false,
    models: [],
    current: null
  };
};

// New function to switch models
export const switchModel = async (provider: string, config?: any) => {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/switch-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, config }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error switching model:', error);
  }
  
  return { success: false };
};
