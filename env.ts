export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "default-dev-secret-change-in-production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  apiUrl: process.env.VITE_API_URL ?? "",
};

// Validate required environment variables
if (!ENV.cookieSecret || ENV.cookieSecret === "default-dev-secret-change-in-production") {
  if (ENV.isProduction) {
    throw new Error("JWT_SECRET environment variable is required in production");
  } else {
    console.warn("⚠️  Using default JWT_SECRET. Set JWT_SECRET environment variable for security.");
  }
}

if (!ENV.databaseUrl) {
  console.warn("⚠️  DATABASE_URL not configured. Database operations will fail.");
}
