CREATE TABLE `credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`githubPat` text,
	`llmApiKey` text,
	`llmModel` varchar(128) DEFAULT 'gpt-4o',
	`llmBaseUrl` varchar(512) DEFAULT 'https://api.openai.com/v1',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repositoryCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`repoName` varchar(256) NOT NULL,
	`description` text,
	`defaultBranch` varchar(128) DEFAULT 'main',
	`url` varchar(512),
	`lastSyncedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repositoryCache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repositoryCache` ADD CONSTRAINT `repositoryCache_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;