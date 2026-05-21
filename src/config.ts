import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile()

export type APIConfig = {
  fileserverHits: number,
  platform: string
  p_key: string
};

export type DBconfig = {
  url: string,
  migrationConfig: MigrationConfig
}
export type JWTConfig = {
  key: string
}

const apiConfig: APIConfig = {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    p_key: envOrThrow("POLKA_KEY")
}

const dbConfig: DBconfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
}

const jwtConfig: JWTConfig ={
  key: envOrThrow("JWT_SECRET")
}

export const config = {
  api: apiConfig,
  db: dbConfig,
  jwt: jwtConfig
}

function envOrThrow(key: string) {
  const value = process.env[key]
  if (value){
    return value
  }else{
    throw new Error("Something has gone wrong")
  }
 
}
