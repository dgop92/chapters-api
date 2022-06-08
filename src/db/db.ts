import { createPool } from "slonik";
import config from "../config/index";

/* let extraPoolOptions = {};
if (config.isTest) {
  extraPoolOptions = {
    port: 5432,
    max: 1,
    idleTimeoutMillis: 0,
  };
} */

const pool = createPool(config.dbUrl);

export const disconnect = () => {
  try {
    pool.end();
  } catch (e) {
    console.error(e);
  }
};

export default pool;
