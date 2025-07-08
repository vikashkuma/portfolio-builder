'use client';

import { useState, useEffect } from 'react';
import { getAvailableModels, switchModel } from '../../utils/ai';
import toast from 'react-hot-toast';
import { FaRobot, FaCog, FaCheck, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';

interface ModelInfo {
  name: string;
  provider: string;
  available: boolean;
  cost?: number;
  error?: string;
}

interface ModelsResponse {
  success: boolean;
  models: ModelInfo[];
  current: {
    name: string;
    provider: string;
  } | null;
}

export default function AIModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [currentModel, setCurrentModel] = useState<{ name: string; provider: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response: ModelsResponse = await getAvailableModels();
      
      if (response.success) {
        setModels(response.models);
        setCurrentModel(response.current);
      } else {
        toast.error('Failed to load AI models');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Failed to load AI models');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchModel = async (provider: string) => {
    try {
      setSwitching(true);
      const response = await switchModel(provider);
      
      if (response.success) {
        toast.success(`Switched to ${provider} model`);
        await loadModels(); // Refresh the list
      } else {
        toast.error(`Failed to switch to ${provider} model`);
      }
    } catch (error) {
      console.error('Error switching model:', error);
      toast.error(`Failed to switch to ${provider} model`);
    } finally {
      setSwitching(false);
    }
  };

  const getModelIcon = (provider: string) => {
    switch (provider) {
      case 'ollama':
        return '🦙';
      case 'openai':
        return '🤖';
      case 'mock':
        return '🎭';
      default:
        return '❓';
    }
  };

  const getModelColor = (provider: string) => {
    switch (provider) {
      case 'ollama':
        return 'text-green-600';
      case 'openai':
        return 'text-blue-600';
      case 'mock':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
            <FaCog className="animate-spin h-6 w-6 mr-3" />
            <span className="text-lg">Loading AI models...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mr-4"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">AI Models</h1>
          </div>
          <p className="text-gray-600">
            Manage and configure AI models for content generation in your portfolio builder.
          </p>
        </div>

        {/* Quick Setup Guide */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">⚡</span>
            Quick Setup Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">🦙 For Students (Recommended)</h4>
              <ol className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>1. Install Ollama</li>
                <li>2. Run: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">ollama pull llama3.1:8b</code></li>
                <li>3. Switch to Ollama below</li>
              </ol>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🤖 For Professionals</h4>
              <ol className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>1. Get OpenAI API key</li>
                <li>2. Configure MCP server</li>
                <li>3. Switch to OpenAI below</li>
              </ol>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">🎭 For Testing</h4>
              <ol className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>1. No setup required</li>
                <li>2. Always available</li>
                <li>3. Switch to Mock below</li>
              </ol>
            </div>
          </div>
        </div>

        {/* AI Models Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FaRobot className="h-5 w-5 mr-2" />
              AI Model Status
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${models.some(m => m.available) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {models.some(m => m.available) ? 'Models Available' : 'No Models Available'}
                </span>
              </div>
              <Button
                onClick={loadModels}
                variant="outline"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {currentModel && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getModelIcon(currentModel.provider)}</span>
                  <div>
                    <p className="text-lg font-medium">Current Model</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentModel.name} ({currentModel.provider})
                    </p>
                  </div>
                </div>
                <FaCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Available Models</h3>
            {models.map((model, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  model.available
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getModelIcon(model.provider)}</span>
                  <div>
                    <p className={`text-lg font-medium ${getModelColor(model.provider)}`}>
                      {model.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {model.provider}
                      {model.cost !== null && model.cost !== undefined && (
                        <span className="ml-2">
                          {model.cost === 0 ? '(Free)' : `($${model.cost.toFixed(4)}/100 tokens)`}
                        </span>
                      )}
                    </p>
                    {model.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {model.error}
                      </p>
                    )}
                    {!model.available && !model.error && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        {model.provider === 'ollama' ? 'Ollama not running or not configured' : 
                         model.provider === 'openai' ? 'OpenAI API key not configured' : 
                         'Model not available'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {model.available ? (
                    <FaCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                  )}
                  
                  {model.available && currentModel?.provider !== model.provider && (
                    <Button
                      onClick={() => handleSwitchModel(model.provider)}
                      disabled={switching}
                      variant="primary"
                      size="sm"
                    >
                      {switching ? 'Switching...' : 'Switch'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Model Information Section */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold mb-4">AI Model Information</h3>
            
            {/* OpenAI Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🤖</span>
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">OpenAI Models</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Professional AI models by OpenAI</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Available Models:</h5>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• GPT-4 Turbo (Latest)</li>
                    <li>• GPT-4 (High performance)</li>
                    <li>• GPT-3.5 Turbo (Cost-effective)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Features:</h5>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• High-quality content generation</li>
                    <li>• Advanced reasoning capabilities</li>
                    <li>• Professional writing style</li>
                    <li>• Real-time processing</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-200 dark:bg-blue-800 rounded">
                <h5 className="font-medium mb-2">Setup Instructions:</h5>
                <ol className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>1. Get an OpenAI API key from <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a></li>
                  <li>2. Add your API key to the MCP server configuration</li>
                  <li>3. Restart the MCP server</li>
                  <li>4. Switch to OpenAI model in this page</li>
                </ol>
              </div>
              
              <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                <strong>Cost:</strong> Pay-per-use pricing based on token usage
              </div>
            </div>

            {/* Ollama Section */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🦙</span>
                <div>
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Ollama Models</h4>
                  <p className="text-sm text-green-600 dark:text-green-300">Free, local AI models</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Available Models:</h5>
                  <ul className="space-y-1 text-green-700 dark:text-green-300">
                    <li>• Llama 3.1 (8B, 70B)</li>
                    <li>• Mistral (7B, 8x7B)</li>
                    <li>• Code Llama (7B, 13B, 34B)</li>
                    <li>• Phi-3 (Mini, Small, Medium)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Features:</h5>
                  <ul className="space-y-1 text-green-700 dark:text-green-300">
                    <li>• Completely free to use</li>
                    <li>• Runs locally on your computer</li>
                    <li>• No internet required after setup</li>
                    <li>• Privacy-focused</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-200 dark:bg-green-800 rounded">
                <h5 className="font-medium mb-2">Setup Instructions:</h5>
                <ol className="text-sm space-y-1 text-green-800 dark:text-green-200">
                  <li>1. Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">ollama.ai</a></li>
                  <li>2. Pull a model: <code className="bg-green-300 dark:bg-green-700 px-1 rounded">ollama pull llama3.1:8b</code></li>
                  <li>3. Start Ollama service</li>
                  <li>4. Switch to Ollama model in this page</li>
                </ol>
              </div>
              
              <div className="mt-3 text-xs text-green-600 dark:text-green-400">
                <strong>Cost:</strong> Completely free (requires local computing resources)
              </div>
            </div>

            {/* Mock Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎭</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Mock Models</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Testing and development mode</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Purpose:</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    <li>• Testing the application</li>
                    <li>• Development and debugging</li>
                    <li>• Demo purposes</li>
                    <li>• Offline functionality</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Features:</h5>
                  <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                    <li>• Always available</li>
                    <li>• Instant responses</li>
                    <li>• No API keys required</li>
                    <li>• Predictable outputs</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-800 rounded">
                <h5 className="font-medium mb-2">Usage:</h5>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Mock models are automatically available and don't require any setup. 
                  They provide sample content for testing the portfolio builder features.
                </p>
              </div>
              
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Cost:</strong> Free (built-in testing mode)
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Model Recommendations
              </h3>
              <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <p><strong>For Students:</strong> Use Ollama (free, local, privacy-focused)</p>
                <p><strong>For Professionals:</strong> Use OpenAI (high-quality, reliable)</p>
                <p><strong>For Testing:</strong> Use Mock (always available, instant)</p>
                <p><strong>For Privacy:</strong> Use Ollama (data stays on your computer)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 