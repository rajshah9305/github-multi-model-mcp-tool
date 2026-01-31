#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 GitHub MCP Frontend - Startup Validation');
console.log('===========================================\n');

let hasErrors = false;

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
console.log(`📦 Node.js version: ${nodeVersion}`);
if (majorVersion < 18) {
  console.log('❌ Node.js 18+ is required');
  hasErrors = true;
} else {
  console.log('✅ Node.js version is compatible');
}

// Check environment variables
console.log('\n🔧 Environment Variables:');
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: configured`);
  } else {
    console.log(`❌ ${envVar}: missing (required)`);
    hasErrors = true;
  }
});

// Check critical files
console.log('\n📁 Critical Files:');
const criticalFiles = [
  '../package.json',
  '../client/vite.config.ts',
  '../tsconfig.json',
  '../client/src/main.tsx',
  '../client/src/App.tsx',
  '../server/routers.ts',
  'setup-db.js'
];

criticalFiles.forEach(file => {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}: exists`);
  } else {
    console.log(`❌ ${file}: missing`);
    hasErrors = true;
  }
});

// Database URL validation
if (process.env.DATABASE_URL) {
  console.log('\n🗄️  Database Configuration:');
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log(`✅ Protocol: ${dbUrl.protocol}`);
    console.log(`✅ Host: ${dbUrl.hostname}:${dbUrl.port || 3306}`);
    console.log(`✅ Database: ${dbUrl.pathname.slice(1)}`);
    console.log(`✅ User: ${dbUrl.username}`);
    console.log(`✅ Password: ${dbUrl.password ? '***' : 'not set'}`);
  } catch (error) {
    console.log('❌ Invalid DATABASE_URL format');
    console.log('💡 Expected: mysql://user:password@host:port/database');
    hasErrors = true;
  }
}

// Summary
console.log('\n📋 Summary:');
if (hasErrors) {
  console.log('❌ Startup validation failed. Please fix the issues above.');
  console.log('\n🔧 Quick fixes:');
  console.log('1. Copy .env.example to .env and configure it');
  console.log('2. Make sure MySQL is running');
  console.log('3. Run: pnpm install');
  console.log('4. Run: pnpm setup-db');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Ready to start the application.');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: pnpm setup-db (if not done already)');
  console.log('2. Run: pnpm dev:full');
  console.log('3. Open: http://localhost:5173');
  console.log('4. Configure GitHub PAT and LLM API key in Settings');
}
