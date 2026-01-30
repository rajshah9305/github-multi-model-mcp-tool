#!/usr/bin/env node

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/github_mcp';

async function setupDatabase() {
  try {
    // Parse connection string to get database name
    const url = new URL(DATABASE_URL);
    const dbName = url.pathname.slice(1);
    const baseUrl = `${url.protocol}//${url.username}:${url.password}@${url.host}`;
    
    // Connect without database to create it
    const connection = await mysql.createConnection(baseUrl);
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);
    
    await connection.end();
    
    // Connect to the database and create tables
    const dbConnection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(dbConnection);
    
    // Create tables manually since we don't have migrations set up
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openId VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320),
        loginMethod VARCHAR(64),
        role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    await dbConnection.execute(`
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
    
    await dbConnection.execute(`
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
    
    // Insert a default user for development
    await dbConnection.execute(`
      INSERT IGNORE INTO users (id, openId, name, email, role) 
      VALUES (1, 'dev-user', 'Development User', 'dev@example.com', 'user')
    `);
    
    console.log('Database tables created successfully');
    console.log('Default user created (ID: 1)');
    
    await dbConnection.end();
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();