import express, { Request, Response } from 'express';
import cors from 'cors';
import { ModelFactory, DEFAULT_MODEL_CONFIGS } from './models/index.js';
import { AIRequest, AIResponse } from './types.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Global model instance
let currentModel: any = null;

// Initialize the model
async function initializeModel() {
  try {
    currentModel = await ModelFactory.createBestAvailableModel(DEFAULT_MODEL_CONFIGS);
    console.log(`Initialized model: ${currentModel.provider} - ${currentModel.name}`);
  } catch (error) {
    console.error('Failed to initialize model:', error);
    currentModel = await ModelFactory.createModel({
      name: 'mock-model',
      provider: 'mock',
      temperature: 0.7,
      maxTokens: 500
    });
  }
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    model: currentModel ? {
      name: currentModel.name,
      provider: currentModel.provider
    } : null,
    timestamp: new Date().toISOString()
  });
});

// Generate content endpoint
app.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { section, input, context } = req.body;

    if (!section || !input) {
      res.status(400).json({
        error: 'Missing required fields: section and input'
      });
      return;
    }

    if (!currentModel) {
      await initializeModel();
    }

    const request: AIRequest = {
      section,
      input,
      context
    };

    const response: AIResponse = await currentModel.generate(request);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get available models endpoint
app.get('/models', async (req: Request, res: Response) => {
  try {
    const models = [];
    
    for (const config of DEFAULT_MODEL_CONFIGS) {
      try {
        const model = await ModelFactory.createModel(config);
        const isAvailable = await model.isAvailable();
        
        models.push({
          name: config.name,
          provider: config.provider,
          available: isAvailable,
          cost: isAvailable ? model.getCostEstimate(100) : null,
          config: {
            temperature: config.temperature,
            maxTokens: config.maxTokens
          }
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

    res.json({
      success: true,
      models,
      current: currentModel ? {
        name: currentModel.name,
        provider: currentModel.provider
      } : null
    });

  } catch (error) {
    console.error('Models error:', error);
    res.status(500).json({
      error: 'Failed to get models',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Switch model endpoint
app.post('/switch-model', async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, config } = req.body;

    if (!provider) {
      res.status(400).json({
        error: 'Missing required field: provider'
      });
      return;
    }

    const modelConfig = {
      name: config?.name || 'default',
      provider,
      ...config
    };

    const newModel = await ModelFactory.createModel(modelConfig);
    
    if (!(await newModel.isAvailable())) {
      res.status(400).json({
        error: `Model ${provider} is not available`
      });
      return;
    }

    currentModel = newModel;

    res.json({
      success: true,
      model: {
        name: currentModel.name,
        provider: currentModel.provider
      }
    });

  } catch (error) {
    console.error('Switch model error:', error);
    res.status(500).json({
      error: 'Failed to switch model',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
async function startServer() {
  await initializeModel();
  
  app.listen(PORT, () => {
    console.log(`MCP HTTP Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Generate content: http://localhost:${PORT}/generate`);
    console.log(`Available models: http://localhost:${PORT}/models`);
  });
}

startServer().catch(console.error); 