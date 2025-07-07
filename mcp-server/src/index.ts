#!/usr/bin/env node

import { PortfolioBuilderMCPServer } from './server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    const server = new PortfolioBuilderMCPServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main(); 