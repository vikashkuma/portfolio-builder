import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool 
} from '@modelcontextprotocol/sdk/types.js';
import { ModelFactory, DEFAULT_MODEL_CONFIGS } from './models/index.js';
import { AIRequest, AIResponse } from './types.js';
import { z } from 'zod';

export class PortfolioBuilderMCPServer {
  private server: Server;
  private model: any;

  constructor() {
    this.server = new Server(
      {
        name: 'portfolio-builder-mcp-server',
        version: '1.0.0',
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_portfolio_content',
            description: 'Generate AI content for portfolio sections',
            inputSchema: {
              type: 'object',
              properties: {
                section: {
                  type: 'string',
                  enum: ['about', 'experience', 'education', 'skills', 'awards', 'testimonials', 'contact'],
                  description: 'The portfolio section to generate content for'
                },
                input: {
                  type: 'string',
                  description: 'User input or context for the section'
                },
                context: {
                  type: 'object',
                  description: 'Additional context for the generation',
                  additionalProperties: true
                }
              },
              required: ['section', 'input']
            }
          },
          {
            name: 'get_available_models',
            description: 'Get list of available AI models and their status',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'switch_model',
            description: 'Switch to a different AI model provider',
            inputSchema: {
              type: 'object',
              properties: {
                provider: {
                  type: 'string',
                  enum: ['mock', 'ollama', 'openai'],
                  description: 'The model provider to switch to'
                },
                config: {
                  type: 'object',
                  description: 'Configuration for the model',
                  additionalProperties: true
                }
              },
              required: ['provider']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'generate_portfolio_content':
          return await this.handleGenerateContent(args);
          
        case 'get_available_models':
          return await this.handleGetAvailableModels();
          
        case 'switch_model':
          return await this.handleSwitchModel(args);
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async handleGenerateContent(args: any) {
    try {
      const { section, input, context } = args;
      
      if (!this.model) {
        this.model = await ModelFactory.createBestAvailableModel(DEFAULT_MODEL_CONFIGS);
      }

      const request: AIRequest = {
        section,
        input,
        context
      };

      const response: AIResponse = await this.model.generate(request);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              content: response.content,
              suggestions: response.suggestions,
              metadata: response.metadata
            })
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleGetAvailableModels() {
    const models = [];
    
    // Check each model configuration
    for (const config of DEFAULT_MODEL_CONFIGS) {
      try {
        const model = await ModelFactory.createModel(config);
        const isAvailable = await model.isAvailable();
        
        models.push({
          name: config.name,
          provider: config.provider,
          available: isAvailable,
          cost: isAvailable ? model.getCostEstimate(100) : null
        });
      } catch (error) {
        models.push({
          name: config.name,
          provider: config.provider,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ models })
        }
      ]
    };
  }

  private async handleSwitchModel(args: any) {
    try {
      const { provider, config } = args;
      
      const modelConfig = {
        name: config?.name || 'default',
        provider,
        ...config
      };

      this.model = await ModelFactory.createModel(modelConfig);
      
      if (!(await this.model.isAvailable())) {
        throw new Error(`Model ${provider} is not available`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              model: this.model.name,
              provider: this.model.provider
            })
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to switch model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Initialize the default model
    this.model = await ModelFactory.createBestAvailableModel(DEFAULT_MODEL_CONFIGS);
    
    console.error('Portfolio Builder MCP Server started');
  }
}

// Start the server
const server = new PortfolioBuilderMCPServer();
server.run().catch(console.error); 