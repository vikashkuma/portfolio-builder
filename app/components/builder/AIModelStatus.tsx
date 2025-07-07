'use client';

import { useState, useEffect } from 'react';
import { getAvailableModels, switchModel } from '../../utils/ai';
import toast from 'react-hot-toast';
import { FaRobot, FaCog, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

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

export const AIModelStatus = () => {
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
      <div className="flex items-center justify-center p-4 bg-background text-foreground border border-border rounded-lg">
        <FaCog className="animate-spin h-4 w-4 mr-2" />
        Loading AI models...
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center">
          <FaRobot className="h-4 w-4 mr-2" />
          AI Model Status
        </h3>
        <button
          onClick={loadModels}
          className="text-xs text-blue-600 hover:text-blue-700"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {currentModel && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg mr-2">{getModelIcon(currentModel.provider)}</span>
              <div>
                <p className="text-sm font-medium">Current Model</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentModel.name} ({currentModel.provider})
                </p>
              </div>
            </div>
            <FaCheck className="h-4 w-4 text-green-600" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {models.map((model, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              model.available
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">{getModelIcon(model.provider)}</span>
              <div>
                <p className={`text-sm font-medium ${getModelColor(model.provider)}`}>
                  {model.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {model.provider}
                  {model.cost !== null && model.cost !== undefined && (
                    <span className="ml-2">
                      {model.cost === 0 ? '(Free)' : `($${model.cost.toFixed(4)}/100 tokens)`}
                    </span>
                  )}
                </p>
                {model.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {model.error}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {model.available ? (
                <FaCheck className="h-4 w-4 text-green-600" />
              ) : (
                <FaExclamationTriangle className="h-4 w-4 text-red-600" />
              )}
              
              {model.available && currentModel?.provider !== model.provider && (
                <button
                  onClick={() => handleSwitchModel(model.provider)}
                  disabled={switching}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {switching ? 'Switching...' : 'Switch'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p>💡 <strong>Ollama</strong> is recommended for students (free, local)</p>
        <p>💡 <strong>Mock</strong> is always available for testing</p>
        <p>💡 <strong>OpenAI</strong> requires API credits</p>
      </div>
    </div>
  );
}; 