import { QueryResultRow, sql, TaggedTemplateLiteralInvocation } from "slonik";
import { SimpleLookup } from "./types";

export const getSimpleLookupQuery = (lookUpData: SimpleLookup) => {
  return sql`WHERE ${sql.identifier([lookUpData.field])}=${lookUpData.value}`;
};

export function getExitsQuery(
  modelName: string,
  lookupQuery: TaggedTemplateLiteralInvocation<QueryResultRow>
) {
  return sql`SELECT 1 from ${sql.identifier([modelName])} ${lookupQuery}`;
}
