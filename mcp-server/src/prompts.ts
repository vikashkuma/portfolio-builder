import { PromptTemplate } from './types.js';

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  about: {
    section: 'about',
    template: `Generate a professional bio section for a portfolio based on the following input. 
Respond with plain text only — no explanations, bullet points, numbers, or formatting tags.

Input: {input}

Generate a compelling professional bio that highlights the person's expertise, experience, and value proposition.`,
    examples: [
      "Name: John Doe\nRole: Senior Full Stack Developer\nBio: I am a passionate full-stack developer with over 12 years of experience in building scalable web applications. I specialize in React, Node.js, and Next.js, with a strong focus on creating intuitive user experiences and robust backend systems."
    ]
  },
  
  experience: {
    section: 'experience',
    template: `Generate a concise experience/role/achievement section for a portfolio based on the input below. 
Output plain text only, without bullet points, numbers, or any other formatting.

Input: {input}

Generate a professional experience description that highlights key achievements and responsibilities.`,
    examples: [
      "Led the development of enterprise-level applications using React and Node.js, resulting in a 40% increase in user engagement. Implemented CI/CD pipelines that reduced deployment time by 60%. Mentored junior developers and conducted code reviews to maintain high code quality standards."
    ]
  },
  
  education: {
    section: 'education',
    template: `Generate a clean education section for a portfolio based on this input. 
Do not include bullet points, numbering, or any formatting. Output plain text only.

Input: {input}

Generate a professional education description that highlights relevant coursework and achievements.`,
    examples: [
      "Specialized in Software Engineering with a focus on web development and distributed systems. Completed coursework in Advanced Algorithms, Database Systems, and Software Architecture. Graduated with honors and completed a capstone project on scalable microservices architecture."
    ]
  },
  
  skills: {
    section: 'skills',
    template: `Generate a list of relevant skills related to {input} for a portfolio. 
Output a plain, comma-separated list of skills. Do not include sentences, bullet points, numbering, or any explanation.

Current skills: {input}

Generate additional relevant skills that complement the existing skill set.`,
    examples: [
      "React, TypeScript, Node.js, MongoDB, AWS, Docker, Git, Jest, Redux, GraphQL, PostgreSQL, Redis, Kubernetes, Terraform, Jenkins, Selenium, Cypress, Storybook, Webpack, Babel"
    ]
  },
  
  awards: {
    section: 'awards',
    template: `Generate an awards or recognition section for a portfolio. 
Respond with plain text only. Do not include bullet points, numbers, or any formatting.

Input: {input}

Generate a professional award description that highlights the significance and impact.`,
    examples: [
      "Recognized for outstanding contributions to open-source projects and technical leadership. Awarded for developing innovative solutions that improved system performance by 50% and reduced operational costs by 30%. Selected from over 500 candidates based on technical excellence and community impact."
    ]
  },
  
  testimonials: {
    section: 'testimonials',
    template: `Generate a testimonial suitable for a personal portfolio. 
Output only the testimonial content. Avoid any formatting, bullet points, or explanations.

Input: {input}

Generate a compelling testimonial that speaks to the person's skills, work ethic, and impact.`,
    examples: [
      "An exceptional developer who consistently delivers high-quality solutions. Their technical expertise and leadership skills have been instrumental in our project's success. They bring innovative thinking to every challenge and have a remarkable ability to mentor team members while maintaining high standards."
    ]
  },
  
  contact: {
    section: 'contact',
    template: `Generate a simple contact section for a portfolio using the input below. 
Provide only the contact details as plain text — no extra formatting, no bullet points.

Input: {input}

Generate professional contact information that encourages engagement.`,
    examples: [
      "I'm always open to discussing new opportunities, collaborations, or interesting projects. Feel free to reach out via email or connect with me on LinkedIn. I typically respond within 24 hours and am particularly interested in roles involving full-stack development, technical leadership, and innovative problem-solving."
    ]
  }
};

export function formatPrompt(template: string, input: string): string {
  return template.replace(/{input}/g, input);
}

export function getPromptForSection(section: string, input: string): string {
  const promptTemplate = PROMPT_TEMPLATES[section];
  if (!promptTemplate) {
    return `Generate content for ${section} based on: ${input}`;
  }
  
  return formatPrompt(promptTemplate.template, input);
} 