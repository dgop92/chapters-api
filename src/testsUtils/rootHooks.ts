import db, { disconnect } from "@db/db";
import { sql } from "slonik";

const getAllTablesQuery = sql`SELECT "table_name" FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'; `;

export const mochaHooks = {
  async afterAll(done: () => void) {
    console.log("Disconnect pool");
    disconnect();
    done();
  },
  async beforeEach() {
    const res = (await db.many(getAllTablesQuery)) as Array<{
      table_name: string;
    }>;
    const tableNames = res.map((e) => sql.identifier([e.table_name]));
    const truncateQuery = sql`TRUNCATE ${sql.join(tableNames, sql`, `)}`;
    await db.query(truncateQuery);
    return res;
  },
};
