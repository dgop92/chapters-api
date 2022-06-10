import db from "@db/db";
import { sql } from "slonik";
import { ResourceNotFoundError } from "./customErrors";
import { getSimpleLookupQuery } from "./genericQueries";
import { SimpleLookup } from "./types";

export async function checkResourceExists(
  modelName: string,
  lookupData: SimpleLookup
) {
  const lookupQuery = getSimpleLookupQuery(lookupData);

  const recordExits = await db.exists(
    sql`SELECT 1 FROM ${sql.identifier([modelName])} ${lookupQuery}`
  );
  if (!recordExits) {
    throw new ResourceNotFoundError(modelName);
  }

  return recordExits;
}
