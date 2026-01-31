#!/usr/bin/env node

import initSqlJs from 'sql.js';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite.db';

console.log(`📌 Using database: ${DATABASE_URL}`);

async function setupDatabase() {
  try {
    const SQL = await initSqlJs();
    let db;
    
    if (fs.existsSync(DATABASE_URL)) {
      console.log("Loading existing database...");
      const buffer = fs.readFileSync(DATABASE_URL);
      db = new SQL.Database(buffer);
    } else {
      console.log("Creating new database...");
      db = new SQL.Database();
    }
    
    console.log('📦 Creating tables...');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        openId TEXT NOT NULL UNIQUE,
        name TEXT,
        email TEXT,
        loginMethod TEXT,
        role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        createdAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        lastSignedIn INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
      )
    `);

    // Create credentials table
    db.run(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        githubPat TEXT,
        llmApiKey TEXT,
        llmModel TEXT DEFAULT 'gpt-4o',
        llmBaseUrl TEXT DEFAULT 'https://api.openai.com/v1',
        createdAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create repository cache table
    db.run(`
      CREATE TABLE IF NOT EXISTS repositoryCache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        repoName TEXT NOT NULL,
        description TEXT,
        defaultBranch TEXT DEFAULT 'main',
        url TEXT,
        lastSyncedAt INTEGER DEFAULT (unixepoch() * 1000),
        createdAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('👤 Creating default user...');
    const now = Date.now();
    
    db.run(`
      INSERT OR IGNORE INTO users (id, openId, name, email, role, createdAt, updatedAt, lastSignedIn)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [1, 'default-user', 'Default User', 'user@example.com', 'user', now, now, now]);

    console.log('💾 Saving database to disk...');
    const data = db.export();
    fs.writeFileSync(DATABASE_URL, Buffer.from(data));

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   Database File: ${DATABASE_URL}`);
    console.log('   Tables: users, credentials, repositoryCache');
    console.log('   Default user created with ID: 1');
    console.log('');
    console.log('🚀 You can now start the application with: pnpm dev:full');
    
    db.close();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
