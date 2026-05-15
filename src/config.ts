import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile()

export type APIConfig = {
  fileserverHits: number
};

export type DBconfig = {
  url: string,
  migrationConfig: MigrationConfig
}

const apiConfig: APIConfig = {
    fileserverHits: 0
}

const dbConfig: DBconfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
}

export const config = {
  api: apiConfig,
  db: dbConfig
}

function envOrThrow(key: string) {
  const value = process.env[key]
  if (value){
    return value
  }else{
    throw new Error("Something has gone wrong")
  }
 
}
