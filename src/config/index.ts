import "dotenv/config";
import { parseDsn } from "slonik";
import { config as devConfig } from "./dev";
import { config as testConfig } from "./testing";
const env = process.env.NODE_ENV || "development";

export type StageConfig = {
  db_example_url: string;
};

// TODO: Create something more robust, than a fake default

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/api-design-test";

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "testing",
  port: 8080,
  dbUrl,
  dbOptions: parseDsn(dbUrl),
  jwtSecret: process.env.JWT_SECRET || "avoid_this_default",
  jwtExp: process.env.JWT_EXP || "100d",
};

let envConfig: StageConfig;

switch (env) {
  case "development":
    envConfig = devConfig;
    break;
  case "testing":
    envConfig = testConfig;
    break;
  default:
    envConfig = devConfig;
}

const allConfig = { ...baseConfig, ...envConfig };

export default allConfig;
