#!/usr/bin/env node

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

// Parse the database URL
const url = new URL(DATABASE_URL);
const dbName = url.pathname.slice(1); // Remove leading slash

// Connection config without database name for initial setup
const connectionConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to MySQL server...');
    connection = await mysql.createConnection(connectionConfig);
    
    // Create database if it doesn't exist
    console.log(`📦 Creating database '${dbName}' if it doesn't exist...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    // Switch to the database
    await connection.execute(`USE \`${dbName}\``);
    
    // Create users table
    console.log('👥 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openId VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320),
        loginMethod VARCHAR(64),
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Create credentials table
    console.log('🔐 Creating credentials table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        githubPat TEXT,
        llmApiKey TEXT,
        llmModel VARCHAR(128) DEFAULT 'gpt-4o',
        llmBaseUrl VARCHAR(512) DEFAULT 'https://api.openai.com/v1',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create repository cache table
    console.log('📁 Creating repository cache table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS repositoryCache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        repoName VARCHAR(256) NOT NULL,
        description TEXT,
        defaultBranch VARCHAR(128) DEFAULT 'main',
        url VARCHAR(512),
        lastSyncedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create a default user for development
    console.log('👤 Creating default user...');
    await connection.execute(`
      INSERT IGNORE INTO users (id, openId, name, email, role) 
      VALUES (1, 'default-user', 'Default User', 'user@example.com', 'user')
    `);
    
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   Database: ${dbName}`);
    console.log('   Tables: users, credentials, repositoryCache');
    console.log('   Default user created with ID: 1');
    console.log('');
    console.log('🚀 You can now start the application with: pnpm dev:full');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();