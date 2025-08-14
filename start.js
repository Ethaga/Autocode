#!/usr/bin/env node

// Simple production starter for Railway
import { spawn } from 'child_process';

console.log('Starting CodeGuard production server...');

// Start the production server directly
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NODE_ENV: 'production',
    PORT: process.env.PORT || 5000
  }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});