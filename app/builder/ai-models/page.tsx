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

        {/* AI Models Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FaRobot className="h-5 w-5 mr-2" />
              AI Model Status
            </h2>
            <Button
              onClick={loadModels}
              variant="outline"
              disabled={loading}
            >
              Refresh
            </Button>
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

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Model Recommendations</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>💡 <strong>Ollama</strong> is recommended for students (free, local)</p>
              <p>💡 <strong>Mock</strong> is always available for testing</p>
              <p>💡 <strong>OpenAI</strong> requires API credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 