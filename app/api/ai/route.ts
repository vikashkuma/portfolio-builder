import { NextRequest, NextResponse } from 'next/server';
import { PortfolioStep } from '../../types/portfolio';

interface AIResponse {
  content: any;
  suggestions?: string[];
}

// Mock AI responses for different sections
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, section, input, provider, config } = body;

    // Handle different actions
    switch (action) {
      case 'generate_content':
        return await handleGenerateContent(section, input);
      case 'get_available_models':
        return await handleGetAvailableModels();
      case 'switch_model':
        return await handleSwitchModel(provider, config);
      default:
        // Legacy support for direct content generation
        if (section && input) {
          return await handleGenerateContent(section, input);
        }
        return NextResponse.json(
          { error: 'Invalid action or missing required fields' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleGenerateContent(section: string, input: string) {
  if (!section || !input) {
    return NextResponse.json(
      { error: 'Missing required fields: section and input' },
      { status: 400 }
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResponse = mockAIResponses[section as PortfolioStep]?.(input);
  
  if (!mockResponse) {
    return NextResponse.json(
      { error: 'Invalid section' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: mockResponse
  });
}

async function handleGetAvailableModels() {
  try {
    // Try to connect to MCP server
    const mcpServerUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001';
    
    const response = await fetch(`${mcpServerUrl}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        models: data.models || [],
        current: data.current || null
      });
    } else {
      // Fallback to mock data if MCP server is not available
      return NextResponse.json({
        success: true,
        models: [
          {
            name: 'mock-model',
            provider: 'mock',
            available: true,
            cost: null,
            error: 'MCP server not available'
          },
          {
            name: 'ollama-model',
            provider: 'ollama',
            available: false,
            cost: null,
            error: 'Ollama not running or not configured'
          },
          {
            name: 'openai-model',
            provider: 'openai',
            available: false,
            cost: null,
            error: 'OpenAI API key not configured'
          }
        ],
        current: {
          name: 'mock-model',
          provider: 'mock'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to mock data
    return NextResponse.json({
      success: true,
      models: [
        {
          name: 'mock-model',
          provider: 'mock',
          available: true,
          cost: null,
          error: 'MCP server not available'
        },
        {
          name: 'ollama-model',
          provider: 'ollama',
          available: false,
          cost: null,
          error: 'Ollama not running or not configured'
        },
        {
          name: 'openai-model',
          provider: 'openai',
          available: false,
          cost: null,
          error: 'OpenAI API key not configured'
        }
      ],
      current: {
        name: 'mock-model',
        provider: 'mock'
      }
    });
  }
}

async function handleSwitchModel(provider: string, config?: any) {
  try {
    const mcpServerUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001';
    
    const response = await fetch(`${mcpServerUrl}/switch-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        config
      })
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        model: data.model || { name: 'mock-model', provider: 'mock' }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to switch model'
      });
    }
  } catch (error) {
    console.error('Error switching model:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to switch model'
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    models: [
      {
        name: 'mock-model',
        provider: 'mock',
        available: true,
        cost: null,
        config: {
          temperature: 0.7,
          maxTokens: 500
        }
      }
    ],
    current: {
      name: 'mock-model',
      provider: 'mock'
    }
  });
} 